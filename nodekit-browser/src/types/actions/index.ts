import type {CardId, PressableKey, SensorId, SpatialPoint, TimeElapsedMsec} from "../common.ts";
import type {SliderBinIndex} from "../../board-view/sensor-bindings/slider";

export interface BaseAction<T extends string> {
    sensor_value_type: T
    t: TimeElapsedMsec, // When the Sensor was set to this SensorValue
}

export interface UnresolvedSensorValue{
    // Value of an unresolved Sensor
    sensor_value_type: 'UnresolvedSensorValue'
}

export interface ClickAction extends BaseAction<"ClickSensorValue"> {
    x: SpatialPoint;
    y: SpatialPoint;
}

export interface KeyAction extends BaseAction<"KeySensorValue"> {
    key: PressableKey;
}

export interface SliderAction extends BaseAction<"SliderSensorValue"> {
    bin_index: SliderBinIndex
}
export interface FreeTextEntryAction extends BaseAction<"FreeTextEntrySensorValue"> {
    text: string
}

export interface WaitAction extends BaseAction<"WaitSensorValue">{}

export interface SelectAction extends BaseAction<"SelectSensorValue">{
    selection: CardId
}

export interface MultiSelectAction extends BaseAction<"MultiSelectSensorValue">{
    selections: CardId[]
}

// Union
export type SensorValue =
    | ClickAction
    | KeyAction
    | SliderAction
    | FreeTextEntryAction
    | WaitAction
    | SelectAction
    | MultiSelectAction

export type Maybe<T> = T | UnresolvedSensorValue;
export type SensorValuesMap = Record<SensorId, Maybe<SensorValue>>
