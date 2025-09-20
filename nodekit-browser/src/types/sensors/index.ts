import type {PressableKey, SpatialPoint, SpatialSize, TimePointMsec, Mask} from "../common.ts";
import type {Outcome} from "../outcomes";


export interface BaseSensor<T extends string> {
    sensor_type: T
    t_start: TimePointMsec
    outcome: Outcome | null
}

export interface TimeoutSensor extends BaseSensor<'TimeoutSensor'>{}


export interface ClickSensor extends BaseSensor<'ClickSensor'>{
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialSize
    h: SpatialSize
    mask: Mask
}

export interface KeySensor extends BaseSensor<'KeySensor'> {
    key: PressableKey
}

export type Sensor = TimeoutSensor | ClickSensor | KeySensor;
