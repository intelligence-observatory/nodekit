import type {Node} from "../types/timeline.ts";
import type {Action} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import {type EffectBinding, HideCursorEffectBinding} from "../board-view/effect-bindings/effect-bindings.ts";

import {performanceNowToISO8601} from "../utils.ts";
import type {ISO8601, SensorId} from "../types/common.ts";
import type {AssetManager} from "../asset-manager";

//
export interface PlayNodeResult {
    timestamp_start: ISO8601;
    timestamp_end: ISO8601;
    action: Action;
}

class Deferred<T> {
    public readonly promise: Promise<T>
    private resolveFunc!: (value: T) => void;
    private alreadyCalled: boolean = false;
    constructor(){
        this.promise = new Promise<T>(
            res => {
                this.resolveFunc = res;
            }
        )
    }
    resolve(value: T){
        if (this.alreadyCalled) {
            console.warn("Warning: DeferredValue.resolve called multiple times; ignoring subsequent calls.", value);
            return
        }
        this.alreadyCalled = true;
        this.resolveFunc(value);
    }
}

export class NodePlay {
    public boardView: BoardView
    public node: Node;
    private prepared: boolean = false;
    private started: boolean = false;

    // Event schedules:
    private scheduler: EventScheduler
    private outcomeSchedulers: Record<SensorId, EventScheduler>

    // Resolvers
    private deferredAction = new Deferred<Action>();
    private deferredOutcomeDone = new Deferred<void>();


    constructor(
        node: Node,
        boardView: BoardView,
    ) {
        this.boardView = boardView;
        this.node = node;
        this.scheduler = new EventScheduler();
        this.outcomeSchedulers = {};
    }

    public async prepare(assetManager: AssetManager) {
        let setupPromises: Promise<void>[] = [];

        // Prepare and schedule Cards:
        for (const card of this.node.cards) {
            // Prepare Cards:
            setupPromises.push(
                this.boardView.prepareCard(
                    card,
                    assetManager,
                )
            );

            // Schedule CardView start:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: card.t_start,
                    triggerFunc: () => {this.boardView.startCard(card.card_id)}
                }
            )

            // Schedule CardView stop:
            if (card.t_end !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: card.t_end,
                        triggerFunc: () => {this.boardView.stopCard(card.card_id)},
                    }
                )
            }

            // Schedule Card destruction:
            this.scheduler.scheduleOnStop(
                () => {this.boardView.destroyCard(card.card_id)}
            )
        }
        // Await all Card preparations, as some Sensors may depend on Cards being ready:
        await Promise.all(setupPromises);

        // Prepare and schedule Sensors:
        for (const sensor of this.node.sensors) {
            // Prepare Sensor:
            this.boardView.prepareSensor(
                sensor,
                action => this.deferredAction.resolve(action)
            )

            // Schedule Sensor start:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: sensor.t_start,
                    triggerFunc: () => {this.boardView.startSensor(sensor.sensor_id)},
                }
            )

            // Schedule Sensor destruction:
            this.scheduler.scheduleOnStop(
                () => {this.boardView.destroySensor(sensor.sensor_id)}
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

            // Schedule effects always end
            this.scheduler.scheduleOnStop(
                () => {
                    effectBinding.stop();
                }
            )
        }

        // Buffer and prepare ALL potential Outcomes ahead of time:
        let outcomeSetupPromises: Promise<void>[] = [];
        for (const outcome of this.node.outcomes) {
            const outcomeEventScheduleCur = new EventScheduler()

            // Prepare and schedule outcome.Cards:
            let maxEndTime: number = 0;
            for (const card of outcome.cards) {
                // Prepare Cards:
                outcomeSetupPromises.push(
                    this.boardView.prepareCard(
                        card,
                        assetManager,
                    )
                );
                // Schedule:
                outcomeEventScheduleCur.scheduleEvent(
                    {
                        triggerTimeMsec: card.t_start,
                        triggerFunc: () => {this.boardView.startCard(card.card_id)}
                    }
                )
                if (card.t_end !== null) {
                    outcomeEventScheduleCur.scheduleEvent(
                        {
                            triggerTimeMsec: card.t_end,
                            triggerFunc: () => {this.boardView.stopCard(card.card_id)},
                        }
                    )
                    if (card.t_end > maxEndTime) {
                        maxEndTime = card.t_end;
                    }
                } else {
                    throw new Error(`Consequence Cards must have an end time: ${card.card_id} `);
                }
            }
            // Schedule outcome resolver:
            outcomeEventScheduleCur.scheduleEvent(
                {
                    triggerTimeMsec: maxEndTime,
                    triggerFunc: () => {this.deferredOutcomeDone.resolve()},
                }
            )

            // Attach:
            this.outcomeSchedulers[outcome.sensor_id] = outcomeEventScheduleCur;
        }
        // Await all outcome preparations:
        await Promise.all(outcomeSetupPromises);


        this.prepared = true;
    }

    async run(): Promise<PlayNodeResult> {
        // Run the NodePlay, returning a Promise which resolves when a Sensor fires and the corresponding Reinforcer has completed.
        if (!this.prepared) {
            // Prepare the NodePlay
            throw new Error('NodePlay not prepared');
        }

        if (this.started) {
            throw new Error('NodePlay already started');
        }

        this.started = true;

        // Kick off scheduler:
        const timestampStart = performance.now();
        this.scheduler.start()

        // Wait for a Sensor to fire:
        const action = await this.deferredAction.promise;
        this.scheduler.stop();

        // Run an outcome, if one is provided for the given sensorId:
        const sensorId = action.sensor_id;
        if (sensorId in this.outcomeSchedulers) {
            const outcomeSchedule = this.outcomeSchedulers[sensorId];
            outcomeSchedule.start();
            // Wait for the outcome to finish:
            await this.deferredOutcomeDone.promise;
            outcomeSchedule.stop();
        }
        return {
            action: action,
            timestamp_start: performanceNowToISO8601(timestampStart),
            timestamp_end: performanceNowToISO8601(performance.now()),
        }
    }
}
