import type {BaseAction} from "./base.ts";
import type {NullValue} from "../../base.ts";
import type {PressableKey, TimePointMsec} from "../../fields.ts";


export interface ClickActionValue {
    click_x: number;
    click_y: number;
}

export interface KeyHold {
    key: PressableKey,
    // The time delta from the node's start time at which the key was pressed.
    // This is null if the key was pressed before the sensor armed.
    start_time_msec:  TimePointMsec | null;
    // The time delta from the node's end time at which the key was released.
    // This is null if the key wasn't released.
    end_time_msec:  TimePointMsec | null;
}

export interface KeyPressActionValue {
    key: PressableKey;
}

export interface KeyHoldsActionValue {
    key_holds: KeyHold[]
}

export interface ClickAction extends BaseAction<ClickActionValue>{
    action_type: "ClickAction";
}

export interface DoneAction extends BaseAction<NullValue>{
    action_type: "DoneAction";
}

export interface TimeoutAction extends BaseAction<NullValue>{
    action_type: "TimeoutAction";
}

export interface KeyPressAction extends BaseAction<KeyPressActionValue>{
    action_type: "KeyPressAction";
}

export interface KeyHoldsAction extends BaseAction<KeyHoldsActionValue>{
    action_type: "KeyHoldsAction";
}

export type Action = ClickAction | DoneAction | TimeoutAction | KeyPressAction | KeyHoldsAction;