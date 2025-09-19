import type {PressableKey, SpatialPoint} from "../common.ts";

export interface BaseAction<T extends string> {
    action_type: T
}

export interface ClickAction extends BaseAction<"ClickAction"> {
    click_x: SpatialPoint;
    click_y: SpatialPoint;
}

export interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}

export interface TimeoutAction extends BaseAction<"TimeoutAction"> {}

export type Action = ClickAction | TimeoutAction | KeyAction;