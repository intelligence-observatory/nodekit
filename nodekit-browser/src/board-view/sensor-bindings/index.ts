import type {Action} from "../../types/actions";
import type {Sensor} from "../../types/sensors";
import {type BoardView} from "../board-view.ts";
import type {CardViewMap} from "../../node-play";


export abstract class SensorBinding<S extends Sensor> {
    private subscriptions: ((sensorValue: Action) => void)[] = []
    protected sensor: S

    constructor(
        sensor: S
    ){
        this.sensor = sensor;
    }

    abstract prepare(boardView: BoardView, cardViewMap: CardViewMap): void;

    /**
     * Should be called by the SensorBinding whenever a new valid SensorValue has been set by the agent.
     * @param action
     */
    protected emit(action: Action): void{
        this.subscriptions.forEach(cb => cb(action));
    }

    /**
     * Called when the NodePlay begins.
     */
    start(){}

    public subscribe(
        callback: (action: Action) => void
    ): void {
        this.subscriptions.push(callback);
    }
}

