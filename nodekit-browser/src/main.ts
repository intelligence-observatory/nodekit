import {NodePlayer} from "./node-player/node-player.ts";
import type {EndEvent, Event, LeaveEvent, NodeResultEvent, ReturnEvent, StartEvent, UUID} from "./types/events";
import {type ISO8601, type MonetaryAmountUsd} from "./types/common.ts";
import {calculateBonusUsd} from "./ops/calculate-bonus.ts";
import type {NodeGraph} from "./types/node-graph.ts";
import {performanceNowToISO8601} from "./utils.ts";
import {getBrowserContext} from "./user-gates/browser-context.ts";
import {DeviceGate} from "./user-gates/device-gate.ts";

export type OnEventCallback = (event: Event) => void;


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
    Events emitted from a previous, interrupted run of the NodeGraph can be provided to continue from the point of interruption.
    */

    // If no onEventCallback is provided, use a no-op function:
    if (!onEventCallback) {
        onEventCallback = (_event: Event) => {};
    }

    let events: Event[] = previousEvents;
    // Todo: the previousEvents can be processed to obtain the current state of the task. Otherwise, we always start from scratch.

    // Todo: version gating
    const nodekitVersion = nodeGraph.nodekit_version;

    // Initialize the NodePlayer:
    let nodePlayer = new NodePlayer(nodeGraph.board);

    // Device gating:
    if (!DeviceGate.isValidDevice()){
        const error = new Error('Unsupported device. Please use a desktop browser.');
        nodePlayer.showErrorMessageOverlay(error);
        throw error;
    }


    // Todo: always have a "start" button to gain focus and ensure the user is ready; emit the StartEvent after that.
    // Emit the StartEvent
    const startEvent: StartEvent = {
        event_id: generateEventId(),
        timestamp_event: getCurrentTimestamp(),
        event_type: "StartEvent",
        event_payload: {},
        nodekit_version: nodekitVersion,
    }
    events.push(startEvent);
    onEventCallback(startEvent);

    // Add a listener for the LeaveEvent:
    function onVisibilityChange() {
        if (document.visibilityState === "hidden") {
            const leaveEvent: LeaveEvent = {
                event_id: generateEventId(),
                timestamp_event: getCurrentTimestamp(),
                event_type: "LeaveEvent",
                event_payload: {},
                nodekit_version: nodekitVersion,
            };
            events.push(leaveEvent);
            onEventCallback!(leaveEvent);
        } else if (document.visibilityState === "visible") {
            // Optionally handle when the document becomes visible again
            const returnEvent: ReturnEvent = {
                event_id: generateEventId(),
                timestamp_event: getCurrentTimestamp(),
                event_type: "ReturnEvent",
                event_payload: {},
                nodekit_version: nodekitVersion,
            };
            events.push(returnEvent);
            onEventCallback!(returnEvent);
        }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    // Emit the BrowserContextEvent:
    const browserContext = getBrowserContext();
    const browserContextEvent: Event = {
        event_id: generateEventId(),
        timestamp_event: getCurrentTimestamp(),
        event_type: "BrowserContextEvent",
        event_payload: browserContext,
        nodekit_version: nodekitVersion,
    }
    events.push(browserContextEvent);
    onEventCallback(browserContextEvent);

    // Todo: buffer assets for the next N nodes

    // Play the Nodes in the NodeGraph:
    const nodes = nodeGraph.nodes;
    for (let i = 0; i < nodes.length; i++) {
        // Prepare the Node:
        const node = nodes[i];
        const nodePlayId = await nodePlayer.prepare(node);

        // Play the Node:
        let result = await nodePlayer.play(nodePlayId);

        // Package the NodeResultEvent:
        const nodeResultEvent: NodeResultEvent = {
            event_id: generateEventId(),
            timestamp_event: getCurrentTimestamp(),
            event_type: "NodeResultEvent",
            event_payload: {
                node_id: node.node_id,
                timestamp_node_start: result.timestamp_start,
                timestamp_node_end: result.timestamp_end,
                action: result.action,
            },
            nodekit_version: nodekitVersion,
        }
        events.push(nodeResultEvent);
        onEventCallback(nodeResultEvent);

        // Update the progress bar:
        nodePlayer.setProgressBar((i + 1) / nodes.length * 100);
    }

    // Bonus disclosure + end button phase:
    const bonusComputed = calculateBonusUsd(
        events,
        nodeGraph,
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
            timestamp_event: getCurrentTimestamp(),
            event_type: "BonusDisclosureEvent",
            event_payload: {
                bonus_amount_usd: bonusComputed.toFixed(2) as MonetaryAmountUsd,
            },
            nodekit_version: nodekitVersion,
        }
        events.push(bonusDisclosureEvent);
        onEventCallback(bonusDisclosureEvent);
    }

    // Generate the EndEvent:
    const endEvent: EndEvent = {
        event_id: generateEventId(),
        timestamp_event: getCurrentTimestamp(),
        event_type: "EndEvent",
        event_payload: {},
        nodekit_version: nodekitVersion,
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