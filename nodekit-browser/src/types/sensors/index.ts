import type {PressableKey, SpatialPoint, SpatialSize, NodeTimePointMsec, Mask} from "../common.ts";


interface BaseSensor<T extends string> {
    sensor_type: T
}

export interface TimeoutSensor extends BaseSensor<'TimeoutSensor'>{
    timeout_msec: NodeTimePointMsec
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

export interface SliderSensor extends BaseSensor<'SliderSensor'> {
    card_id: string; // The CardId of a SliderCard in the same Node
}
export type Sensor = TimeoutSensor | ClickSensor | KeySensor | SliderSensor;
