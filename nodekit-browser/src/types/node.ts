import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {ColorHexString, NodeId, RegisterId, Value} from "./value.ts";
import type {Expression} from "./expressions/expressions.ts";
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
    start: NodeId;
    registers: Record<RegisterId, Value>

}

export interface Trace {
    nodekit_version: string;
    events: Event[]
}