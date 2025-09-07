import {NodePlayer} from "./node-player.ts";
import type {EndEvent, Event, LeaveEvent, NodeResultEvent, ReturnEvent, StartEvent, UUID} from "./types/events";
import {type ISO8601, type MonetaryAmountUsd} from "./types/common.ts";
import {computeBonusUsd} from "./rule-engines/bonus-rule-engine.ts";
import type {NodeGraph} from "./types/node-graph.ts";
import {performanceNowToISO8601} from "./utils.ts";

type OnEventCallback = (event: Event) => void;


function generateEventId(): UUID {
    return crypto.randomUUID() as UUID;
}

function getCurrentTimestamp(): ISO8601 {
    return performanceNowToISO8601(performance.now())
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
        onEventCallback = (_event: Event) => {};
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

    // Todo: always have a "start" button to gain focus and ensure the user is ready; emit the StartEvent after that.
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
        const nodePlayId = await nodePlayer.prepare(node);
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
                node_execution_index: i,
                timestamp_start: nodeMeasurements.timestamp_start,
                timestamp_end: nodeMeasurements.timestamp_end,
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
    await nodePlayer.playEndScreen(bonusMessage)

    // Emit the BonusDisclosureEvent (if applicable):
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