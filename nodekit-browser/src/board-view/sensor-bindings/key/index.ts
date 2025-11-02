import type {KeySensor} from "../../../types/sensors";
import type {BoardView} from "../../board-view.ts";
import type {KeySample} from "../../../input-streams/key-stream.ts";
import type {KeyAction} from "../../../types/actions";
import {SensorBinding} from "../index.ts";

/**
 *
 */
export class KeySensorBinding extends SensorBinding {
    prepare(
        sensor: KeySensor,
        boardView: BoardView
    ) {
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