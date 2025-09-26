import type {Action} from "../actions";
import type {NodeId, SensorId, TimeElapsedMsec} from "../common.ts";

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
}


interface BaseNodeEvent<T extends string> extends BaseEvent<T> {
    node_id: NodeId, // Graph.nodes[node_id] is the Node this event originated;
}

export interface NodeEnterEvent extends BaseNodeEvent<'NodeEnterEvent'>{}

export interface NodeExitEvent extends BaseNodeEvent<'NodeExitEvent'>{
    sensor_id: SensorId, // Graph.nodes[node_id].sensors[sensor_id] is the Sensor that fired
    action: Action,
}

// Union type:
export type Event =
    StartEvent |
    BrowserContextEvent |
    LeaveEvent |
    ReturnEvent |
    NodeEnterEvent |
    NodeExitEvent |
    EndEvent;
