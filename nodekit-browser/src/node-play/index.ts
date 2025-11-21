import type {Node} from "../types/node.ts";
import type {Action} from "../types/actions/";
import {BoardView} from "../board-view/board-view.ts";
import {EventScheduler} from "./event-scheduler.ts";

import type {AssetManager} from "../asset-manager";

import type {CardId, TimeElapsedMsec} from "../types/common.ts";


import {createCardView} from "../board-view/card-views/create.ts";
import {createSensorBinding} from "../board-view/sensor-bindings/create-sensor-binding.ts";
import type {Clock} from "../clock.ts";
import type {CardView} from "../board-view/card-views/card-view.ts";

export interface NodePlayRunResult {
    t: TimeElapsedMsec,
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
    private deferredAction: Deferred<Action> = new Deferred<Action>()

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

        // Create SensorBinding:
        const sensorBinding = createSensorBinding(
            this.node.sensor,
            this.boardView,
            cardViewMap,
        )

        // Subscribe to SensorBinding:
        console.log('da', this.deferredAction)
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

        // Check if Pointer is shown in this Node:
        if (this.node.hide_pointer){
            this.boardView.root.style.cursor = 'none';
        }

        this.prepared = true;
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
        console.log('action', action)

        // Clean up NodePlay:
        this.scheduler.stop();

        return {
            action: action,
            t: tStart,
        }
    }
}

