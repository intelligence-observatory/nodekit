import {NodePlayer} from "./node-player/node-player.ts";
import type {BonusDisclosureEvent, BrowserContextEvent, EndEvent, Event, LeaveEvent, NodeIndex, NodeResultEvent, ReturnEvent, StartEvent} from "./types/events";
import {type ISO8601, type MonetaryAmountUsd} from "./types/common.ts";
import {calculateBonusUsd} from "./ops/calculate-bonus.ts";
import type {Timeline, Trace} from "./types/node.ts";
import {performanceNowToISO8601} from "./utils.ts";
import {getBrowserContext} from "./user-gates/browser-context.ts";
import {DeviceGate} from "./user-gates/device-gate.ts";
import type {AssetUrl} from "./types/assets";

export type OnEventCallback = (event: Event) => void;


function getCurrentTimestamp(): ISO8601 {
    return performanceNowToISO8601(performance.now())
}

export async function play(
    timeline: Timeline,
    assetUrls: AssetUrl[],
    onEventCallback: OnEventCallback | null = null,
    previousEvents: Event[] = [],
): Promise<Trace> {
    /*
    Executes a run through the Timeline. Events are returned as an array.
    Events emitted from a previous, interrupted run of the Timeline can be provided to continue from the point of interruption.
    */

    // If no onEventCallback is provided, use a no-op function:
    if (!onEventCallback) {
        onEventCallback = (_event: Event) => {};
    }

    let events: Event[] = previousEvents;
    // Todo: the previousEvents can be processed to obtain the current state of the task. Otherwise, we always start from scratch.

    // Todo: version gating
    const nodekitVersion = timeline.nodekit_version;

    // Initialize the NodePlayer:
    let nodePlayer = new NodePlayer();


    // Device gating:
    if (!DeviceGate.isValidDevice()){
        const error = new Error('Unsupported device. Please use a desktop browser.');
        nodePlayer.showErrorMessageOverlay(error);
        throw error;
    }

    nodePlayer.showConnectingOverlay()
    // Todo: await preload assets
    for (const assetUrl of assetUrls) {
        nodePlayer.boardViewsUI.assetManager.registerAsset(assetUrl)
    }

    nodePlayer.hideConnectingOverlay()


    // Todo: always have a "start" button to gain focus and ensure the user is ready; emit the StartEvent after that.
    await nodePlayer.playStartScreen()
    // Emit the StartEvent
    const startEvent: StartEvent = {
        event_type: "StartEvent",
        timestamp_event: getCurrentTimestamp(),
    }
    events.push(startEvent);
    onEventCallback(startEvent);

    // Add a listener for the LeaveEvent:
    function onVisibilityChange() {
        if (document.visibilityState === "hidden") {
            const leaveEvent: LeaveEvent = {
                event_type: "LeaveEvent",
                timestamp_event: getCurrentTimestamp(),
            };
            events.push(leaveEvent);
            onEventCallback!(leaveEvent);
        } else if (document.visibilityState === "visible") {
            // Optionally handle when the document becomes visible again
            const returnEvent: ReturnEvent = {
                event_type: "ReturnEvent",
                timestamp_event: getCurrentTimestamp(),
            };
            events.push(returnEvent);
            onEventCallback!(returnEvent);
        }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    // Emit the BrowserContextEvent:
    const browserContext = getBrowserContext();
    const browserContextEvent: BrowserContextEvent = {
        event_type: "BrowserContextEvent",
        timestamp_event: getCurrentTimestamp(),
        user_agent: browserContext.userAgent,
        viewport_width_px: browserContext.viewportWidthPx,
        viewport_height_px: browserContext.viewportHeightPx,
        display_width_px: browserContext.displayWidthPx,
        display_height_px: browserContext.displayHeightPx,
    }
    events.push(browserContextEvent);
    onEventCallback(browserContextEvent);

    const nodes = timeline.nodes;
    for (let nodeIndex = 0 as NodeIndex; nodeIndex < nodes.length; nodeIndex++) {
        // Prepare the Node:
        const node = nodes[nodeIndex];
        const nodePlayId = await nodePlayer.prepare(node);

        // Play the Node:
        let result = await nodePlayer.play(nodePlayId);

        // Package the NodeResultEvent:
        const nodeResultEvent: NodeResultEvent = {
            event_type: "NodeResultEvent",
            timestamp_event: getCurrentTimestamp(),
            timestamp_node_start: result.timestampStart,
            timestamp_action: result.timestampAction,
            timestamp_node_end: result.timestampEnd,
            node_index: nodeIndex,
            sensor_index: result.sensorIndex,
            action: result.action,
        }
        events.push(nodeResultEvent);
        onEventCallback(nodeResultEvent);

        // Update the progress bar:
        nodePlayer.setProgressBar((nodeIndex + 1) / nodes.length * 100);
    }

    // Bonus disclosure + end button phase:
    const bonusComputed = calculateBonusUsd(
        events,
        timeline,
    )

    let bonusMessage = '';
    if (bonusComputed > 0) {
        bonusMessage = `Bonus: ${bonusComputed} USD (pending validation)`;
    }
    await nodePlayer.playEndScreen(bonusMessage)

    // Emit the BonusDisclosureEvent (if applicable):
    if (bonusMessage !== '') {
        const bonusDisclosureEvent: BonusDisclosureEvent = {
            event_type: "BonusDisclosureEvent",
            timestamp_event: getCurrentTimestamp(),
            bonus_amount_usd: bonusComputed.toFixed(2) as MonetaryAmountUsd,
        }
        events.push(bonusDisclosureEvent);
        onEventCallback(bonusDisclosureEvent);
    }

    // Generate the EndEvent:
    const endEvent: EndEvent = {
        event_type: "EndEvent",
        timestamp_event: getCurrentTimestamp(),
    }
    events.push(endEvent);
    onEventCallback(endEvent);

    // Remove the visibility change listener:
    document.removeEventListener("visibilitychange", onVisibilityChange);

    // Assemble trace:
    const trace = {
        nodekit_version: nodekitVersion,
        events: events,
    }

    // Show the trace in the console for debugging:
    nodePlayer.showConsoleMessageOverlay(
        'Trace',
        trace,
    );

    return trace
}