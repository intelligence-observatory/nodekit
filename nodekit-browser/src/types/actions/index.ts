import type {CardId, PressableKey, SensorId, SpatialPoint} from "../common.ts";
import type {SliderBinIndex, SliderNormalizedPosition} from "../../board-view/sensor-bindings/slider/slider.ts";

export interface BaseAction<T extends string> {
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
export interface SliderState {
    slider_normalized_position: SliderNormalizedPosition // between 0 and 1
    slider_bin_index: SliderBinIndex
}

export interface FreeTextEntryState {
    text: string
}

export interface SubmitAction extends BaseAction<"SubmitAction"> {
    submitted_values: Record<CardId, FreeTextEntryState | SliderState>
}

export interface WaitAction extends BaseAction<"WaitAction">{

}

// Union
export type SensorValue = ClickAction | TimeoutAction | KeyAction | SubmitAction | SliderState | FreeTextEntryState | WaitAction;


export type Action = Record<SensorId, SensorValue>