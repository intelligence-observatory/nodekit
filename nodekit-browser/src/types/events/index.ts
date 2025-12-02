import type {NodeId, PressableKey, SpatialPoint, TimeElapsedMsec} from "../common.ts";
import type {BrowserContextSampledEvent} from "./browser-context.ts";
import type {Action} from "../actions";

export interface BaseEvent<T extends string> {
    event_type: T,
    t: TimeElapsedMsec, // The time the Event was emitted, relative to the start of the Trace
}

// System events:
export interface PageSuspendedEvent extends BaseEvent<'PageSuspendedEvent'>{}

export interface PageResumedEvent extends BaseEvent<'PageResumedEvent'>{}

export interface TraceStartedEvent extends BaseEvent<'TraceStartedEvent'>{}

export interface TraceEndedEvent extends BaseEvent<'TraceEndedEvent'>{}

// Node events:
interface BaseNodeEvent<T extends string> extends BaseEvent<T>{
    node_id: NodeId
}

export interface NodeStartedEvent extends BaseNodeEvent<'NodeStartedEvent'>{}

export interface ActionTakenEvent extends BaseNodeEvent<'ActionTakenEvent'>{
    action: Action
}

export interface NodeEndedEvent extends BaseNodeEvent<'NodeEndedEvent'> {}

// Agent inputs:
export interface PointerInputEvent extends BaseEvent<'PointerInputEvent'> {
    x: SpatialPoint,
    y: SpatialPoint,
    kind: 'down' | 'up' | 'move'
}

export interface KeyInputEvent extends BaseEvent<'KeyInputEvent'> {
    key: PressableKey
    kind: 'down' | 'up'
}


// Union type:
export type Event =
    | BrowserContextSampledEvent
    | PageSuspendedEvent
    | PageResumedEvent
    | KeyInputEvent
    | PointerInputEvent
    | NodeStartedEvent
    | ActionTakenEvent
    | NodeEndedEvent
    | TraceStartedEvent
    | TraceEndedEvent
