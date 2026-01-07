import type {KeySensor} from "../../../types/sensors.ts";
import type {KeySample} from "../../../input-streams/key-stream.ts";
import type {KeyAction} from "../../../types/actions.ts";
import {SensorBinding} from "../index.ts";

/**
 *
 */
export class KeySensorBinding extends SensorBinding<KeySensor> {
    async prepare() {
        const keys = new Set(this.params.sensor.keys);
        const keyCallback = (keySample: KeySample) => {
            if (keySample.sampleType !== 'down') {
                return;
            }
            if (!keys.has(keySample.key)) {
                return;
            }
            const action: KeyAction = {
                action_type: "KeyAction",
                action_value: keySample.key,
            };

            this.emit(action)
        }
        this.params.boardView.keyStream.subscribe(
            keyCallback
        )
    }
}