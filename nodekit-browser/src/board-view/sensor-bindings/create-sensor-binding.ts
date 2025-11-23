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
import {ProductSensorBinding, SumSensorBinding} from "./combinators.ts";


export async function createSensorBinding(
    sensor: Sensor,
    boardView: BoardView,
    assetManager: AssetManager,
): Promise<SensorBinding<Sensor>> {

    let sensorBinding: SensorBinding<Sensor> | null = null;

    switch (sensor.sensor_type) {
        case "WaitSensor": {
            sensorBinding = new WaitSensorBinding(
                sensor,
                boardView,
                assetManager,
            );
            break
        }
        case "KeySensor": {
            sensorBinding = new KeySensorBinding(
                sensor,
                boardView,
                assetManager,
            );
            break
        }
        case "ClickSensor": {
            sensorBinding = new ClickSensorBinding(
                sensor,
                boardView,
                assetManager,
            );
            break
        }
        case "SliderSensor": {
            sensorBinding = new SliderSensorBinding(
                sensor,
                boardView,
                assetManager,
            );
            break;
        }
        case "FreeTextEntrySensor": {
            sensorBinding = new FreeTextEntrySensorBinding(
                sensor,
                boardView,
                assetManager,
            );
            break
        }

        case "SelectSensor": {
            sensorBinding = new SelectSensorBinding(
                sensor,
                boardView,
                assetManager,
            );
            break
        }
        case "MultiSelectSensor": {
            sensorBinding = new MultiSelectSensorBinding(
                sensor,
                boardView,
                assetManager,
            );
            break
        }
        case "ProductSensor": {
            sensorBinding = new ProductSensorBinding(
                sensor,
                boardView,
                assetManager,
            );
            break
        }
        case "SumSensor": {
            sensorBinding = new SumSensorBinding(
                sensor,
                boardView,
                assetManager,
            );
            break
        }
        default: {
            const _exhaustive: never = sensor;
            throw new Error(`Unknown Sensor provided: ${JSON.stringify(_exhaustive)}`);
        }
    }

    await sensorBinding.prepare();
    return sensorBinding
}