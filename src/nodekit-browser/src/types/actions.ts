import type {Dict, PressableKey} from "./values.ts";
import type {SliderBinIndex} from "../board-view/sensor-bindings/slider";

export interface BaseAction<T extends string> extends Dict {
    action_type: T
    action_value: any
}

export interface KeyAction extends BaseAction<"KeyAction"> {
    action_value: PressableKey;
}

export interface SliderAction extends BaseAction<"SliderAction"> {
    action_value: SliderBinIndex
}
export interface TextEntryAction extends BaseAction<"TextEntryAction"> {
    action_value: string
}

export interface WaitAction extends BaseAction<"WaitAction">{
    action_value: null;
}

export interface SelectAction extends BaseAction<"SelectAction">{
    action_value: string
}

export interface MultiSelectAction extends BaseAction<"MultiSelectAction">{
    action_value: string[]
}

export interface ProductAction extends BaseAction<'ProductAction'> {
    action_value: Record<string, Action>
}

export interface SumAction extends BaseAction<'SumAction'>{
    action_value: [string, Action]
}

// Union
export type Action =
    | KeyAction
    | SliderAction
    | TextEntryAction
    | WaitAction
    | SelectAction
    | MultiSelectAction
    | ProductAction
    | SumAction

