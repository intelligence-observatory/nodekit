import type {PressableKey, SpatialPoint, SpatialSize, NodeTimePointMsec, Mask} from "../common.ts";


interface BaseSensor<T extends string> {
    sensor_type: T
}

export interface WaitSensor extends BaseSensor<'WaitSensor'>{
    wait_msec: NodeTimePointMsec
}


interface TemporallyBoundedSensor<T extends string> extends BaseSensor<T> {
    start_msec: NodeTimePointMsec
    end_msec: NodeTimePointMsec | null // If null, the window lasts until the Node ends
}

export interface ClickSensor extends TemporallyBoundedSensor<'ClickSensor'>{
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialSize
    h: SpatialSize
    mask: Mask
}

export interface KeySensor extends TemporallyBoundedSensor<'KeySensor'> {
    key: PressableKey
}

export type Sensor = WaitSensor | ClickSensor | KeySensor;
