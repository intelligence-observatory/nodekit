import type {Node} from "../types/node-graph.ts";
import type {Action} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {evaluateReinforcerMap, makeNullReinforcer} from "../ops/evaluate-reinforcer-map.ts";
import {EventScheduler} from "./event-scheduler.ts";
import {type EffectBinding, HideCursorEffectBinding} from "../board-view/effect-bindings/effect-bindings.ts";

import {performanceNowToISO8601} from "../utils.ts";
import type {ISO8601} from "../types/common.ts";
import type {Reinforcer} from "../types/reinforcer-maps/reinforcer-maps.ts";

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
    private resolvePlay!: (result: [Action, Reinforcer]) => void;

    constructor(
        node: Node,
        boardView: BoardView,
    ) {
        this.boardView = boardView;
        this.node = node;
        this.scheduler = new EventScheduler(this.abortController.signal);
    }

    public async prepare() {
        // Prepare the NodePlay by setting up the BoardView, Cards, Sensors, and scheduling their events.

        // Instantiate Cards:
        let setupPromises: Promise<void>[] = [];
        for (const card of this.node.cards) {
            // Place Card onto Board:
            setupPromises.push(this.boardView.placeCardHidden(card));
        }
        await Promise.all(setupPromises);

        // Schedule Card events:
        for (const card of this.node.cards) {
            // Schedule CardView display event:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: card.card_timespan.start_time_msec,
                    triggerFunc: () => {this.boardView.showCard(card.card_id)}
                }
            )

            // Schedule hiding of the Card, if not open-ended Timespan:
            if (card.card_timespan.end_time_msec !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: card.card_timespan.end_time_msec,
                        triggerFunc: () => {this.boardView.hideCard(card.card_id)},
                    }
                )
            }
        }

        // Then, mount and schedule Sensors:
        for (const sensor of this.node.sensors) {
            // First, mount an unarmed sensor now:
            this.boardView.placeSensorUnarmed(
                sensor,
                action => this.reportSensorFired(action)
            )

            // Schedule arming of the Sensor:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: sensor.sensor_timespan.start_time_msec,
                    triggerFunc: () => {this.boardView.armSensor(sensor.sensor_id)},
                }
            )

            // Schedule disarming of the Sensor, if not an open-ended Timespan:
            if (sensor.sensor_timespan.end_time_msec !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: sensor.sensor_timespan.end_time_msec,
                        triggerFunc: () => {this.boardView.disarmSensor(sensor.sensor_id)},
                    }
                )
            }
        }

        // Schedule any effects:
        for (const effect of this.node.effects){
            // Initialize the Effect binding
            // There is only one EffectBinding type for now, so just instantiate it directly:
            const effectBinding: EffectBinding = new HideCursorEffectBinding(this.boardView)
            // Schedule the effect start
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: effect.effect_timespan.start_time_msec,
                    triggerFunc: () => {
                        effectBinding.start();
                    },
                }
            )

            // Schedule the effect end, if applicable
            if (effect.effect_timespan.end_time_msec !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: effect.effect_timespan.end_time_msec,
                        triggerFunc: () => {
                            effectBinding.stop();
                        },
                    }
                )
            }
        }

        // Mark:
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

        // Create Promise to capture Sensor and Reinforcer events:
        const donePromise = new Promise(
            (res: (result: [Action, Reinforcer]) => void, _rej) => (this.resolvePlay = res)
        );

        // Kick off scheduler:
        const timestampStart = performance.now();
        this.scheduler.start()
        const result = await donePromise;
        const timestampEnd = performance.now();

        // Package result:
        const [action, _reinforcer] = result;

        // Package return
        return {
            action: action,
            timestamp_start: performanceNowToISO8601(timestampStart),
            timestamp_end: performanceNowToISO8601(timestampEnd),
        }
    }

    private reportSensorFired(
        action: Action,
    ) {
        // Guard against double fires:
        if (this.terminated) return;
        this.terminated = true;
        this.abortController.abort(); // Emit the abort signal; will immediately stop any pending scheduled events

        // Reset board
        this.boardView.reset();

        // Get the Reinforcer for this Action:
        const reinforcer = this.getReinforcer(action);

        // Set up the Reinforcer phase:
        const reinforcerScheduler = new EventScheduler(this.abortController.signal);
        let maxTimeMsec = 0;

        // Add Reinforcer cards
        let setupPromises = [];
        for (const card of reinforcer.reinforcer_cards) {
            setupPromises.push(this.boardView.placeCardHidden(card))
        }

        // Play Reinforcer
        Promise.all(setupPromises).then(() => {

                // Schedule events
                for (const card of reinforcer.reinforcer_cards) {
                    reinforcerScheduler.scheduleEvent(
                        {
                            triggerTimeMsec: card.card_timespan.start_time_msec,
                            triggerFunc: () => {
                                this.boardView.showCard(card.card_id).then();
                            }
                        }
                    )

                    // Schedule hiding of the Card, if not open-ended:
                    if (card.card_timespan.end_time_msec !== null) {
                        reinforcerScheduler.scheduleEvent(
                            {
                                triggerTimeMsec: card.card_timespan.end_time_msec,
                                triggerFunc: () => {
                                    this.boardView.hideCard(card.card_id);
                                }
                            }
                        )
                        if (card.card_timespan.end_time_msec > maxTimeMsec) {
                            maxTimeMsec = card.card_timespan.end_time_msec;
                        }
                    } else {
                        throw new Error(`ReinforcerCard must have an end time: ${card.card_id} `);
                    }
                }

                // Schedule an Event which resolves the play with the Action and Reinforcer:
                reinforcerScheduler.scheduleEvent(
                    {
                        triggerTimeMsec: maxTimeMsec,
                        triggerFunc: () => {
                            this.resolvePlay(
                                [
                                    action,
                                    reinforcer,
                                ]
                            )
                        }
                    }
                )
                reinforcerScheduler.start()
            }
        )
    }

    private getReinforcer(action: Action): Reinforcer {
        // Lookup reinforcer
        const originatingSensorId = action.sensor_id;

        // Try to find the first matching reinforcer map:
        for (const reinforcerMap of this.node.reinforcer_maps) {
            if (reinforcerMap.sensor_id === originatingSensorId) {
                return evaluateReinforcerMap(reinforcerMap, action)
            }
        }

        // Return null Reinforcer, if there is no matching reinforcer map:
        return makeNullReinforcer();
    }
}
