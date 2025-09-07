import type {ISO8601, SensorId} from "../../fields.ts";

export interface BaseAction<T>{
    sensor_id: SensorId
    action_type: string
    action_value: T
    timestamp_action: ISO8601 // Fully-qualified timestamp when the Sensor was triggered
}