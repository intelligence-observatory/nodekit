import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {ColorHexString, NodeId, RegisterId, Value} from "./value.ts";
import type {Event} from "./events";
import type {Transition} from "./transition.ts";

export interface Node {
    type: 'Node';
    stimulus: Card | null;
    sensor: Sensor;
    board_color: ColorHexString;
    hide_pointer: boolean
}

export interface Graph {
    type: 'Graph';
    nodekit_version: string;
    nodes: Record<NodeId, Node | Graph>;
    transitions: Record<NodeId, Transition>;
    start: NodeId;
    registers: Record<RegisterId, Value>
}

export interface Trace {
    nodekit_version: string;
    events: Event[]
}