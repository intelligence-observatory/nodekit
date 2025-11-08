import type {PressableKey, SensorId, SpatialPoint, TimeElapsedMsec} from "../common.ts";
import type {SliderBinIndex} from "../../board-view/sensor-bindings/slider";

export interface BaseAction<T extends string> {
    t: TimeElapsedMsec, // When the Action was detected by the Sensor
    action_type: T
}

export interface ClickAction extends BaseAction<"ClickAction"> {
    x: SpatialPoint;
    y: SpatialPoint;
}

export interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}

export interface TimeoutAction extends BaseAction<"TimeoutAction"> {}

// SubmitAction
export interface SliderAction extends BaseAction<"SliderAction"> {
    bin_index: SliderBinIndex
}
export interface FreeTextEntryAction extends BaseAction<"FreeTextEntryAction"> {
    text: string
}
export interface WaitAction extends BaseAction<"WaitAction">{}
export interface ConfirmAction extends BaseAction<"ConfirmAction">{}
// Union
export type SensorValue = ClickAction | TimeoutAction | KeyAction | SliderAction | FreeTextEntryAction | WaitAction | ConfirmAction;
export type Action = Record<SensorId, SensorValue>