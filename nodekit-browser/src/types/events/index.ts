import type {Action} from "../actions";
import type {TimeElapsedMsec} from "../common.ts";

export type NodeIndex = number & { __brand: "NodeIndex" };
export type SensorIndex = number & { __brand: "SensorIndex" };

// Base:
export interface BaseEvent<T extends string> {
    event_type: T,
    t: TimeElapsedMsec, // The time the Event was emitted, relative to the start of the Trace
}

// Concrete types:
export interface StartEvent extends BaseEvent<'StartEvent'>{}
export interface EndEvent extends BaseEvent<'EndEvent'>{}
export interface LeaveEvent extends BaseEvent<'LeaveEvent'>{}
export interface ReturnEvent extends BaseEvent<'ReturnEvent'>{}
export interface BrowserContextEvent extends BaseEvent<'BrowserContextEvent'>{
    user_agent: string,
    viewport_width_px: number,
    viewport_height_px: number,
    display_width_px: number,
    display_height_px: number
}


interface BaseNodeEvent<T extends string> extends BaseEvent<T> {
    // Base class for Events which are associated with a particular Node in the Timeline
    node_index: NodeIndex, // Timeline.nodes[node_index] is the Node this event originated;
}

export interface NodeStartEvent extends BaseNodeEvent<'NodeStartEvent'>{}

export interface ActionEvent extends BaseNodeEvent<'ActionEvent'>{
    sensor_index: SensorIndex, // Timeline.nodes[node_index].sensors[sensor_index] is the Sensor that fired
    action: Action,
}

export interface NodeEndEvent extends BaseNodeEvent<'NodeEndEvent'>{}

// Union type:
export type Event =
    StartEvent |
    BrowserContextEvent |
    LeaveEvent |
    ReturnEvent |
    NodeStartEvent |
    ActionEvent |
    NodeEndEvent |
    EndEvent;
