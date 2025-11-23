import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {ColorHexString, NodeId, RegisterId} from "./common.ts";
import type {NodeOutcome} from "./events/node-events.ts";
import type {Expression, Value} from "./expressions/expressions.ts";
import type {Event} from "./events";

export interface Node {
    stimulus: Card;
    sensor: Sensor;
    board_color: ColorHexString;
    hide_pointer: boolean
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