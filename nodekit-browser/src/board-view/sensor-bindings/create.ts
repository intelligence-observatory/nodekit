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
): SensorBinding<Sensor> {

    // Factory function for creating a SensorBinding
    let sensorBinding: SensorBinding<Sensor> | null = null;
    switch (sensor.sensor_type) {
        case "KeySensor": {
            sensorBinding = new KeySensorBinding(sensor);
            break
        }
        case "ClickSensor": {
            sensorBinding = new ClickSensorBinding(sensor);
            break
        }
        case "SliderSensor": {
            sensorBinding = new SliderSensorBinding(sensor);
            break;
        }
        case "FreeTextEntrySensor": {
            sensorBinding = new FreeTextEntrySensorBinding(sensor);
            break
        }
        case "WaitSensor": {
            sensorBinding = new WaitSensorBinding(sensor);
            break
        }
        default: {
            const _exhaustive: never = sensor;
            throw new Error(`Unknown Sensor provided: ${JSON.stringify(_exhaustive)}`);
        }
    }

    sensorBinding.prepare(
        boardView,
    );
    return sensorBinding
}