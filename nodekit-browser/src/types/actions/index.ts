import type {PressableKey, SpatialPoint} from "../common.ts";

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

export interface WaitAction extends BaseAction<"WaitAction"> {}

export type Action = ClickAction | WaitAction | KeyAction;