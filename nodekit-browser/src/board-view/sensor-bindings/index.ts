import type {SensorValue} from "../../types/actions";
import type {Sensor} from "../../types/sensors";
import {type BoardView} from "../board-view.ts";


export abstract class SensorBinding {
    private subscriptions: ((sensorValue: SensorValue) => void)[] = []

    abstract prepare(
        sensor: Sensor,
        boardView: BoardView,
    ): void;

    /**
     * Should be called by the SensorBinding whenever a new valid SensorValue has been set by the agent.
     * @param sensorValue
     */
    protected emit(sensorValue: SensorValue): void{
        this.subscriptions.forEach(cb => cb(sensorValue));
    }

    public subscribe(
        callback: (sensorValue: SensorValue) => void
    ): void {
        this.subscriptions.push(callback);
    }
}

