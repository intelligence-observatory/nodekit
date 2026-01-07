import type {Card} from "./cards";
import type {Sensor} from "./sensors.ts";
import type {ColorHexString, NodeId, RegisterId, Value} from "./values.ts";
import type {Event} from "./events";
import type {Transition} from "./transition.ts";

export interface Node {
    type: 'Node';
    card: Card | null;
    sensor: Sensor;
    board_color: ColorHexString;
    hide_pointer: boolean
    annotation: string
}

export interface Graph {
    type: 'Graph';
    nodekit_version: Readonly<string>;
    nodes: Readonly<Record<NodeId, Node | Graph>>;
    transitions: Readonly<Record<NodeId, Transition>>;
    start: NodeId;
    registers: Readonly<Record<RegisterId, Value>>
}

export interface Trace {
    nodekit_version: string;
    events: Event[]
}