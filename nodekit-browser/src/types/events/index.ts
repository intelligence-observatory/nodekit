import type {Action} from "../actions";
import type {ISO8601} from "../common.ts";

export type NodeIndex = number & { __brand: "NodeIndex" };
export type SensorIndex = number & { __brand: "SensorIndex" };

// Base:
export interface BaseEvent<T extends string> {
    event_type: T,
    timestamp_event: ISO8601,
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

export interface NodeResultEvent extends BaseEvent<'NodeResultEvent'>{
    timestamp_node_start: ISO8601,
    timestamp_action: ISO8601,
    timestamp_node_end: ISO8601,
    node_index: NodeIndex, // Timeline.nodes[node_index] is the Node this event originated from
    sensor_index: SensorIndex, // Timeline.nodes[node_index].sensors[sensor_index] is the Sensor that fired
    action: Action,
}



// Union type:
export type Event =
    StartEvent |
    EndEvent |
    NodeResultEvent |
    LeaveEvent |
    ReturnEvent |
    BrowserContextEvent;
