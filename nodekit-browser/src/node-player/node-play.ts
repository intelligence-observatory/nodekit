import type {Node} from "../types/node.ts";
import type {Action} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import {type EffectBinding, HideCursorEffectBinding} from "../board-view/effect-bindings/effect-bindings.ts";

import type {AssetManager} from "../asset-manager";

import type {SensorId} from "../types/common.ts";

export interface PlayNodeResult {
    domTimestampStart: DOMHighResTimeStamp;
    domTimestampAction: DOMHighResTimeStamp
    domTimestampEnd: DOMHighResTimeStamp;
    sensorId: SensorId;
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
    sensorId: SensorId;
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

    // Resolvers
    private deferredSensorFiring = new Deferred<SensorFiring>();

    constructor(
        node: Node,
    ) {
        this.boardView = new BoardView(node.board);
        this.node = node;
        this.scheduler = new EventScheduler();
    }

    public async prepare(assetManager: AssetManager) {

        // Prepare and schedule Cards:
        for (let cardIndex = 0; cardIndex < this.node.cards.length; cardIndex++) {
            const card = this.node.cards[cardIndex];
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
        for (let sensorId in this.node.sensors) {
            // Prepare Sensor:
            const sensor = this.node.sensors[sensorId as SensorId];
            const sensorBindingId = this.boardView.prepareSensor(
                sensor,
                (action, domTimestampAction) => this.deferredSensorFiring.resolve({
                    sensorId: sensorId as SensorId,
                    domTimestampAction: domTimestampAction,
                    action: action,
                })
            )

            // Schedule Sensor arming, if a TemporallyBoundedSensor:
            if (sensor.sensor_type === 'ClickSensor' || sensor.sensor_type === 'KeySensor') {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: sensor.start_msec,
                        triggerFunc: () => {this.boardView.startSensor(sensorBindingId)},
                    }
                )

                // Schedule Sensor disarming:
                if (sensor.end_msec !== null) {
                    this.scheduler.scheduleEvent(
                        {
                            triggerTimeMsec: sensor.end_msec,
                            triggerFunc: () => {this.boardView.destroySensor(sensorBindingId)},
                        }
                    )

                }
            }

            // Schedule Sensor firing if a WaitSensor:
            if (sensor.sensor_type === 'WaitSensor') {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: sensor.wait_msec,
                        triggerFunc: () => {this.boardView.startSensor(sensorBindingId)},
                    }
                )
            }

            // Schedule Sensor destruction at Node end:
            this.scheduler.scheduleOnStop(
                () => {this.boardView.destroySensor(sensorBindingId)}
            )
        }

        // Prepare and schedule Effects:
        for (const effect of this.node.effects){
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

        this.boardView.setBoardState(true, true);

        this.started = true;

        // Kick off scheduler:
        const domTimestampStart = performance.now();
        this.scheduler.start()

        // Wait for a Sensor to fire:
        const sensorFiring = await this.deferredSensorFiring.promise;
        this.scheduler.stop();
        this.boardView.reset();

        return {
            sensorId: sensorFiring.sensorId,
            action: sensorFiring.action,
            domTimestampStart: domTimestampStart,
            domTimestampAction: sensorFiring.domTimestampAction,
            domTimestampEnd: performance.now(),
        }
    }
}
