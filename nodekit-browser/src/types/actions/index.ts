import type {ISO8601, PressableKey, SensorId, SpatialPoint} from "../common.ts";


export interface BaseAction<T extends string> {
    sensor_id: SensorId
    action_type: T
    timestamp_action: ISO8601
}

export interface ClickAction extends BaseAction<"ClickAction"> {
    click_x: SpatialPoint;
    click_y: SpatialPoint;
}

export interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}


export interface DoneAction extends BaseAction<"DoneAction"> {}

export interface TimeoutAction extends BaseAction<"TimeoutAction"> {}

export interface KeyHoldsAction extends BaseAction<"KeyHoldsAction"> {}

export type Action = ClickAction | DoneAction | TimeoutAction | KeyAction | KeyHoldsAction;