import type {Node, NodePredicate} from "../types/node.ts";
import type {SensorValuesMap, SensorValue, UnresolvedSensorValue} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";
import {type EffectBinding, HideCursorEffectBinding} from "../board-view/effect-bindings";

import type {AssetManager} from "../asset-manager";

import type {CardId, SensorId, TimeElapsedMsec} from "../types/common.ts";


import {createCardView} from "../board-view/card-views/create.ts";
import {createSensorBinding} from "../board-view/sensor-bindings/create.ts";
import type {Clock} from "../clock.ts";
import type {CardView} from "../board-view/card-views/card-view.ts";

export interface NodePlayRunResult {
    t: TimeElapsedMsec,
    outcome: SensorValuesMap;
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

export type CardViewMap = Record<CardId, CardView>
export class NodePlay {
    public root: HTMLDivElement

    private node: Node;
    private boardView: BoardView
    private prepared: boolean = false;
    private started: boolean = false;

    // Event schedules:
    private scheduler: EventScheduler

    // Resolvers
    private deferredAction: Deferred<SensorValuesMap> = new Deferred<SensorValuesMap>()
    private currentSensorValues: SensorValuesMap

    // Assets
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
        this.currentSensorValues = {};
    }

    public async prepare() {
        let assetManager = this.assetManager

        // Prepare and schedule Cards:
        const cardViewMap: CardViewMap = {}
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

            cardViewMap[cardId] = cardView;

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
                cardViewMap,
            )
            sensorBinding.subscribe(
                (sensorValue: SensorValue): void => (this.sensorEventHandler(sensorId, sensorValue))
            )
            this.scheduler.scheduleEvent(
                {
                    triggerTimeMsec: 0,
                    triggerFunc: () => {
                        sensorBinding.start();
                    },
                }
            )
            const valueInit: UnresolvedSensorValue = {
                sensor_value_type:'UnresolvedSensorValue',
            }
            this.currentSensorValues[sensorId] = valueInit;
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
        // Record sensor value update
        this.currentSensorValues[sensorId] = sensorValue;

        // Check if the exit predicate has been met
        const canExit = evaluateExitPredicate(
            this.node.exit,
            this.currentSensorValues,
        )

        if (canExit){
            this.deferredAction.resolve(this.currentSensorValues)
        }
    }

    async run(clock:Clock): Promise<NodePlayRunResult> {
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
        const tStart = clock.now()
        this.started = true;

        // Kick off scheduler:
        this.scheduler.start()

        // Wait for Action:
        const action = await this.deferredAction.promise;

        // Clean up NodePlay:
        this.scheduler.stop();

        return {
            outcome: action,
            t: tStart,
        }
    }
}


function evaluateExitPredicate(
    predicate: NodePredicate,
    sensorValuesMap: SensorValuesMap,
): boolean{
    switch (predicate.predicate_type){
        case "SensorResolvedPredicate": {
            // Return true if
            const sensorValue = sensorValuesMap[predicate.sensor_id];
            return sensorValue !== null;
        }
        case "AllPredicate": {
            if (predicate.items === "*") {
                // Wildcard: all sensors must be fulfilled (non-null)
                return Object.values(sensorValuesMap).every(
                    (value) => value.sensor_value_type !== 'UnresolvedSensorValue',
                );
            } else {
                // Conjunction over child predicates
                return predicate.items.every((child) =>
                    evaluateExitPredicate(child, sensorValuesMap),
                );
            }
        }
        case "RacePredicate": {
            if (predicate.items === "*") {
                // Wildcard: at least one sensor is fulfilled
                return Object.values(sensorValuesMap).some(
                    (value) => value.sensor_value_type !== 'UnresolvedSensorValue',
                );
            } else {
                // Disjunction over child predicates
                return predicate.items.some((child) =>
                    evaluateExitPredicate(child, sensorValuesMap),
                );
            }
        }
        case "AtLeastPredicate": {
            const { min, items } = predicate;

            // Trivial thresholds: 0 or less is always satisfied
            if (min <= 0) return true;

            let count = 0;
            for (const child of items) {
                if (evaluateExitPredicate(child, sensorValuesMap)) {
                    count++;
                    if (count >= min) {
                        return true;
                    }
                }
            }
            return false;
        }
        default: {
            const _exhaustive: never = predicate;
            throw new Error(`Unsupported predicate: ${JSON.stringify(_exhaustive)}`)
        }

    }
}