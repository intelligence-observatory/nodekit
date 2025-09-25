import type {Board} from "./board";
import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {Effect} from "./effects/base.ts";
import type {Event} from "./events";
import type {NodeId, SensorId} from "./common.ts";

export interface Node {
    cards: Card[];
    sensors: Record<SensorId, Sensor>;
    effects: Effect[];
    board: Board;
}


export interface Graph {
    nodekit_version: string;
    nodes: Record<NodeId, Node>;
    transitions: Record<NodeId, Record<SensorId, NodeId>>;
    start: NodeId;
}

export interface Trace {
    nodekit_version: string;
    events: Event[];
}