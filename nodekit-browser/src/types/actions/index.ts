import type {PressableKey, SensorId, SpatialPoint} from "../common.ts";
import type {SliderBinIndex, SliderNormalizedPosition} from "../../board-view/sensor-bindings/slider";

export interface BaseAction<T extends string> {
    action_type: T
    //t: NodeTimePointMsec, // When the Action was detected by the Sensor
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
    normalized_position: SliderNormalizedPosition // between 0 and 1
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