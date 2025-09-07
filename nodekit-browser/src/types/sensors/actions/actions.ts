import type {BaseAction} from "./base.ts";
import type {NullValue} from "../../base.ts";
import type {PressableKey} from "../../fields.ts";
import type {ISO8601} from "../../fields.ts";

export interface ClickActionValue {
    click_x: number;
    click_y: number;
}

export interface KeyHold {
    key: PressableKey,
    // The timestamp when the key was first pressed down: it is null if the key was being held down before the Sensor was armed.
    timestamp_start:  ISO8601 | null;
    // The timestamp when the key was released. It is null if the key was still being held down after the Sensor was disarmed:
    timestamp_end:  ISO8601 | null;
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