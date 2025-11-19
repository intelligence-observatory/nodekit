import type {PressableKey, SensorId, SpatialPoint, TimeElapsedMsec} from "../common.ts";
import type {SliderBinIndex} from "../../board-view/sensor-bindings/slider";

export interface BaseAction<T extends string> {
    action_type: T
    t: TimeElapsedMsec, // When the Action was detected by the Sensor
}

export interface ClickAction extends BaseAction<"ClickAction"> {
    x: SpatialPoint;
    y: SpatialPoint;
}

export interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}

export interface TimeoutAction extends BaseAction<"TimeoutAction"> {}

export interface SliderAction extends BaseAction<"SliderAction"> {
    bin_index: SliderBinIndex
}
export interface FreeTextEntryAction extends BaseAction<"FreeTextEntryAction"> {
    text: string
}
export interface WaitAction extends BaseAction<"WaitAction">{}

// Union
export type SensorValue = ClickAction | TimeoutAction | KeyAction | SliderAction | FreeTextEntryAction | WaitAction ;
export type Maybe<T> = T | null;
export type SensorValuesMap = Record<SensorId, Maybe<SensorValue>>
