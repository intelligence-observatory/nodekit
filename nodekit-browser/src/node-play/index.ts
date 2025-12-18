import type {Node} from "../types/node.ts";
import type {Action} from "../types/actions.ts";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import type {AssetManager} from "../asset-manager";
import {createCardView} from "../board-view/card-views/create.ts";
import {createSensorBinding} from "../board-view/sensor-bindings/create-sensor-binding.ts";
import type {Clock} from "../clock.ts";
import {Deferred} from "../utils.ts";
import type {NodeAddress} from "../types/values.ts";
import type {EventArray} from "../event-array.ts";
import type {ActionTakenEvent, KeySampledEvent, NodeEndedEvent, NodeStartedEvent, PointerSampledEvent} from "../types/events";


export class NodePlay {
    public root: HTMLDivElement
    private node: Node;
    private boardView: BoardView
    private prepared: boolean = false;
    private started: boolean = false;
    private scheduler: EventScheduler
    private deferredAction: Deferred<Action> = new Deferred<Action>()
    private assetManager: AssetManager;
    private eventArray: EventArray;
    private nodeAddress: NodeAddress;

    constructor(
        nodeAddress: NodeAddress,
        node: Node,
        assetManager: AssetManager,
        clock: Clock,
        eventArray: EventArray,
    ) {
        this.eventArray = eventArray;
        this.boardView = new BoardView(node.board_color, clock);
        this.root = this.boardView.root;
        this.nodeAddress = nodeAddress;
        this.node = node;
        this.scheduler = new EventScheduler();
        this.assetManager=assetManager;

    }

    async prepare() {


        // Have the input streams push to the event stream: todo despaghetti
        const unsubscribePointer = this.boardView.pointerStream.subscribe(
            (pointerSample) => {
                const e: PointerSampledEvent = {
                    event_type: 'PointerSampledEvent',
                    t: pointerSample.t,
                    x: pointerSample.x,
                    y: pointerSample.y,
                    kind: pointerSample.sampleType,
                }
                this.eventArray.push(e)
            }
        )
        const unsubscribeKey = this.boardView.keyStream.subscribe(
            (keySample) => {
                const e: KeySampledEvent = {
                    event_type: 'KeySampledEvent',
                    t: keySample.t,
                    key: keySample.key,
                    kind: keySample.sampleType,
                }
                this.eventArray.push(e)
            }
        )

        this.scheduler.scheduleOnStop(
            () => {
                unsubscribePointer()
                unsubscribeKey()
            }
        )

        // Create Stimulus CardView:
        if (this.node.stimulus){
            const cardView = await createCardView(
                this.node.stimulus,
                this.boardView,
                this.assetManager,
            )

            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: 0,
                    triggerFunc: () => {
                        cardView.onStart()
                    },
                }
            )

            this.scheduler.scheduleOnStop(
                () => {cardView.onDestroy()}
            )
        }


        // Create SensorBinding:
        const sensorBinding = await createSensorBinding(
            this.node.sensor,
            this.boardView,
            this.assetManager,
        )

        sensorBinding.subscribe(
            (action) => {this.deferredAction.resolve(action)}
        )

        this.scheduler.scheduleEvent(
            {
                triggerTimeMsec: 0,
                triggerFunc: () => {
                    sensorBinding.start();
                },
            }
        )

        if (this.node.hide_pointer){
            this.boardView.root.style.cursor = 'none';
        }

        this.prepared = true;
    }

    async run(): Promise<Action> {
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

        // Emit start event:
        const eStart: NodeStartedEvent = {
            event_type: 'NodeStartedEvent',
            t: this.boardView.clock.now(),
            node_address: this.nodeAddress,
            node: this.node,
        }
        this.eventArray.push(eStart)

        this.started = true;

        // Kick off scheduler:
        this.scheduler.start()

        // Wait for Action:
        const action = await this.deferredAction.promise;

        // Emit action event:
        const eAction: ActionTakenEvent = {
            event_type: 'ActionTakenEvent',
            node_address: this.nodeAddress,
            action: action,
            t: this.boardView.clock.now(),
        }
        this.eventArray.push(eAction)

        // Clean up NodePlay:
        this.scheduler.stop();
        const tEnd = this.boardView.clock.now()

        // Emit end event:
        const eEnd: NodeEndedEvent = {
            event_type: 'NodeEndedEvent',
            t: tEnd,
            node_address: this.nodeAddress,
        }
        this.eventArray.push(eEnd)

        return action
    }
}

