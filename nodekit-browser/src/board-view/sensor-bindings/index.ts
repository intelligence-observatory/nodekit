import type {ClickAction, KeyAction, SensorValue} from "../../types/actions";
import type {PointerSample} from "../../input-streams/pointer-stream.ts";
import type {KeySample} from "../../input-streams/key-stream.ts";
import type {ClickSensor, KeySensor, Sensor} from "../../types/sensors";
import {type BoardView, checkPointInRegion} from "../board-view.ts";


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

/**
 *
 */
export class KeySensorBinding extends SensorBinding {
    prepare(
        sensor: KeySensor,
        boardView: BoardView
    ){
        const keys = sensor.keys;

        const keyCallback = (keySample: KeySample) => {
            if (keySample.sampleType !== 'down') {
                return;
            }
            if (!keys.has(keySample.key)) {
                return;
            }
            const action: KeyAction = {
                action_type: "KeyAction",
                key: keySample.key,
            };

            this.emit(action)
        }
        boardView.keyStream.subscribe(
            keyCallback
        )
    }
}

/**
 *
 */
export class ClickSensorBinding extends SensorBinding  {

    prepare(
        sensor: ClickSensor,
        boardView: BoardView
    ){

        const region =  sensor.region;

        const clickCallback = (pointerSample: PointerSample) => {
            if (pointerSample.sampleType !== 'down') {
                return;
            }

            const inside = checkPointInRegion(
                pointerSample.x,
                pointerSample.y,
                region,
            );
            if (inside){
                const action: ClickAction = {
                    action_type: "ClickAction",
                    x: pointerSample.x,
                    y: pointerSample.y,
                };

                this.emit(action)
                return
            }
        }
        boardView.pointerStream.subscribe(clickCallback);
    }

}

