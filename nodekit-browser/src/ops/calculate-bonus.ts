import type {Event, NodeIndex, SensorIndex} from "../types/events";
import type {Timeline} from "../types/node.ts";

export function calculateBonusUsd(
    events: Event[],
    timeline: Timeline,
): number {
    /*
    Function which computers the bonus USD amount based on the events and the node graph.
     */

    let bonusComputed = 0;

    // Sort events by timestamp to ensure correct order of processing
    // Note that event_timestamp is an ISO8601 string:
    events.sort((a, b) => a.timestamp_event.localeCompare(b.timestamp_event));

    let observedNodes = new Set<NodeIndex>();
    for (let i = 0; i < events.length; i++) {

        const eventCur = events[i];
        // Type narrow to NodeResultEvent:
        if (eventCur.event_type !== 'NodeResultEvent') {
            continue;
        }
        const nodeIndex: NodeIndex = eventCur.node_index;
        const sensorIndex: SensorIndex = eventCur.sensor_index;
        // Skip if we've already processed this node
        if (observedNodes.has(nodeIndex)) {
            continue;
        }
        observedNodes.add(nodeIndex);

        // Get Outcome for this Sensor fire, if it exists:
        const node = timeline.nodes[nodeIndex];
        const sensor = node.sensors[sensorIndex];
        const outcome = sensor.outcome;
        if (!outcome){
            continue
        }
        let bonusAmountUsd = parseFloat(outcome.bonus_amount_usd);
        if (!isNaN(bonusAmountUsd) && bonusAmountUsd > 0){
            bonusComputed += bonusAmountUsd;
        }
    }

    bonusComputed = Math.max(0, bonusComputed);
    bonusComputed = Math.round(bonusComputed * 100) / 100; // Round to 2 decimals

    // Convert to string:
    return bonusComputed;
}