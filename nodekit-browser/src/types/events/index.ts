import type {CardId, NodeId, PressableKey, SensorId, SpatialPoint, TimeElapsedMsec} from "../common.ts";

export interface BaseEvent<T extends string> {
    event_type: T,
    t: TimeElapsedMsec, // The time the Event was emitted, relative to the start of the Trace
}

// System events:
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

export interface TraceStartedEvent extends BaseEvent<'TraceStartedEvent'>{}
export interface TraceEndedEvent extends BaseEvent<'TraceEndedEvent'>{}

// Node events:
interface BaseNodeEvent<T extends string> extends BaseEvent<T>{
    node_id: NodeId
}

export interface NodeEnteredEvent extends BaseNodeEvent<'NodeEnteredEvent'>{
    // Fired when the node is entered
}
export interface CardChangedEvent extends BaseNodeEvent<'CardChangedEvent'> {
    card_id: CardId
    changes: Record<string, any> // Card property : new value
}

export interface SensorValueChangedEvent extends BaseNodeEvent<'SensorValueChangedEvent'> {
    sensor_id: SensorId
    changes: Record<string, any> // SensorValue property : new value
}

export interface NodeExitedEvent extends BaseNodeEvent<'NodeExitedEvent'> {
    // Fired when the node is exited
}

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
    BrowserContextSampledEvent |
    PageSuspendedEvent |
    PageResumedEvent |
    KeyInputEvent |
    PointerInputEvent |
    CardChangedEvent |
    SensorValueChangedEvent |
    NodeExitedEvent |
    NodeEnteredEvent |
    TraceStartedEvent |
    TraceEndedEvent
