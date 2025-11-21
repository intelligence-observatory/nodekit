import type {Sensor} from "../../types/sensors";
import type {BoardView} from "../board-view.ts";
import {SensorBinding} from "./index.ts";
import {SliderSensorBinding} from "./slider";
import {FreeTextEntrySensorBinding} from "./free-text-entry/free-text-entry.ts";
import {KeySensorBinding} from "./key";
import {ClickSensorBinding} from "./click";
import {WaitSensorBinding} from "./wait";
import {SelectSensorBinding} from "./select";
import type {CardViewMap} from "../../node-play";
import {MultiSelectSensorBinding} from "./multiselect";
import type {SensorId} from "../../types/common.ts";
import {ProductSensorBinding, SumSensorBinding} from "./combinators.ts";

export function createSensorBinding(
    sensor: Sensor,
    boardView: BoardView,
    cardViewMap: CardViewMap,
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
        case "SelectSensor": {
            sensorBinding = new SelectSensorBinding(sensor);
            break
        }
        case "MultiSelectSensor": {
            sensorBinding = new MultiSelectSensorBinding(sensor);
            break
        }
        case "SumSensor":
        case "ProductSensor":{
            let childBindings: Record<SensorId, SensorBinding<Sensor>> = {}

            for (const [sensorId, childSensor] of Object.entries(sensor.children)){
                childBindings[sensorId as SensorId] = createSensorBinding(childSensor, boardView, cardViewMap)
            }
            switch (sensor.sensor_type){
                case "ProductSensor":
                    sensorBinding = new ProductSensorBinding(sensor, childBindings);
                    break
                case "SumSensor":
                    sensorBinding = new SumSensorBinding(sensor, childBindings);
                    break
                default:
                    throw new Error()
            }
            break
        }
        default: {
            const _exhaustive: never = sensor;
            throw new Error(`Unknown Sensor provided: ${JSON.stringify(_exhaustive)}`);
        }
    }

    sensorBinding.prepare(
        boardView,
        cardViewMap,
    );
    return sensorBinding
}