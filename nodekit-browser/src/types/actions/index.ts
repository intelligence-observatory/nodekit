import type {PressableKey, SensorId, SpatialPoint, TimeElapsedMsec} from "../common.ts";
import type {SliderBinIndex} from "../../board-view/sensor-bindings/slider";

export interface BaseSensorValue<T extends string> {
    sensor_value_type: T
    t: TimeElapsedMsec, // When the Sensor was set to this SensorValue
}

export interface ClickSensorValue extends BaseSensorValue<"ClickAction"> {
    x: SpatialPoint;
    y: SpatialPoint;
}

export interface KeySensorValue extends BaseSensorValue<"KeyAction"> {
    key: PressableKey;
}

export interface SliderSensorValue extends BaseSensorValue<"SliderAction"> {
    bin_index: SliderBinIndex
}
export interface FreeTextEntrySensorValue extends BaseSensorValue<"FreeTextEntryAction"> {
    text: string
}

export interface WaitSensorValue extends BaseSensorValue<"WaitAction">{}

// Union
export type SensorValue =
    | ClickSensorValue
    | KeySensorValue
    | SliderSensorValue
    | FreeTextEntrySensorValue
    | WaitSensorValue;

export type Maybe<T> = T | null;
export type SensorValuesMap = Record<SensorId, Maybe<SensorValue>>
