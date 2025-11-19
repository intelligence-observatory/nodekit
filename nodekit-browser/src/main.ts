import type {BrowserContextSampledEvent, Event, PageResumedEvent, PageSuspendedEvent, TraceEndedEvent, TraceStartedEvent} from "./types/events";
import {Clock} from "./clock.ts";
import type {Graph, Trace} from "./types/node.ts";
import {getBrowserContext} from "./user-gates/browser-context.ts";
import {checkDeviceIsValid} from "./user-gates/device-gate.ts";
import type {NodeId, RegisterId, TimeElapsedMsec} from "./types/common.ts";
import {createNodeKitRootDiv} from "./ui/ui-builder.ts";
import {AssetManager} from "./asset-manager";
import {ShellUI} from "./ui/shell-ui/shell-ui.ts";
import {getBoardViewsContainerDiv} from "./ui/board-views-ui/board-views-ui.ts";
import {NodePlay} from "./node-play";
import {version as NODEKIT_VERSION} from '../package.json'
import {gt, major} from 'semver';
import {EventArray} from "./event-array.ts";
import type {NodeOutcome} from "./types/events/node-events.ts";
import {evl} from "./types/expressions/expressions.ts";

/**
 * Plays a Graph, returning a Trace of Events.
 * @param graph
 * @param onEventCallback
 * @param previousEvents
 * @param debugMode
 */
export async function play(
    graph: Graph,
    onEventCallback: ((event: Event) => void) | null = null,
    previousEvents: Event[] = [],
    debugMode: boolean=false,
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
    const boardViewsContainerDiv = getBoardViewsContainerDiv();
    nodeKitDiv.appendChild(boardViewsContainerDiv)

    // Version gate:
    if (gt(graph.nodekit_version, NODEKIT_VERSION) || major(graph.nodekit_version) !== major(NODEKIT_VERSION)) {
        throw new Error(`Incompatible NodeKit version requested: ${graph.nodekit_version}, Runtime version: ${NODEKIT_VERSION}`);
    }

    // Device gate:
    if (!checkDeviceIsValid()){
        const error = new Error('Unsupported device for NodeKit. Please use a desktop browser.');
        shellUI.showErrorOverlay(error);
        throw error;
    }

    shellUI.showSessionConnectingOverlay()
    const assetManager = new AssetManager();
    const clock = new Clock();

    shellUI.hideSessionConnectingOverlay()

    // Start screen:
    if(!debugMode){
        await shellUI.playStartScreen()
    }


    clock.start()
    const startEvent: TraceStartedEvent = {
        event_type: "TraceStartedEvent",
        t: 0 as TimeElapsedMsec,
    }
    eventArray.push(startEvent);

    // Add a listener for the LeaveEvent:
    function onVisibilityChange() {
        if (document.visibilityState === "hidden") {
            // Triggered when the document becomes hidden (e.g., user switches tabs or minimizes the window)
            const leaveEvent: PageSuspendedEvent = {
                event_type: "PageSuspendedEvent",
                t: clock.now(),
            };
            eventArray.push(leaveEvent);
        } else if (document.visibilityState === "visible") {
            // Triggered when the document becomes visible again
            const returnEvent: PageResumedEvent = {
                event_type: "PageResumedEvent",
                t: clock.now(),
            };
            eventArray.push(returnEvent);
        }
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    // Emit the BrowserContextEvent:
    const browserContext = getBrowserContext();
    const browserContextEvent: BrowserContextSampledEvent = {
        event_type: "BrowserContextSampledEvent",
        t: clock.now(),
        user_agent: browserContext.userAgent,
        viewport_width_px: browserContext.viewportWidthPx,
        viewport_height_px: browserContext.viewportHeightPx,
        display_width_px: browserContext.displayWidthPx,
        display_height_px: browserContext.displayHeightPx,
        device_pixel_ratio: browserContext.devicePixelRatio,
    }
    eventArray.push(browserContextEvent);

    const nodes = graph.nodes;

    // Assemble transition map:
    let currentNodeId: NodeId = graph.start;
    let nodeResults: NodeOutcome[] = [];
    while (true) {
        // Todo: Evaluate any current Node parameter expressions:
        const node = nodes[currentNodeId];

        // Create and prepare the NodePlay:
        const nodePlay = new NodePlay(
            node,
            assetManager,
            clock,
        )
        // Mount the NodePlay to the DOM:
        boardViewsContainerDiv.appendChild(nodePlay.root);

        await nodePlay.prepare()

        // Play the Node:
        let result = await nodePlay.run(clock);
        nodeResults.push(
            {
                node_id: currentNodeId,
                sensor_values: result.outcome,
                t: result.t
            }
        )

        // Clear the rootBoardContainerDiv of all children:
        while (boardViewsContainerDiv.firstChild) {
            boardViewsContainerDiv.removeChild(boardViewsContainerDiv.firstChild);
        }

        // Get the next Node; if no Transitions for this Node are given, fall through to 'END':
        if (!(currentNodeId in graph.transitions)) {
            console.log('No transitions found')
            break
        }

        let nextNodeId = null;
        let transitions = graph.transitions[currentNodeId];
        for (const transition of transitions){
            const value = evl(transition.when, graph.registers, {}, result.outcome)
            console.log('transition value', value)
            if (value === true){
                // Valid transition found:
                nextNodeId = transition.to;

                // Update graph registers:
                for (const [registerId, updateExpression] of Object.entries(transition.register_updates)){
                    const updateValue = evl(updateExpression, graph.registers, {}, result.outcome);
                    console.log(registerId, updateValue)
                    graph.registers[registerId as RegisterId] = updateValue
                    console.log('registers', graph.registers)
                }
            }
        }

        if (nextNodeId === null){
            break
        }

        currentNodeId = nextNodeId;

    }

    // Generate the EndEvent:
    const endEvent: TraceEndedEvent = {
        event_type: "TraceEndedEvent",
        t: clock.now(),
    }
    eventArray.push(endEvent);

    // Remove the visibility change listener:
    document.removeEventListener("visibilitychange", onVisibilityChange);

    // Assemble trace:
    const trace: Trace = {
        nodekit_version: NODEKIT_VERSION,
        node_outcomes: nodeResults,
        events: eventArray.events,
    }

    // End screen:
    await shellUI.playEndScreen()

    // Show the Trace in the console:
    shellUI.showConsoleMessageOverlay(
        'Trace',
        trace,
    );

    return trace
}

