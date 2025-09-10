import type {ISO8601, PressableKey, SensorId} from "../common.ts";


export interface BaseAction<T extends string> {
    sensor_id: SensorId
    action_type: T
    timestamp_action: ISO8601
}

export interface ClickAction extends BaseAction<"ClickAction"> {
    click_x: number;
    click_y: number;
}

export interface KeyPressAction extends BaseAction<"KeyPressAction"> {
    key: PressableKey;
}

export interface DoneAction extends BaseAction<"DoneAction"> {}

export interface TimeoutAction extends BaseAction<"TimeoutAction"> {}

export type Action = ClickAction | DoneAction | TimeoutAction | KeyPressAction;