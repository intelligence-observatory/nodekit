import type {PressableKey, SpatialPoint, TimeElapsedMsec} from "../common.ts";
import type {SliderBinIndex} from "../../board-view/sensor-bindings/slider";

export interface BaseAction<T extends string> {
    action_type: T
    t: TimeElapsedMsec,
}

export interface ClickAction extends BaseAction<"ClickAction"> {
    x: SpatialPoint;
    y: SpatialPoint;
}

export interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}

export interface SliderAction extends BaseAction<"SliderAction"> {
    bin_index: SliderBinIndex
}
export interface FreeTextEntryAction extends BaseAction<"FreeTextEntryAction"> {
    text: string
}

export interface WaitAction extends BaseAction<"WaitAction">{}

export interface SelectAction extends BaseAction<"SelectAction">{
    selection: string
}

export interface MultiSelectAction extends BaseAction<"MultiSelectAction">{
    selections: string[]
}

export interface ProductAction extends BaseAction<'ProductAction'> {
    child_actions: Record<string, Action>
}

export interface SumAction extends BaseAction<'SumAction'>{
    child_id: string
    child_action: Action
}

// Union
export type Action =
    | ClickAction
    | KeyAction
    | SliderAction
    | FreeTextEntryAction
    | WaitAction
    | SelectAction
    | MultiSelectAction
    | ProductAction
    | SumAction

