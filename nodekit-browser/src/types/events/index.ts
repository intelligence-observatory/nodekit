import type {Action} from "../actions";
import type {NodeId, PressableKey, SensorId, SpatialPoint, TimeElapsedMsec} from "../common.ts";

interface BaseEvent<T extends string> {
    event_type: T,
    t: TimeElapsedMsec, // The time the Event was emitted, relative to the start of the Trace
}

export interface StartEvent extends BaseEvent<'StartEvent'>{}
export interface EndEvent extends BaseEvent<'EndEvent'>{}
export interface LeaveEvent extends BaseEvent<'LeaveEvent'>{}
export interface ReturnEvent extends BaseEvent<'ReturnEvent'>{}
export interface BrowserContextEvent extends BaseEvent<'BrowserContextEvent'>{
    user_agent: string,
    viewport_width_px: number,
    viewport_height_px: number,
    display_width_px: number,
    display_height_px: number,
    device_pixel_ratio: number,
}


interface BaseNodeEvent<T extends string> extends BaseEvent<T> {
    node_id: NodeId, // Graph.nodes[node_id] is the Node this event originated;
}

export interface NodeEnterEvent extends BaseNodeEvent<'NodeEnterEvent'>{}

export interface NodeExitEvent extends BaseNodeEvent<'NodeExitEvent'>{
    sensor_id: SensorId, // Graph.nodes[node_id].sensors[sensor_id] is the Sensor that fired
    action: Action,
}


export interface PointerSampleEvent extends BaseEvent<'PointerSampleEvent'>{
    x: SpatialPoint,
    y: SpatialPoint,
    kind: 'down' | 'up' | 'move'
}

export interface KeySampleEvent extends BaseEvent<'KeySampleEvent'>{
    key: PressableKey
    kind: 'down' | 'up'
}

// Union type:
export type Event =
    StartEvent |
    BrowserContextEvent |
    LeaveEvent |
    ReturnEvent |
    NodeEnterEvent |
    NodeExitEvent |
    PointerSampleEvent |
    KeySampleEvent |
    EndEvent;
