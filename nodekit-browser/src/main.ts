import {NodePlayer} from "./node-player/node-player.ts";
import type {BrowserContextEvent, EndEvent, Event, LeaveEvent, NodeIndex, NodeStartEvent, ActionEvent, NodeEndEvent, ReturnEvent, StartEvent} from "./types/events";
import {Clock} from "./clock.ts";
import type {Timeline, Trace} from "./types/node.ts";
import {getBrowserContext} from "./user-gates/browser-context.ts";
import {DeviceGate} from "./user-gates/device-gate.ts";
import type {AssetUrl} from "./types/assets";
import type {TimeElapsedMsec} from "./types/common.ts";
import {createNodeKitRootDiv} from "./ui/ui-builder.ts";
import {AssetManager} from "./asset-manager";
import {ShellUI} from "./ui/shell-ui/shell-ui.ts";
import {BoardViewsUI} from "./ui/board-views-ui/board-views-ui.ts";

export type OnEventCallback = (event: Event) => void;


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

    // Initialize managers:
    const nodeKitDiv = createNodeKitRootDiv();

    const assetManager = new AssetManager();
    const shellUI = new ShellUI()
    shellUI.mount(nodeKitDiv); // turn this into constructor

    const boardUI = new BoardViewsUI(assetManager);
    nodeKitDiv.appendChild(boardUI.root)

    const nodePlayer = new NodePlayer(shellUI, boardUI);


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

    const clock = new Clock();

    // Start screen:
    await nodePlayer.playStartScreen()
    clock.start()
    const startEvent: StartEvent = {
        event_type: "StartEvent",
        t: 0 as TimeElapsedMsec,
    }
    events.push(startEvent);
    onEventCallback(startEvent);

    // Add a listener for the LeaveEvent:
    function onVisibilityChange() {
        if (document.visibilityState === "hidden") {
            const leaveEvent: LeaveEvent = {
                event_type: "LeaveEvent",
                t: clock.now(),
            };
            events.push(leaveEvent);
            onEventCallback!(leaveEvent);
        } else if (document.visibilityState === "visible") {
            // Optionally handle when the document becomes visible again
            const returnEvent: ReturnEvent = {
                event_type: "ReturnEvent",
                t: clock.now(),
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
        t: clock.now(),
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

        // Emit the NodeStartEvent: todo: emit immediately when actually started?
        const nodeStartEvent: NodeStartEvent = {
            event_type: "NodeStartEvent",
            t: clock.convertDomTimestampToClockTime(result.domTimestampStart),
            node_index: nodeIndex,
        }
        events.push(nodeStartEvent);
        onEventCallback(nodeStartEvent);

        // Emit the ActionEvent: todo: emit immediately
        const actionEvent: ActionEvent = {
            event_type: "ActionEvent",
            t: clock.convertDomTimestampToClockTime(result.domTimestampAction),
            node_index: nodeIndex,
            sensor_index: result.sensorIndex,
            action: result.action,
        }
        events.push(actionEvent);
        onEventCallback(actionEvent);

        // Emit the NodeEndEvent: todo: emit immediately
        const nodeEndEvent: NodeEndEvent = {
            event_type: "NodeEndEvent",
            t: clock.convertDomTimestampToClockTime(result.domTimestampEnd),
            node_index: nodeIndex,
        }
        events.push(nodeEndEvent);
        onEventCallback(nodeEndEvent);
        
        // Update the progress bar:
        nodePlayer.setProgressBar((nodeIndex + 1) / nodes.length * 100);
    }

    // End screen:
    await nodePlayer.playEndScreen()

    // Generate the EndEvent:
    const endEvent: EndEvent = {
        event_type: "EndEvent",
        t: clock.now(),
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