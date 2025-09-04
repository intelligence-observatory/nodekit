import {NodePlayer} from "./node-player.ts";
import type {
    Event,
    StartEvent,
    LeaveEvent,
    ReturnEvent,
    EndEvent,
    NodeResultEvent,
    UUID
} from "./events.ts";
import type {NodeParameters} from "./types/models.ts";
import type {BonusRule} from "./types/bonus_rules/bonus_policy.ts";
import type {ISO8601, MonetaryAmountUsd} from "./types/fields.ts";
import {computeBonusUsd} from "./bonus-engine.ts";

export interface Node {
    node_id: UUID;
    node_parameters: NodeParameters;
}

export interface NodeGraph {
    nodes: Node[];
    bonus_rules: BonusRule[];
}

type OnEventCallback = (event: Event) => void;


function generateEventId(): UUID {
    return crypto.randomUUID() as UUID;
}

function getCurrentTimestamp(): ISO8601 {
    return new Date().toISOString() as ISO8601;
}

export async function play(
    nodeGraph: NodeGraph,
    onEventCallback: OnEventCallback | null = null,
    previousEvents: Event[] = [],
): Promise<Event[]> {
    /*
    Executes a run through the NodeGraph. Events are returned as an array.
    */

    let events: Event[] = previousEvents;

    // Todo: the previousEvents can be processed to obtain the current state of the task. Otherwise, we always start from scratch.

    // If no onEventCallback is provided, use a no-op function:
    if (!onEventCallback) {
        onEventCallback = (_event: Event) => {
        };
    }

    // Add a listener for the LeaveEvent:
    function onVisibilityChange() {
        if (document.visibilityState === "hidden") {
            const leaveEvent: LeaveEvent = {
                event_id: generateEventId(),
                event_timestamp: getCurrentTimestamp(),
                event_type: "LeaveEvent",
                event_payload: {},
            };
            events.push(leaveEvent);
            onEventCallback!(leaveEvent);
        } else if (document.visibilityState === "visible") {
            // Optionally handle when the document becomes visible again
            const returnEvent: ReturnEvent = {
                event_id: generateEventId(),
                event_timestamp: getCurrentTimestamp(),
                event_type: "ReturnEvent",
                event_payload: {},
            };
            events.push(returnEvent);
            onEventCallback!(returnEvent);
        }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    // Generate the StartEvent
    const startEvent: StartEvent = {
        event_id: generateEventId(),
        event_timestamp: getCurrentTimestamp(),
        event_type: "StartEvent",
        event_payload: {},
    }
    events.push(startEvent);
    onEventCallback(startEvent);

    // Play the Nodes in the NodeGraph:
    const nodes = nodeGraph.nodes;
    let nodePlayer = new NodePlayer();
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const nodePlayId = await nodePlayer.prepare(node.node_parameters);
        let nodeMeasurements = await nodePlayer.play(nodePlayId);

        // Update the progress bar:
        nodePlayer.setProgressBar((i + 1) / nodes.length * 100);

        // Package the NodeResultEvent:
        const nodeResultEvent: NodeResultEvent = {
            event_id: generateEventId(),
            event_timestamp: getCurrentTimestamp(),
            event_type: "NodeResultEvent",
            event_payload: {
                node_id: node.node_id,
                timestamp_start: nodeMeasurements.timestamp_node_started,
                timestamp_end: nodeMeasurements.timestamp_node_completed,
                node_execution_index: i,
                action: nodeMeasurements.action,
                runtime_metrics: nodeMeasurements.runtime_metrics,
            }
        }
        events.push(nodeResultEvent);
        onEventCallback(nodeResultEvent);
    }

    // Bonus disclosure + end button phase:
    const bonusComputed = computeBonusUsd(
        events,
        nodeGraph.bonus_rules,
    )

    let bonusMessage = '';
    if (bonusComputed > 0) {
        bonusMessage = `Bonus: ${bonusComputed} USD (pending validation)`;
    }
    await nodePlayer.playEndScreen(
        bonusMessage,
    )

    // Emit the BonusDisclosureEvent:
    if (bonusMessage !== '') {
        const bonusDisclosureEvent: Event = {
            event_id: generateEventId(),
            event_timestamp: getCurrentTimestamp(),
            event_type: "BonusDisclosureEvent",
            event_payload: {
                bonus_amount_usd: bonusComputed.toFixed(2) as MonetaryAmountUsd,
            }
        }
        events.push(bonusDisclosureEvent);
        onEventCallback(bonusDisclosureEvent);
    }

    // Generate the EndEvent:
    const endEvent: EndEvent = {
        event_id: generateEventId(),
        event_timestamp: getCurrentTimestamp(),
        event_type: "EndEvent",
        event_payload: {},
    }
    events.push(endEvent);
    onEventCallback(endEvent);

    // Remove the visibility change listener:
    document.removeEventListener("visibilitychange", onVisibilityChange);

    // Show Events:
    nodePlayer.showConsoleMessageOverlay(
        'Events',
        events,
    );

    return events
}