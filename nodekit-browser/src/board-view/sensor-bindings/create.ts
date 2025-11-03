import type {Sensor} from "../../types/sensors";
import type {BoardView} from "../board-view.ts";
import {SensorBinding} from "./index.ts";
import {SliderSensorBinding} from "./slider/slider.ts";
import {FreeTextEntrySensorBinding} from "./free-text-entry/free-text-entry.ts";
import {KeySensorBinding} from "./key";
import {ClickSensorBinding} from "./click";
import {WaitSensorBinding} from "./wait";

export function createSensorBinding(
    sensor: Sensor,
    boardView: BoardView,
): SensorBinding {

    // Factory function for creating a SensorBinding
    let sensorBinding: SensorBinding | null = null;
    switch (sensor.sensor_type) {
        case "KeySensor": {
            sensorBinding = new KeySensorBinding();
            break
        }
        case "ClickSensor": {
            sensorBinding = new ClickSensorBinding();
            break
        }
        case "SliderSensor": {
            sensorBinding = new SliderSensorBinding();
            break;
        }
        case "FreeTextEntrySensor": {
            sensorBinding = new FreeTextEntrySensorBinding();
            break
        }
        case "WaitSensor": {
            sensorBinding = new WaitSensorBinding();
            break
        }
        default: {
            const _exhaustive: never = sensor;
            throw new Error(`Unknown Sensor provided: ${JSON.stringify(_exhaustive)}`);
        }
    }

    sensorBinding.prepare(
        sensor,
        boardView,
    );
    return sensorBinding
}