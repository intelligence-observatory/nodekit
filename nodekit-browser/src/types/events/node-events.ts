import type {NodeId, SensorId, TimeElapsedMsec} from "../common.ts";
import type {SensorValue} from "../actions";

export interface NodeOutcome {
    t: TimeElapsedMsec // Start time of the Node, relative to Trace start
    node_id: NodeId
    sensor_values: Record<SensorId, SensorValue> // Final, rolled up sensor values
}