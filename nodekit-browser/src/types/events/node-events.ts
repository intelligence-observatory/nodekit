
import type {BaseEvent} from "./index.ts";
import type {PressableKey, SensorId, SpatialPoint} from "../common.ts";
import type {SensorValue} from "../actions";


export interface PointerSampledEvent extends BaseEvent<'PointerSampledEvent'> {
    x: SpatialPoint,
    y: SpatialPoint,
    kind: 'down' | 'up' | 'move'
}

export interface KeySampledEvent extends BaseEvent<'KeySampledEvent'> {
    key: PressableKey
    kind: 'down' | 'up'
}

export interface SensorValueChangedEvent<V extends SensorValue> extends BaseEvent<'SensorValueChangedEvent'>{
    // Fired when the Sensor detects a valid new value
    sensor_id: SensorId
    sensor_value: V
}
