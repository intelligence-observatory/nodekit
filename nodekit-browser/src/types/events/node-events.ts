import type {NodeId, SensorId, TimeElapsedMsec} from "../common.ts";
import type {SensorValue} from "../actions";

export interface NodeResult {
    // Context:
    t: TimeElapsedMsec // Start time of the Node, relative to Trace start
    node_id: NodeId
    outcome: Record<SensorId, SensorValue> // Final sensor values
}