import type {CardId, PressableKey, SensorId, TimePointMsec} from "../common.ts";


export interface BaseSensor<T extends string> {
    sensor_id: SensorId
    sensor_type: T
    t_start: TimePointMsec
}

export interface TimeoutSensor extends BaseSensor<'TimeoutSensor'>{}

export interface DoneSensor extends BaseSensor<'DoneSensor'>{
    card_id: CardId
}

export interface ClickSensor extends BaseSensor<'ClickSensor'>{
    card_id: CardId
}

export interface KeySensor extends BaseSensor<'KeySensor'> {
    key: PressableKey
}

export interface KeyHoldsSensor extends BaseSensor<'KeyHoldsSensor'> {
    key: PressableKey;
}

export type Sensor = TimeoutSensor | DoneSensor | ClickSensor | KeySensor | KeyHoldsSensor;
