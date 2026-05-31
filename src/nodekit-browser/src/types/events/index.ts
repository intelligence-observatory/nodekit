import type {GraphAddress, NodeAddress, PixelSize, PressableKey, PixelPoint, TimeElapsedMsec} from "../values.ts";
import type {Action} from "../actions.ts";

export interface BaseEvent<T extends string> {
    event_type: T,
    t: TimeElapsedMsec, // The time the Event was emitted, relative to the start of the Trace
}

// System events:

export interface TraceStartedEvent extends BaseEvent<'TraceStartedEvent'>{}

export interface TraceEndedEvent extends BaseEvent<'TraceEndedEvent'>{}

export interface PageSuspendedEvent extends BaseEvent<'PageSuspendedEvent'>{}

export interface PageResumedEvent extends BaseEvent<'PageResumedEvent'>{}

export interface RegionSizePx {
    width_px: PixelSize,
    height_px: PixelSize
}

export interface BrowserContextSampledEvent extends BaseEvent<'BrowserContextSampledEvent'> {
    user_agent: string,
    timestamp_client: string, // ISO8601
    device_pixel_ratio: number,
    display: RegionSizePx,
    viewport: RegionSizePx,
}

// Graph events:
interface BaseGraphEvent<T extends string> extends BaseEvent<T>{
    graph_address: GraphAddress
}

export interface GraphStartedEvent extends BaseGraphEvent<'GraphStartedEvent'> {}

export interface GraphEndedEvent extends BaseGraphEvent<'GraphEndedEvent'> {}

// Node events:
interface BaseNodeEvent<T extends string> extends BaseEvent<T>{
    node_address: NodeAddress
}

export interface NodeStartedEvent extends BaseNodeEvent<'NodeStartedEvent'>{}

export interface ActionTakenEvent extends BaseNodeEvent<'ActionTakenEvent'>{
    action: Action
}

export interface NodeEndedEvent extends BaseNodeEvent<'NodeEndedEvent'> {}

// Agent inputs:
export interface PointerSampledEvent extends BaseEvent<'PointerSampledEvent'> {
    x: PixelPoint,
    y: PixelPoint,
    kind: 'down' | 'up' | 'move'
}

export interface KeySampledEvent extends BaseEvent<'KeySampledEvent'> {
    key: PressableKey
    kind: 'down' | 'up'
}

// Union type:
export type Event =
    | BrowserContextSampledEvent
    | PageSuspendedEvent
    | PageResumedEvent
    | KeySampledEvent
    | PointerSampledEvent
    | GraphStartedEvent
    | GraphEndedEvent
    | NodeStartedEvent
    | ActionTakenEvent
    | NodeEndedEvent
    | TraceStartedEvent
    | TraceEndedEvent
