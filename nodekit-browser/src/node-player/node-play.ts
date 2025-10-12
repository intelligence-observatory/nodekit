import type {Node} from "../types/node.ts";
import type {Action} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import {type EffectBinding, HideCursorEffectBinding} from "../board-view/effect-bindings/effect-bindings.ts";

import type {AssetManager} from "../asset-manager";

import type {CardId, NodeId, SensorId, TimeElapsedMsec} from "../types/common.ts";
import type {KeyStream} from "../input-streams/key-stream.ts";
import type {PointerStream} from "../input-streams/pointer-stream.ts";
import type {Clock} from "../clock.ts";
import type {EventArray} from "../event-array.ts";
import type {CardHiddenEvent, CardShownEvent, NodeEnteredEvent, NodeExitedEvent, SensorArmedEvent, SensorDisarmedEvent, SensorFiredEvent} from "../types/events";

export interface PlayNodeResult {
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
    t: TimeElapsedMsec;
    sensorId: SensorId;
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
    private nodeId: NodeId;

    constructor(
        nodeId: NodeId,
        node: Node,
    ) {
        this.boardView = new BoardView(node.board_color);
        this.node = node;
        this.nodeId = nodeId;
        this.scheduler = new EventScheduler();
    }

    public async prepare(
        assetManager: AssetManager,
        keyStream: KeyStream,
        pointerStream: PointerStream,
        clock: Clock,
        eventArray: EventArray
    ) {

        // Prepare and schedule Cards:
        for (let cardId in this.node.cards) {
            const card = this.node.cards[cardId as CardId];
            // Prepare Cards:
            const cardViewId = await this.boardView.prepareCard(
                card,
                assetManager,
            )

            // Schedule CardView start:
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: card.start_msec,
                    triggerFunc: () => {
                        this.boardView.startCard(cardViewId);
                        // Emit CardShownEvent:
                        const cardShownEvent: CardShownEvent = {
                            event_type: "CardShownEvent",
                            t: clock.now(),
                            node_id: this.nodeId,
                            card_id: cardId as CardId,
                        }
                        eventArray.push(cardShownEvent);
                    }
                }
            )

            // Schedule CardView stop:
            if (card.end_msec !== null) {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: card.end_msec,
                        triggerFunc: () => {
                            this.boardView.stopCard(cardViewId)

                            // Emit CardHiddenEvent:
                            const cardHiddenEvent: CardHiddenEvent = {
                                event_type: "CardHiddenEvent",
                                t: clock.now(),
                                node_id: this.nodeId,
                                card_id: cardId as CardId,
                            }
                            eventArray.push(cardHiddenEvent);
                        },
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
                (action, tAction) => this.deferredSensorFiring.resolve({
                    sensorId: sensorId as SensorId,
                    t: tAction,
                    action: action,
                }),
                keyStream,
                pointerStream,
                clock,
            )

            // Schedule Sensor arming, if a TemporallyBoundedSensor:
            if (sensor.sensor_type === 'ClickSensor' || sensor.sensor_type === 'KeySensor') {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: sensor.start_msec,
                        triggerFunc: () => {
                            this.boardView.startSensor(sensorBindingId)

                            // Emit SensorArmedEvent:
                            const sensorArmedEvent: SensorArmedEvent = {
                                event_type: "SensorArmedEvent",
                                t: clock.now(),
                                node_id: this.nodeId,
                                sensor_id: sensorId as SensorId,
                            }
                            eventArray.push(sensorArmedEvent);
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
                                // Emit SensorDisarmedEvent:
                                const sensorDisarmedEvent: SensorDisarmedEvent = {
                                    event_type: "SensorDisarmedEvent",
                                    t: clock.now(),
                                    node_id: this.nodeId,
                                    sensor_id: sensorId as SensorId,
                                }
                                eventArray.push(sensorDisarmedEvent);
                            },
                        }
                    )

                }
            }

            // Schedule Sensor firing if a TimeoutSensor:
            if (sensor.sensor_type === 'TimeoutSensor') {
                this.scheduler.scheduleEvent(
                    {
                        triggerTimeMsec: sensor.timeout_msec,
                        triggerFunc: () => {
                            this.boardView.startSensor(sensorBindingId);

                        },
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

    async run(
        clock:Clock,
        eventArray: EventArray,
    ): Promise<PlayNodeResult> {
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

        // Emit start
        const nodeStartEvent: NodeEnteredEvent = {
            event_type: "NodeEnteredEvent",
            t: clock.now(),
            node_id: this.nodeId,
        }
        eventArray.push(nodeStartEvent);

        // Kick off scheduler:
        this.scheduler.start()

        // Wait for a Sensor to fire:
        const sensorFiring = await this.deferredSensorFiring.promise;
        this.scheduler.stop();

        // Emit SensorFiredEvent:
        // Emit SensorFiredEvent:
        const sensorFiredEvent: SensorFiredEvent = {
            event_type: "SensorFiredEvent",
            t: sensorFiring.t,
            node_id: this.nodeId,
            sensor_id: sensorFiring.sensorId,
            action: sensorFiring.action,
        }
        eventArray.push(sensorFiredEvent);

        // Clean up board
        this.boardView.reset();

        // Emit exit
        const nodeExitEvent: NodeExitedEvent = {
            event_type: "NodeExitedEvent",
            t: clock.now(),
            node_id: this.nodeId,
        }
        eventArray.push(nodeExitEvent);

        return {
            sensorId: sensorFiring.sensorId,
            action: sensorFiring.action,
        }
    }
}
