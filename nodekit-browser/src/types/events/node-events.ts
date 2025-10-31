
import type {BaseEvent} from "./index.ts";
import type {CardId, PressableKey, SensorId, SpatialPoint} from "../common.ts";
import type {SensorValue} from "../actions";

interface BaseNodeEvent<T extends string> extends BaseEvent<T> {}

export interface NodeEnteredEvent extends BaseNodeEvent<'NodeEnteredEvent'> {
}

export interface CardShownEvent extends BaseNodeEvent<'CardShownEvent'> {
    card_id: CardId, // Graph.nodes[node_id].cards[card_id] is the Card that was shown
}

export interface CardHiddenEvent extends BaseNodeEvent<'CardHiddenEvent'> {
    card_id: CardId, // Graph.nodes[node_id].cards[card_id] is the Card that was hidden
}

export interface SensorArmedEvent extends BaseNodeEvent<'SensorArmedEvent'> {
    sensor_id: SensorId, // Graph.nodes[node_id].sensors[sensor_id]
}

export interface SensorDisarmedEvent extends BaseNodeEvent<'SensorDisarmedEvent'> {
    sensor_id: SensorId, // Graph.nodes[node_id].sensors[sensor_id]
}

export interface NodeExitedEvent extends BaseNodeEvent<'NodeExitedEvent'> {
}

export interface PointerSampledEvent extends BaseEvent<'PointerSampledEvent'> {
    x: SpatialPoint,
    y: SpatialPoint,
    kind: 'down' | 'up' | 'move'
}

export interface KeySampledEvent extends BaseEvent<'KeySampledEvent'> {
    key: PressableKey
    kind: 'down' | 'up'
}

// SensorEvent
export interface BaseSensorEvent<T extends string> extends BaseEvent<T>{
    sensor_id: SensorId
}

export interface SensorFiredEvent extends BaseSensorEvent<'SensorFiredEvent'>{
    // Fired when the Sensor detects a valid new value
    sensor_value: SensorValue
}

export interface SensorTimedOutEvent extends BaseSensorEvent<'SensorTimedOutEvent'>{
    // Fired when the Sensor has timed out

}

export type SensorEvent = SensorFiredEvent | SensorTimedOutEvent;