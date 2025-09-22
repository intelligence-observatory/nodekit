import type {ActionEvent, BrowserContextEvent, EndEvent, Event, LeaveEvent, NodeEndEvent, NodeIndex, NodeStartEvent, ReturnEvent, StartEvent} from "./types/events";
import {Clock} from "./clock.ts";
import type {Timeline, Trace} from "./types/node.ts";
import {getBrowserContext} from "./user-gates/browser-context.ts";
import {checkDeviceIsValid} from "./user-gates/device-gate.ts";
import type {AssetUrl} from "./types/assets";
import type {TimeElapsedMsec} from "./types/common.ts";
import {createNodeKitRootDiv} from "./ui/ui-builder.ts";
import {AssetManager} from "./asset-manager";
import {ShellUI} from "./ui/shell-ui/shell-ui.ts";
import {tmpGetBoardViewsUIDiv} from "./ui/board-views-ui/board-views-ui.ts";
import {NodePlay} from "./node-player/node-play.ts";
import {version as NODEKIT_VERSION} from '../package.json'
import {gt, major} from 'semver';

/**
 * Plays a Timeline, returning a Trace of Events.
 * @param timeline
 * @param assetUrls
 * @param onEventCallback
 * @param previousEvents
 */
export async function play(
    timeline: Timeline,
    assetUrls: AssetUrl[],
    onEventCallback: ((event: Event) => void) | null = null,
    previousEvents: Event[] = [],
): Promise<Trace> {

    // If no onEventCallback is provided, use a no-op function:
    if (!onEventCallback) {
        onEventCallback = (_event: Event) => {};
    }

    // Todo: the previousEvents can be processed to obtain the current state of the task. Otherwise, we always start from scratch.
    const eventArray = new EventArray(previousEvents, onEventCallback);

    // Initialize divs:
    const nodeKitDiv = createNodeKitRootDiv();
    const shellUI = new ShellUI()
    nodeKitDiv.appendChild(shellUI.root);
    const rootBoardContainerDiv = tmpGetBoardViewsUIDiv();
    nodeKitDiv.appendChild(rootBoardContainerDiv)

    // Version gate:
    if (gt(timeline.nodekit_version, NODEKIT_VERSION) || major(timeline.nodekit_version) !== major(NODEKIT_VERSION)) {
        throw new Error(`Incompatible NodeKit version. Timeline version: ${timeline.nodekit_version}, NodeKit version: ${NODEKIT_VERSION}`);
    }

    // Device gate:
    if (!checkDeviceIsValid()){
        const error = new Error('Unsupported device for NodeKit. Please use a desktop browser.');
        shellUI.showErrorOverlay(error);
        throw error;
    }

    shellUI.showSessionConnectingOverlay()
    // Todo: await preload assets
    const assetManager = new AssetManager();
    for (const assetUrl of assetUrls) {
        assetManager.registerAsset(assetUrl)
    }
    shellUI.hideSessionConnectingOverlay()

    const clock = new Clock();

    // Start screen:
    await shellUI.playStartScreen()
    clock.start()
    const startEvent: StartEvent = {
        event_type: "StartEvent",
        t: 0 as TimeElapsedMsec,
    }
    eventArray.push(startEvent);

    // Add a listener for the LeaveEvent:
    function onVisibilityChange() {
        if (document.visibilityState === "hidden") {
            const leaveEvent: LeaveEvent = {
                event_type: "LeaveEvent",
                t: clock.now(),
            };
            eventArray.push(leaveEvent);
        } else if (document.visibilityState === "visible") {
            // Optionally handle when the document becomes visible again
            const returnEvent: ReturnEvent = {
                event_type: "ReturnEvent",
                t: clock.now(),
            };
            eventArray.push(returnEvent);
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
    eventArray.push(browserContextEvent);

    const nodes = timeline.nodes;
    for (let nodeIndex = 0 as NodeIndex; nodeIndex < nodes.length; nodeIndex++) {
        // Prepare the Node:
        const node = nodes[nodeIndex];
        const nodePlay = new NodePlay(
            node,
        )
        // Mount
        rootBoardContainerDiv.appendChild(nodePlay.boardView.root);
        await nodePlay.prepare(assetManager)

        // Play the Node:
        let result = await nodePlay.run();

        // Emit the NodeStartEvent: todo: emit immediately when actually started?
        const nodeStartEvent: NodeStartEvent = {
            event_type: "NodeStartEvent",
            t: clock.convertDomTimestampToClockTime(result.domTimestampStart),
            node_index: nodeIndex,
        }
        eventArray.push(nodeStartEvent);

        // Emit the ActionEvent: todo: emit immediately
        const actionEvent: ActionEvent = {
            event_type: "ActionEvent",
            t: clock.convertDomTimestampToClockTime(result.domTimestampAction),
            node_index: nodeIndex,
            sensor_index: result.sensorIndex,
            action: result.action,
        }
        eventArray.push(actionEvent);

        // Emit the NodeEndEvent: todo: emit immediately
        const nodeEndEvent: NodeEndEvent = {
            event_type: "NodeEndEvent",
            t: clock.convertDomTimestampToClockTime(result.domTimestampEnd),
            node_index: nodeIndex,
        }
        eventArray.push(nodeEndEvent);

        // Clear the rootBoardContainerDiv of all children:
        while (rootBoardContainerDiv.firstChild) {
            rootBoardContainerDiv.removeChild(rootBoardContainerDiv.firstChild);
        }
        
        // Update the progress bar:
        shellUI.setProgressBar((nodeIndex + 1) / nodes.length * 100);
    }

    // End screen:
    await shellUI.playEndScreen()

    // Generate the EndEvent:
    const endEvent: EndEvent = {
        event_type: "EndEvent",
        t: clock.now(),
    }
    eventArray.push(endEvent);

    // Remove the visibility change listener:
    document.removeEventListener("visibilitychange", onVisibilityChange);

    // Assemble trace:
    const trace = {
        nodekit_version: NODEKIT_VERSION,
        events: eventArray.events,
    }

    // Show the Trace in the console:
    shellUI.showConsoleMessageOverlay(
        'Trace',
        trace,
    );

    return trace
}

class EventArray {
    public events: Event[];
    private onEventCallback: (event: Event) => void;
    constructor(
        initialEvents: Event[],
        onEventCallback: ((event: Event) => void),
    ){
        this.onEventCallback = onEventCallback;
        this.events = initialEvents;
    }
    push(event: Event) {
        this.events.push(event);
        this.onEventCallback(event);
    }
}
