import type {Event, PageResumedEvent, PageSuspendedEvent, TraceEndedEvent, TraceStartedEvent} from "./types/events";
import {Clock} from "./clock.ts";
import type {Graph, Trace} from "./types/node.ts";
import {sampleBrowserContext} from "./user-gates/browser-context.ts";
import {userDeviceIsValid} from "./user-gates/device-gate.ts";
import type {NodeAddress, NodeId, RegisterId, TimeElapsedMsec} from "./types/values.ts";
import {createNodeKitRootDiv} from "./ui/ui-builder.ts";
import {AssetManager} from "./asset-manager";
import {ShellUI} from "./ui/shell-ui/shell-ui.ts";
import {type BoardViewsContainerDiv, getBoardViewsContainerDiv} from "./ui/board-views-ui/board-views-ui.ts";
import {NodePlay} from "./node-play";
import {version as NODEKIT_VERSION} from '../package.json'
import {gt, major} from 'semver';
import {EventArray} from "./event-array.ts";
import {formatErrorReport} from "./error-reporting/format-error-report.ts";

import {evalTransition} from "./node-play/eval-transition.ts";
import {getSubmissionTarget} from "./submission/get-submission-target.ts";
import {submit} from "./submission/submit.ts";

/**
 * Plays a Graph.
 * @param graph
 * @param onEventCallback
 * @param debugMode
 */
export async function play(
    graph: Graph,
    onEventCallback: ((event: Event) => void) = (_event: Event) => {},
    debugMode: boolean = false,
): Promise<void> {
    // Initialize divs:
    const nodeKitDiv = createNodeKitRootDiv();
    const shellUI = new ShellUI()
    nodeKitDiv.appendChild(shellUI.root);
    const boardViewsContainerDiv = getBoardViewsContainerDiv();
    nodeKitDiv.appendChild(boardViewsContainerDiv)


    let submissionTarget: ReturnType<typeof getSubmissionTarget> | null = null;


    try{
        // Get submission context:
        submissionTarget = getSubmissionTarget();

        // Check if guarded by
        if (submissionTarget.externalPlatformContext.platform === "MechanicalTurkPreviewMode"){
            // And feed it with a custom Turk message here (regarding preview mode)
            shellUI.showConsoleMessageOverlay(
                'Mechanical Turk Preview Mode',
                'Accept the HIT to continue.',
            )
            return
        }

        // Start:
        const clock = new Clock();
        clock.start()

        const eventArray = new EventArray(onEventCallback);

        // Version gate:
        if (gt(graph.nodekit_version, NODEKIT_VERSION) || major(graph.nodekit_version) !== major(NODEKIT_VERSION)) {
            throw new Error(`Incompatible NodeKit version requested: ${graph.nodekit_version}, Runtime version: ${NODEKIT_VERSION}`);
        }

        // Device gate:
        if (!userDeviceIsValid()) {
            throw new Error('Unsupported device for NodeKit. Please use a desktop browser.');
        }

        shellUI.showSessionConnectingOverlay()
        const assetManager = new AssetManager();
        shellUI.hideSessionConnectingOverlay()

        // Start screen:
        if (!debugMode) {
            await shellUI.playStartScreen()
        }

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
        const browserContextEvent = sampleBrowserContext(clock);
        eventArray.push(browserContextEvent);

        // Core play loop:
        await playGraph(
            graph,
            [], // Root namespace
            {
                eventArray: eventArray,
                boardViewsContainerDiv: boardViewsContainerDiv,
                assetManager: assetManager,
                clock: clock,
            }
        )

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
            events: eventArray.events,
        }

        // End screen:
        await shellUI.playEndScreen()

        // Submit:
        await submit(trace, submissionTarget);

        // Show the Trace in the console:
        shellUI.showConsoleMessageOverlay(
            'Trace',
            '',
            trace,
        );

        return
    } catch (error) {
        let submissionTargetContext: unknown = submissionTarget;
        if (!submissionTargetContext) {
            try {
                submissionTargetContext = getSubmissionTarget();
            } catch (submissionTargetError) {
                submissionTargetContext = {error: String(submissionTargetError)};
            }
        }
        const report = formatErrorReport(error, {
            nodekitVersion: NODEKIT_VERSION,
            graphVersion: graph.nodekit_version,
            debugMode,
            submissionTarget: submissionTargetContext,
        });
        shellUI.showConsoleMessageOverlay(
            'Something went wrong. ',
            'Please copy the error report below and email it to the requester.',
            report,
        );
        throw error
    }
}


export interface PlayGraphContext {
    eventArray: EventArray,
    boardViewsContainerDiv: BoardViewsContainerDiv,
    assetManager: AssetManager,
    clock: Clock,
}

type RegisterFile = Readonly<Record<RegisterId, any>>;
async function playGraph(
    graph: Graph,
    parentAddress: NodeAddress,
    context: PlayGraphContext,
): Promise<RegisterFile> {

    const nodes = graph.nodes;
    const registers = { ...graph.registers };

    // Assemble transition map:
    let currentNodeId: NodeId = graph.start;
    let lastAction = null;
    let lastSubgraphRegisters: Record<RegisterId, any> | null = null;

    while (true) {
        const node = nodes[currentNodeId];
        const currentNodeAddress: NodeAddress = [...parentAddress, currentNodeId];

        // If a Graph, recurse.
        if (node.type === 'Graph') {
            lastSubgraphRegisters = await playGraph(
                node,
                currentNodeAddress,
                context
            )
        }
        // Otherwise, play the leaf Node
        else if (node.type === 'Node') {
            // Create and prepare the NodePlay:
            const nodePlay = new NodePlay(
                currentNodeAddress,
                node,
                context.assetManager,
                context.clock,
                context.eventArray,
            )
            // Mount the NodePlay to the DOM:
            context.boardViewsContainerDiv.appendChild(nodePlay.root);

            await nodePlay.prepare()

            // Play the Node:
            lastAction = await nodePlay.run();

        } else {
            throw new Error(`Unknown node type: ${(node as any).type}`)
        }

        // Clear the rootBoardContainerDiv of all children:
        while (context.boardViewsContainerDiv.firstChild) {
            context.boardViewsContainerDiv.removeChild(context.boardViewsContainerDiv.firstChild);
        }

        // Get the next Node; if no explicit Transitions for this Node are given, just End.
        if (!(currentNodeId in graph.transitions)) {
            break
        }

        let nextNodeId = null;
        const transition = graph.transitions[currentNodeId];
        const res = evalTransition(
            {
                transition: transition,
                registers: registers,
                lastAction: lastAction,
                lastSubgraphRegisters: lastSubgraphRegisters,
            }
        )
        // Set next Node:
        nextNodeId = res.nextNodeId;
        if (nextNodeId === null) {
            break
        }
        currentNodeId = nextNodeId;


        // Update Graph registers
        for (const [registerId, updateValue] of Object.entries(res.registerUpdates)) {
            registers[registerId as RegisterId] = updateValue
        }

        // Reset last:
        lastSubgraphRegisters = null;
        lastAction = null;
    }

    return registers;
}
