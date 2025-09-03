import type {NullParameters} from "../base.ts";
import type {BaseSensor} from "./base.ts";
import type {CardId, TimeDurationMsec} from "../fields.ts";
import type {PressableKey} from "../fields.ts";


interface TimeoutSensorParameters {
    timeout_msec: TimeDurationMsec; // Timeout in milliseconds
}

interface KeyPressSensorParameters {
    // Listen to these key-down event.
    keys: Set<PressableKey>;
}

export interface TimeoutSensor extends BaseSensor<'TimeoutSensor', TimeoutSensorParameters>{
    card_id: null; // Timeout sensors are always board-bound, so card_id should be null.
}

export interface DoneSensor extends BaseSensor<'DoneSensor', NullParameters>{
    card_id: CardId
}

export interface ClickSensor extends BaseSensor<'ClickSensor', NullParameters>{
    card_id: CardId
}

export interface KeyPressSensor extends BaseSensor<'KeyPressSensor', KeyPressSensorParameters> {
    card_id: null;
}

export type Sensor = TimeoutSensor | DoneSensor | ClickSensor | KeyPressSensor;
