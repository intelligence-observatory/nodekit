import type {PressableKey, TimePointMsec} from "../common.ts";
import type {Region} from "../regions";
import type {Outcome} from "../outcomes";


export interface BaseSensor<T extends string> {
    sensor_type: T
    t_start: TimePointMsec
    outcome: Outcome | null
}

export interface TimeoutSensor extends BaseSensor<'TimeoutSensor'>{}


export interface ClickSensor extends BaseSensor<'ClickSensor'>{
    region: Region
}

export interface KeySensor extends BaseSensor<'KeySensor'> {
    key: PressableKey
}

export type Sensor = TimeoutSensor | ClickSensor | KeySensor;
