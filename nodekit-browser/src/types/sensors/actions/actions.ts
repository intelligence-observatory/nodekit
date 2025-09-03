import type {BaseAction} from "./base.ts";
import type {NullValue} from "../../base.ts";
import type {KeyHoldSubAction, PressableKey} from "../../fields.ts";


export interface ClickActionValue {
    click_x: number;
    click_y: number;
}

export interface KeyPressActionValue {
    key: PressableKey;
}

export interface KeyHoldsActionValue {
    key_holds: KeyHoldSubAction[]
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