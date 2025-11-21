import type {NodeId, TimeElapsedMsec} from "../common.ts";
import type {Action} from "../actions";

export interface NodeOutcome {
    t: TimeElapsedMsec // Start time of the Node, relative to Trace start
    node_id: NodeId
    action: Action // Final, rolled up sensor values
}