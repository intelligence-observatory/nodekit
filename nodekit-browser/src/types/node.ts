import type {Board} from "./board";
import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {Effect} from "./effects/base.ts";
import type {Event} from "./events";
import type {NodeIndex, SensorIndex} from "./common.ts";

export interface Node {
    cards: Card[];
    sensors: Sensor[];
    effects: Effect[];
    board: Board;
}

export interface Transition {
    node_index: NodeIndex | 'START';
    sensor_index: SensorIndex;
    next_node_index: NodeIndex | 'END';
}

export interface Graph {
    nodekit_version: string;
    nodes: Node[];
    transitions: Transition[];
}


export interface Trace {
    nodekit_version: string;
    events: Event[];
}