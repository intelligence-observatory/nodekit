import type {Node} from "../types/node.ts";
import type {Action} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import type {AssetManager} from "../asset-manager";
import {createCardView} from "../board-view/card-views/create.ts";
import {createSensorBinding} from "../board-view/sensor-bindings/create-sensor-binding.ts";
import type {Clock} from "../clock.ts";
import {Deferred} from "../utils.ts";
import type {TimeElapsedMsec} from "../types/value.ts";

export interface NodePlayRunResult {
    tStart: TimeElapsedMsec,
    action: Action;
    tEnd: TimeElapsedMsec,
}

export class NodePlay {
    public root: HTMLDivElement
    private node: Node;
    private boardView: BoardView
    private prepared: boolean = false;
    private started: boolean = false;
    private scheduler: EventScheduler
    private deferredAction: Deferred<Action> = new Deferred<Action>()
    private assetManager: AssetManager;

    constructor(
        node: Node,
        assetManager: AssetManager,
        clock: Clock,
    ) {
        this.boardView = new BoardView(node.board_color, clock);
        this.root = this.boardView.root;
        this.node = node;
        this.scheduler = new EventScheduler();
        this.assetManager=assetManager;
    }

    async prepare() {

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
        const tStart = this.boardView.clock.now()
        this.started = true;

        // Kick off scheduler:
        this.scheduler.start()

        // Wait for Action:
        const action = await this.deferredAction.promise;

        // Clean up NodePlay:
        this.scheduler.stop();
        const tEnd = this.boardView.clock.now()

        return {
            tStart:tStart,
            tEnd:tEnd,
            action: action,
        }
    }
}

