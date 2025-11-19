import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {Effect} from "./effects/base.ts";
import type {ColorHexString, NodeId, CardId, SensorId, RegisterId} from "./common.ts";
import type {NodeOutcome} from "./events/node-events.ts";
import type {Expression, Value} from "./expressions/expressions.ts";
import type {Event} from "./events";


export interface BaseNodePredicate<T extends string> {
    predicate_type: T
}

export interface SensorResolvedPredicate extends BaseNodePredicate<'SensorResolvedPredicate'> {
    sensor_id: SensorId
}
export interface AllPredicate extends BaseNodePredicate<'AllPredicate'> {
    items: NodePredicate[] | '*'
}
export interface RacePredicate extends BaseNodePredicate<'RacePredicate'> {
    items: NodePredicate[] | '*'
}

export interface AtLeastPredicate extends BaseNodePredicate<'AtLeastPredicate'> {
    items: NodePredicate[]
    min: number;
}

export type NodePredicate = SensorResolvedPredicate | AllPredicate | RacePredicate | AtLeastPredicate;

export interface Node {
    cards: Record<CardId, Card>;
    sensors: Record<SensorId, Sensor>;
    effects: Effect[];
    board_color: ColorHexString;
    exit: NodePredicate;
}


export interface Transition {
    when: Expression
    to: NodeId
    register_updates: Record<RegisterId, Expression>
}

export interface Graph {
    nodekit_version: string;
    nodes: Record<NodeId, Node>;
    transitions: Record<NodeId, Transition[]>;
    registers: Record<RegisterId, Value>
    start: NodeId;
}

export interface Trace {
    nodekit_version: string;
    events: Event[]
    node_outcomes: NodeOutcome[];
}