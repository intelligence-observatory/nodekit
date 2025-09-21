import type {PressableKey, SpatialPoint, SpatialSize, NodeTimePointMsec, Mask} from "../common.ts";
import type {Outcome} from "../outcomes";


export interface BaseSensor<T extends string> {
    sensor_type: T
    start_msec: NodeTimePointMsec
    end_msec: NodeTimePointMsec | null // If null, the window lasts until the Node ends

    outcome: Outcome | null
}

export interface TimeoutSensor extends BaseSensor<'TimeoutSensor'>{
    end_msec: null
}

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
