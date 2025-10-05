import type {Action} from "../actions";
import type {NodeId, PressableKey, SensorId, SpatialPoint, TimeElapsedMsec} from "../common.ts";

interface BaseEvent<T extends string> {
    event_type: T,
    t: TimeElapsedMsec, // The time the Event was emitted, relative to the start of the Trace
}

export interface TraceStartedEvent extends BaseEvent<'TraceStartedEvent'>{}
export interface TraceEndedEvent extends BaseEvent<'TraceEndedEvent'>{}
export interface PageSuspendedEvent extends BaseEvent<'PageSuspendedEvent'>{}
export interface PageResumedEvent extends BaseEvent<'PageResumedEvent'>{}
export interface BrowserContextSampledEvent extends BaseEvent<'BrowserContextSampledEvent'>{
    user_agent: string,
    viewport_width_px: number,
    viewport_height_px: number,
    display_width_px: number,
    display_height_px: number,
    device_pixel_ratio: number,
}

//
interface BaseNodeEvent<T extends string> extends BaseEvent<T> {
    node_id: NodeId, // Graph.nodes[node_id] is the Node this event originated;
}

export interface NodeEnteredEvent extends BaseNodeEvent<'NodeEnteredEvent'>{}

export interface NodeExitedEvent extends BaseNodeEvent<'NodeExitedEvent'>{
    sensor_id: SensorId, // Graph.nodes[node_id].sensors[sensor_id] is the Sensor that fired
    action: Action,
}

export interface PointerSampledEvent extends BaseEvent<'PointerSampledEvent'>{
    x: SpatialPoint,
    y: SpatialPoint,
    kind: 'down' | 'up' | 'move'
}

export interface KeySampledEvent extends BaseEvent<'KeySampledEvent'>{
    key: PressableKey
    kind: 'down' | 'up'
}

// Union type:
export type Event =
    TraceStartedEvent |
    BrowserContextSampledEvent |
    PageSuspendedEvent |
    PageResumedEvent |
    NodeEnteredEvent |
    NodeExitedEvent |
    PointerSampledEvent |
    KeySampledEvent |
    TraceEndedEvent;
