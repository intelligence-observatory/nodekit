import type {PressableKey, SpatialPoint} from "../common.ts";
import type {SliderBinIndex, SliderNormalizedPosition} from "../../board-view/card-views/slider/slider-card-view.ts";

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

export interface SliderAction extends BaseAction<"SliderAction"> {
    value: SliderNormalizedPosition // between 0 and 1
    bin_index: SliderBinIndex
}

export interface FreeTextEntryAction extends BaseAction<"FreeTextEntryAction"> {
    text: string
}

export type Action = ClickAction | TimeoutAction | KeyAction | SliderAction;