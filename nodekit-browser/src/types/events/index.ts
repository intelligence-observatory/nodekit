import type {Action} from "../actions";
import type {CardId, NodeId, PressableKey, SensorId, SpatialPoint, TimeElapsedMsec} from "../common.ts";

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

export interface CardShownEvent extends BaseNodeEvent<'CardShownEvent'>{
    card_id: CardId, // Graph.nodes[node_id].cards[card_id] is the Card that was shown
}
export interface CardHiddenEvent extends BaseNodeEvent<'CardHiddenEvent'>{
    card_id: CardId, // Graph.nodes[node_id].cards[card_id] is the Card that was hidden
}

export interface SensorArmedEvent extends BaseNodeEvent<'SensorArmedEvent'>{
    sensor_id: SensorId, // Graph.nodes[node_id].sensors[sensor_id]
}
export interface SensorFiredEvent extends BaseNodeEvent<'SensorFiredEvent'>{
    sensor_id: SensorId, // Graph.nodes[node_id].sensors[sensor_id] is the Sensor that fired
    action: Action,
}

export interface SensorDisarmedEvent extends BaseNodeEvent<'SensorDisarmedEvent'>{
    sensor_id: SensorId, // Graph.nodes[node_id].sensors[sensor_id]
}

export interface NodeExitedEvent extends BaseNodeEvent<'NodeExitedEvent'>{}

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
    CardShownEvent |
    CardHiddenEvent |
    SensorArmedEvent |
    SensorFiredEvent |
    SensorDisarmedEvent |
    NodeExitedEvent |
    PointerSampledEvent |
    KeySampledEvent |
    TraceEndedEvent;
