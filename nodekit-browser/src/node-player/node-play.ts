import type {Node} from "../types/node.ts";
import type {Action} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import {type EffectBinding, HideCursorEffectBinding} from "../board-view/effect-bindings/effect-bindings.ts";

import type {AssetManager} from "../asset-manager";
import type {SensorIndex} from "../types/events";

export interface PlayNodeResult {
    domTimestampStart: DOMHighResTimeStamp;
    domTimestampAction: DOMHighResTimeStamp
    domTimestampEnd: DOMHighResTimeStamp;
    sensorIndex: SensorIndex;
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
interface SensorFiring {
    sensorIndex: SensorIndex;
    domTimestampAction: DOMHighResTimeStamp;
    action: Action;
}

export class NodePlay {
    public boardView: BoardView
    public node: Node;
    private prepared: boolean = false;
    private started: boolean = false;

    // Event schedules:
    private scheduler: EventScheduler
    private outcomeSchedulers: Record<SensorIndex, EventScheduler>

    // Resolvers
    private deferredSensorFiring = new Deferred<SensorFiring>();
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

        // Prepare and schedule Cards:
        for (const card of this.node.cards) {
            // Prepare Cards:
            const cardViewId = await this.boardView.prepareCard(
                card,
                assetManager,
            )

            // Schedule CardView start:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: card.start_msec,
                    triggerFunc: () => {this.boardView.startCard(cardViewId)}
                }
            )

            // Schedule CardView stop:
            if (card.end_msec !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: card.end_msec,
                        triggerFunc: () => {this.boardView.stopCard(cardViewId)},
                    }
                )
            }

            // Schedule Card destruction:
            this.scheduler.scheduleOnStop(
                () => {this.boardView.destroyCard(cardViewId)}
            )
        }

        // Prepare and schedule Sensors:
        for (let sensorIndex = 0 as SensorIndex; sensorIndex < this.node.sensors.length; sensorIndex++) {
            // Prepare Sensor:
            const sensor = this.node.sensors[sensorIndex];
            const sensorBindingId = this.boardView.prepareSensor(
                sensor,
                (action, domTimestampAction) => this.deferredSensorFiring.resolve({
                    sensorIndex: sensorIndex as SensorIndex,
                    domTimestampAction: domTimestampAction,
                    action: action,
                })
            )

            // Schedule Sensor start:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: sensor.start_msec,
                    triggerFunc: () => {this.boardView.startSensor(sensorBindingId)},
                }
            )

            // Schedule Sensor destruction:
            this.scheduler.scheduleOnStop(
                () => {this.boardView.destroySensor(sensorBindingId)}
            )

            if (!sensor.outcome) {
                continue; // No outcome to prepare
            }

            console.log(sensor)
            // Buffer the Sensor outcome:
            const outcome = sensor.outcome;
            const outcomeEventScheduleCur = new EventScheduler()

            // Prepare and schedule outcome.Cards:
            let maxEndTime: number = 0;
            for (const card of outcome.cards) {
                // Prepare Cards:

                const cardViewId = await this.boardView.prepareCard(
                    card,
                    assetManager,
                )
                // Schedule:
                outcomeEventScheduleCur.scheduleEvent(
                    {
                        triggerTimeMsec: card.start_msec,
                        triggerFunc: () => {this.boardView.startCard(cardViewId)}
                    }
                )
                if (card.end_msec !== null) {
                    outcomeEventScheduleCur.scheduleEvent(
                        {
                            triggerTimeMsec: card.end_msec,
                            triggerFunc: () => {this.boardView.stopCard(cardViewId)},
                        }
                    )
                    if (card.end_msec > maxEndTime) {
                        maxEndTime = card.end_msec;
                    }
                } else {
                    throw new Error(`Consequence Cards must have an end time: ${card} `);
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
            this.outcomeSchedulers[sensorIndex] = outcomeEventScheduleCur;
        }

        // Prepare and schedule Effects:
        for (const effect of this.node.effects){
            // Initialize the Effect binding // todo
            // There is only one EffectBinding type for now, so just instantiate it directly:
            const effectBinding: EffectBinding = new HideCursorEffectBinding(this.boardView)
            // Schedule the effect start
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: effect.start_msec,
                    triggerFunc: () => {
                        effectBinding.start();
                    },
                }
            )

            // Schedule the effect end, if applicable
            if (effect.end_msec !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: effect.end_msec,
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
        const domTimestampStart = performance.now();
        this.scheduler.start()

        // Wait for a Sensor to fire:
        const sensorFiring = await this.deferredSensorFiring.promise;
        this.scheduler.stop();

        // Run the Outcome (if any) for the Sensor:
        const sensorIndex = sensorFiring.sensorIndex;
        if (sensorIndex in this.outcomeSchedulers) {
            const outcomeSchedule = this.outcomeSchedulers[sensorIndex];
            outcomeSchedule.start();
            // Wait for the outcome to finish:
            await this.deferredOutcomeDone.promise;
            outcomeSchedule.stop();
        }

        return {
            sensorIndex: sensorFiring.sensorIndex,
            action: sensorFiring.action,
            domTimestampStart: domTimestampStart,
            domTimestampAction: sensorFiring.domTimestampAction,
            domTimestampEnd: performance.now(),
        }
    }
}
