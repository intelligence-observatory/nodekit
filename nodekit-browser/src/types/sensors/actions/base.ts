import type {SensorId, TimePointMsec} from "../../fields.ts";

export interface BaseAction<T>{
    sensor_id: SensorId
    action_type: string
    action_value: T
    reaction_time_msec: TimePointMsec // Msec elapsed relative to the start of the Sensor arming
}