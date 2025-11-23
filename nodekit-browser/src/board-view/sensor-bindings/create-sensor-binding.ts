import type {Sensor} from "../../types/sensors";
import type {BoardView} from "../board-view.ts";
import {SensorBinding} from "./index.ts";
import {SliderSensorBinding} from "./slider";
import {FreeTextEntrySensorBinding} from "./free-text-entry/free-text-entry.ts";
import {KeySensorBinding} from "./key";
import {ClickSensorBinding} from "./click";
import {WaitSensorBinding} from "./wait";
import {SelectSensorBinding} from "./select";
import {MultiSelectSensorBinding} from "./multiselect";
import type {AssetManager} from "../../asset-manager";

export async function createSensorBinding(
    sensor: Sensor,
    boardView: BoardView,
    assetManager: AssetManager,
): Promise<SensorBinding<Sensor>> {

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
        case "SelectSensor": {
            sensorBinding = new SelectSensorBinding(sensor);
            break
        }
        case "MultiSelectSensor": {
            sensorBinding = new MultiSelectSensorBinding(sensor);
            break
        }
        default: {
            const _exhaustive: never = sensor;
            throw new Error(`Unknown Sensor provided: ${JSON.stringify(_exhaustive)}`);
        }
    }

    await sensorBinding.prepare(
        boardView,
        assetManager,
    );
    return sensorBinding
}