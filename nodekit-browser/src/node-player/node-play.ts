import type {Node} from "../types/node-graph.ts";
import type {Action} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import {type EffectBinding, HideCursorEffectBinding} from "../board-view/effect-bindings/effect-bindings.ts";

import {performanceNowToISO8601} from "../utils.ts";
import type {ISO8601} from "../types/common.ts";
import type {Card} from "../types/cards";

//
export interface PlayNodeResult {
    timestamp_start: ISO8601;
    timestamp_end: ISO8601;
    action: Action;
}

export class NodePlay {
    public boardView: BoardView
    public node: Node;
    private prepared: boolean = false;
    private started: boolean = false;
    private terminated: boolean = false;

    // Event scheduler:
    private scheduler: EventScheduler
    private abortController: AbortController = new AbortController();

    // Resolvers
    private resolvePlay!: (result: Action) => void;

    constructor(
        node: Node,
        boardView: BoardView,
    ) {
        this.boardView = boardView;
        this.node = node;
        this.scheduler = new EventScheduler(this.abortController.signal);
    }

    public async prepare() {

        // Prepare and schedule Cards:
        let setupPromises: Promise<void>[] = [];
        for (const card of this.node.cards) {
            // Prepare Cards:
            setupPromises.push(
                this.boardView.prepareCard(card)
            );

            // Schedule CardView display event:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: card.t_start,
                    triggerFunc: () => {this.boardView.showCard(card.card_id)}
                }
            )

            // Schedule hiding of the Card, if it has non-null t_end:
            if (card.t_end !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: card.t_end,
                        triggerFunc: () => {this.boardView.hideCard(card.card_id)},
                    }
                )
            }
        }
        await Promise.all(setupPromises);

        // Prepare and schedule Sensors:
        for (const sensor of this.node.sensors) {
            // First, mount an unarmed sensor now:
            this.boardView.prepareSensor(
                sensor,
                action => this.reportSensorFired(action)
            )

            // Schedule arming of the Sensor:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: sensor.t_start,
                    triggerFunc: () => {this.boardView.armSensor(sensor.sensor_id)},
                }
            )
        }

        // Prepare and schedule Effects:
        for (const effect of this.node.effects){
            // Initialize the Effect binding // todo
            // There is only one EffectBinding type for now, so just instantiate it directly:
            const effectBinding: EffectBinding = new HideCursorEffectBinding(this.boardView)
            // Schedule the effect start
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: effect.t_start,
                    triggerFunc: () => {
                        effectBinding.start();
                    },
                }
            )

            // Schedule the effect end, if applicable
            if (effect.t_end !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: effect.t_end,
                        triggerFunc: () => {
                            effectBinding.stop();
                        },
                    }
                )
            }
        }

        // Todo: prepare and schedule Outcome Boards

        // Todo: schedule destruction of Cards, Sensors, Effects, Outcome Boards

        this.prepared = true;
    }

    async run(): Promise<PlayNodeResult> {
        // Run the NodePlay, returning a Promise which resolves when a Sensor fires and the corresponding Reinforcer has completed.
        if (!this.prepared) {
            // Prepare the NodePlay
            await this.prepare();
        }

        if (this.started) {
            throw new Error('NodePlay already started');
        }

        this.started = true;

        // Create Promise to capture Sensor trigger:
        const actionDetectedPromise = new Promise(
            (res: (result: Action) => void, _rej) => (this.resolvePlay = res)
        );

        // Kick off scheduler:
        const timestampStart = performance.now();
        this.scheduler.start()
        const result = await actionDetectedPromise;
        const timestampEnd = performance.now();

        // Package return
        return {
            action: result,
            timestamp_start: performanceNowToISO8601(timestampStart),
            timestamp_end: performanceNowToISO8601(timestampEnd),
        }
    }

    private reportSensorFired(
        action: Action
    ) {
        // Guard against double fires:
        if (this.terminated) return;
        this.terminated = true;
        this.abortController.abort(); // Emit the abort signal; will immediately stop any pending scheduled events

        // Reset board
        this.boardView.reset();

        // Get the Consequence Cards for this Action:
        let consequenceCards: Card[] = []
        for (const consequence of this.node.outcomes) {
            if(action.sensor_id === consequence.sensor_id){
                consequenceCards = consequence.cards;
            }
        }

        // Set up the Consequence phase:
        const consequenceScheduler = new EventScheduler(this.abortController.signal);
        let maxTimeMsec = 0;

        // Add Consequence cards
        let setupPromises = [];
        for (const card of consequenceCards) {
            setupPromises.push(this.boardView.prepareCard(card))
        }

        // Play Reinforcer
        Promise.all(setupPromises).then(() => {

                // Schedule events
                for (const card of consequenceCards) {
                    consequenceScheduler.scheduleEvent(
                        {
                            triggerTimeMsec: card.t_start,
                            triggerFunc: () => {
                                this.boardView.showCard(card.card_id);
                            }
                        }
                    )

                    // Schedule hiding of the Card, if not open-ended:
                    if (card.t_end !== null) {
                        consequenceScheduler.scheduleEvent(
                            {
                                triggerTimeMsec: card.t_end,
                                triggerFunc: () => {
                                    this.boardView.hideCard(card.card_id);
                                }
                            }
                        )
                        if (card.t_end > maxTimeMsec) {
                            maxTimeMsec = card.t_end;
                        }
                    } else {
                        throw new Error(`Consequence Cards must have an end time: ${card.card_id} `);
                    }
                }

                // Schedule an Event which resolves the play with the Action:
                consequenceScheduler.scheduleEvent(
                    {
                        triggerTimeMsec: maxTimeMsec,
                        triggerFunc: () => {
                            this.resolvePlay(action)
                        }
                    }
                )
                consequenceScheduler.start()
            }
        )
    }
}
