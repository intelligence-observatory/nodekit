import type {SensorValue} from "../../types/actions";
import type {Sensor} from "../../types/sensors";
import {type BoardView} from "../board-view.ts";
import type {CardViewMap} from "../../node-play";


export abstract class SensorBinding<S extends Sensor> {
    private subscriptions: ((sensorValue: SensorValue) => void)[] = []
    protected sensor: S

    constructor(
        sensor: S
    ){
        this.sensor = sensor;
    }

    abstract prepare(boardView: BoardView, cardViewMap: CardViewMap): void;

    /**
     * Should be called by the SensorBinding whenever a new valid SensorValue has been set by the agent.
     * @param sensorValue
     */
    protected emit(sensorValue: SensorValue): void{
        this.subscriptions.forEach(cb => cb(sensorValue));
    }

    /**
     * Called when the NodePlay begins.
     */
    start(){}

    public subscribe(
        callback: (sensorValue: SensorValue) => void
    ): void {
        this.subscriptions.push(callback);
    }
}

