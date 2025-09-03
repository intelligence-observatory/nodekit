import type {BaseAction} from "./base.ts";
import type {NullValue} from "../../base.ts";
import type {PressableKey} from "../../fields.ts";


export interface ClickActionValue {
    click_x: number;
    click_y: number;
}

export interface KeyPressActionValue {
    key: PressableKey;
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

export type Action = ClickAction | DoneAction | TimeoutAction | KeyPressAction;