import type {Event} from "../types/events";
import type {Action} from "../types/actions";
import type {NodeGraph} from "../types/node-graph.ts";
import type {NodeId} from "../types/node-graph.ts";
import type {Consequence} from "../types/consequences";

export function calculateBonusUsd(
    events: Event[],
    nodeGraph: NodeGraph,
): number {
    /*
    Function which computers the bonus USD amount based on the events and the node graph.
     */

    let bonusComputed = 0;

    let nodeIdToConsequences: Record<NodeId, Consequence[]> = {}
    for (const node of nodeGraph.nodes) {
        nodeIdToConsequences[node.node_id] = node.consequences;
    }

    // Sort events by timestamp to ensure correct order of processing
    // Note that event_timestamp is an ISO8601 string:
    events.sort((a, b) => a.timestamp_event.localeCompare(b.timestamp_event));

    let observedNodeIds = new Set<NodeId>();
    for (let i = 0; i < events.length; i++) {

        const eventCur = events[i];
        // Type narrow to NodeResultEvent:
        if (eventCur.event_type !== 'NodeResultEvent') {
            continue;
        }
        const nodeResult = eventCur.event_payload;
        const action: Action = nodeResult.action;
        const sensorId = action.sensor_id;
        // Skip if we've already processed this node
        if (observedNodeIds.has(nodeResult.node_id)) {
            continue;
        }
        observedNodeIds.add(nodeResult.node_id);

        // Perform scan through consequences;
        for (const consequence of nodeIdToConsequences[nodeResult.node_id] || []) {
            if (consequence.sensor_id === sensorId){
                let bonusAmountUsd = parseFloat(consequence.bonus_amount_usd);
                if (!isNaN(bonusAmountUsd) && bonusAmountUsd > 0){
                    bonusComputed += bonusAmountUsd;
                }
            }
        }
    }

    bonusComputed = Math.max(0, bonusComputed);
    bonusComputed = Math.round(bonusComputed * 100) / 100; // Round to 2 decimals

    // Convert to string:
    return bonusComputed;
}