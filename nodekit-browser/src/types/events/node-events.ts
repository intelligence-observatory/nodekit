import type {NodeId, TimeElapsedMsec} from "../common.ts";
import type {SensorValuesMap} from "../actions";

export interface NodeOutcome {
    t: TimeElapsedMsec // Start time of the Node, relative to Trace start
    node_id: NodeId
    action: SensorValuesMap // Final, rolled up sensor values
}