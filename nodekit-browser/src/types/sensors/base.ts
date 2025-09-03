import type {Timespan, SensorId, CardId} from "../fields.ts";

export interface BaseSensor<T extends string, P> {
    sensor_id: SensorId
    sensor_type: T
    sensor_parameters: P
    sensor_timespan: Timespan;
    card_id: CardId | null; // If null, this is a Board-bound Sensor.
}