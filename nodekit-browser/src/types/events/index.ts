import type {NodeId, PixelSize, PressableKey, SpatialPoint, TimeElapsedMsec} from "../value.ts";
import type {Action} from "../actions";
import type {Node} from "../node.ts";

export interface BaseEvent<T extends string> {
    event_type: T,
    t: TimeElapsedMsec, // The time the Event was emitted, relative to the start of the Trace
}

// System events:

export interface TraceStartedEvent extends BaseEvent<'TraceStartedEvent'>{}

export interface TraceEndedEvent extends BaseEvent<'TraceEndedEvent'>{}

export interface PageSuspendedEvent extends BaseEvent<'PageSuspendedEvent'>{}

export interface PageResumedEvent extends BaseEvent<'PageResumedEvent'>{}

interface RegionSizePx {
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

// Node events:
interface BaseNodeEvent<T extends string> extends BaseEvent<T>{
    node_id: NodeId
}

export interface NodeStartedEvent extends BaseNodeEvent<'NodeStartedEvent'>{
    node: Node
}

export interface ActionTakenEvent extends BaseNodeEvent<'ActionTakenEvent'>{
    action: Action
}

export interface NodeEndedEvent extends BaseNodeEvent<'NodeEndedEvent'> {}

// Agent inputs:
export interface PointerSampledEvent extends BaseEvent<'PointerSampledEvent'> {
    x: SpatialPoint,
    y: SpatialPoint,
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
    | NodeStartedEvent
    | ActionTakenEvent
    | NodeEndedEvent
    | TraceStartedEvent
    | TraceEndedEvent
