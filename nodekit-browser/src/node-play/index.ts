import type {Node} from "../types/node.ts";
import type {Action, SensorValue, TimeoutAction} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import {type EffectBinding, HideCursorEffectBinding} from "../board-view/effect-bindings";

import type {AssetManager} from "../asset-manager";

import type {CardId, SensorId} from "../types/common.ts";
import {KeyStream} from "../input-streams/key-stream.ts";
import {PointerStream} from "../input-streams/pointer-stream.ts";
import {Clock} from "../clock.ts";
import type {SensorEvent} from "../types/events/node-events.ts";

export interface NodePlayRunResult {
    action: Record<SensorId, SensorValue>;
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
    public root: HTMLDivElement
    private boardView: BoardView
    public node: Node;
    private prepared: boolean = false;
    private started: boolean = false;

    // Event schedules:
    private scheduler: EventScheduler

    // Resolvers
    private deferredAction: Deferred<Action> = new Deferred<Action>()
    private currentSensorValues: Record<SensorId, SensorValue | null>

    // Assets
    private assetManager: AssetManager;

    constructor(
        node: Node,
        assetManager: AssetManager,
    ) {
        this.boardView = new BoardView(node.board_color);
        this.root = this.boardView.root;
        this.node = node;
        this.scheduler = new EventScheduler();
        this.assetManager=assetManager;

        this.currentSensorValues = {};

    }

    public async prepare() {
        const clock = new Clock();
        const keyStream = new KeyStream(clock);
        const pointerStream = new PointerStream(this.root, clock);

        let assetManager = this.assetManager

        // Prepare and schedule Cards:
        for (let cardIdUnbranded in this.node.cards) {
            // Type annotate cardId:
            let cardId = cardIdUnbranded as CardId;

            const card = this.node.cards[cardId];

            // Prepare Cards:
            await this.boardView.prepareCard(
                cardId,
                card,
                assetManager,
            )

            // Schedule CardView start:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: card.start_msec,
                    triggerFunc: () => {
                        this.boardView.startCard(cardId);
                    }
                }
            )

            // Schedule CardView stop:
            if (card.end_msec !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: card.end_msec,
                        triggerFunc: () => {
                            this.boardView.stopCard(cardId)
                        },
                    }
                )
            }

            // Schedule Card destruction:
            this.scheduler.scheduleOnStop(
                () => {this.boardView.destroyCard(cardId)}
            )
        }

        // Prepare and schedule Sensors:
        for (let sensorIdUnbranded in this.node.sensors) {
            const sensorId = sensorIdUnbranded as SensorId;
            // Prepare Sensor:
            const sensor = this.node.sensors[sensorId as SensorId];
            const sensorBindingId = this.boardView.prepareSensor(
                sensor,
                keyStream,
                pointerStream,
                clock,
            )

            // Schedule Sensor arming, if a TemporallyBoundedSensor:
            if (sensor.sensor_type === 'ClickSensor' || sensor.sensor_type === 'KeySensor' || sensor.sensor_type === 'SubmitSensor') {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: sensor.start_msec,
                        triggerFunc: () => {
                            this.boardView.startSensor(sensorBindingId)

                        },
                    }
                )

                // Schedule Sensor disarming:
                if (sensor.end_msec !== null) {
                    this.scheduler.scheduleEvent(
                        {
                            triggerTimeMsec: sensor.end_msec,
                            triggerFunc: () => {
                                this.boardView.destroySensor(sensorBindingId)

                            },
                        }
                    )
                }
            }
            // Schedule Sensor firing if a TimeoutSensor:
            else if (sensor.sensor_type === 'WaitSensor') {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: sensor.until_msec,
                        triggerFunc: () => {
                            this.boardView.startSensor(sensorBindingId);

                        },
                    }
                )
            }
            else {
                const neverSensor: never = sensor;
                throw new Error(`Unknown Sensor type: ${JSON.stringify(neverSensor)}`);
            }

            // Schedule Sensor destruction at Node end:
            this.scheduler.scheduleOnStop(
                () => {this.boardView.destroySensor(sensorBindingId)}
            )

            // Subscribe to sensor binding
            sensorBinding.subscribe(this.sensorEventHandler)

            this.currentSensorValues[sensorId] = null;
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

    private sensorEventHandler(sensorEvent: SensorEvent){
        // Record sensor value update
        switch (sensorEvent.event_type){
            case 'SensorFiredEvent':
                this.currentSensorValues[sensorEvent.sensor_id] = sensorEvent.sensor_value;
                break;
            case "SensorTimedOutEvent":
                // If a value hasn't been set yet, set it to the TimeoutAction
                if (this.currentSensorValues[sensorEvent.sensor_id] === null){
                    this.currentSensorValues[sensorEvent.sensor_id] = {
                        action_type: 'TimeoutAction'
                    } as TimeoutAction;
                }
                break;
            default:
                const neverEvent: never = sensorEvent;
                throw new Error(`Unknown Sensor event: ${JSON.stringify(neverEvent)}`);
        }

        // Check if all sensors reported
        let action: Record<SensorId, SensorValue> = {}
        for (let sensorIdUnbranded in this.currentSensorValues){
            const sensorId = sensorIdUnbranded as SensorId;
            if (this.currentSensorValues[sensorId] === null) {
                return
            }
            action[sensorId] = this.currentSensorValues[sensorId];
        }

        // Resolve
        this.deferredAction.resolve(action)

    }

    async run(): Promise<NodePlayRunResult> {
        // Run the NodePlay, returning a Promise which resolves when a Sensor fires and the corresponding Reinforcer has completed.
        if (!this.prepared) {
            // Prepare the NodePlay
            console.warn('Running a NodePlay without preparing it first!')
            await this.prepare()
        }

        if (this.started) {
            throw new Error('NodePlay already started');
        }

        this.boardView.setBoardState(true, true);
        this.started = true;

        // Kick off scheduler:
        this.scheduler.start()

        // Wait for Action:
        const action = await this.deferredAction.promise;

        // Clean up NodePlay:
        this.scheduler.stop();
        this.boardView.reset();

        return {
            action: action,
        }
    }
}
