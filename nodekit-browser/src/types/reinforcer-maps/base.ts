import type {SensorId} from "../fields.ts";

export interface BaseReinforcerMap<T extends string, P> {
    reinforcer_map_type: T,
    reinforcer_map_parameters: P,
    sensor_id: SensorId
}
