import type {SensorValue, WaitAction} from "../../types/actions";
import type {Sensor} from "../../types/sensors";
import {type BoardView} from "../board-view.ts";


export abstract class SensorBinding<S extends Sensor> {
    private subscriptions: ((sensorValue: SensorValue) => void)[] = []
    protected sensor: S

    constructor(
        sensor: S
    ){
        this.sensor = sensor;
    }

    abstract prepare(boardView: BoardView): void;

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
    start(){
        if (this.sensor.timeout_msec != null){
            window.setTimeout(() => {
                const waited: WaitAction = {
                    action_type: 'WaitAction'
                }
                this.emit(waited);
            }, this.sensor.timeout_msec);
        }
    }

    public subscribe(
        callback: (sensorValue: SensorValue) => void
    ): void {
        this.subscriptions.push(callback);
    }
}

