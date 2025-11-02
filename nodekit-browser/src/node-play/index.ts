import type {Node} from "../types/node.ts";
import type {Action, SensorValue} from "../types/actions/";
import {BoardView, createCardView, createSensorBinding} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import {type EffectBinding, HideCursorEffectBinding} from "../board-view/effect-bindings";

import type {AssetManager} from "../asset-manager";

import type {CardId, SensorId} from "../types/common.ts";

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

//
export class NodePlay {
    public root: HTMLDivElement

    private node: Node;
    private boardView: BoardView
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
        let assetManager = this.assetManager

        // Prepare and schedule Cards:
        for (let cardIdUnbranded in this.node.cards) {
            // Type annotate cardId:
            let cardId = cardIdUnbranded as CardId;

            const card = this.node.cards[cardId];

            // Prepare CardViews:
            const cardView = createCardView(
                card,
                this.boardView,
            )
            await cardView.prepare(assetManager)

            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: 0,
                    triggerFunc: () => {
                        cardView.onStart()
                    },
                }
            )
            this.scheduler.scheduleOnStop(
                () => {
                    cardView.onDestroy()
                }
            )
        }

        // Create and subscribe to SensorBindings:
        for (let sensorIdUnbranded in this.node.sensors) {
            const sensorId = sensorIdUnbranded as SensorId;
            const sensor = this.node.sensors[sensorId];
            const sensorBinding = createSensorBinding(
                sensor,
                this.boardView,
            )
            sensorBinding.subscribe(
                (sensorValue: SensorValue): void => (this.sensorEventHandler(sensorId, sensorValue))
            )
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

    private sensorEventHandler(
        sensorId: SensorId,
        sensorValue: SensorValue
    ): void {
        console.log(sensorId, sensorValue)
        // Record sensor value update
        this.currentSensorValues[sensorId] = sensorValue;

        // Check if all sensors reported
        let action: Record<SensorId, SensorValue> = {}
        for (let sensorIdUnbranded in this.currentSensorValues){
            const sensorId = sensorIdUnbranded as SensorId;
            if (this.currentSensorValues[sensorId] === null) {
                return
            }
            action[sensorId] = this.currentSensorValues[sensorId];
        }

        // Resolve once all sensors have had values set at least once
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
        this.boardView.clock.start()
        this.started = true;

        // Kick off scheduler:
        this.scheduler.start()

        // Wait for Action:
        const action = await this.deferredAction.promise;

        // Clean up NodePlay:
        this.scheduler.stop();


        return {
            action: action,
        }
    }
}
