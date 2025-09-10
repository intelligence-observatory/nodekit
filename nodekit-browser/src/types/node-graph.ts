import type {Board} from "./board";
import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {Consequence} from "./consequences";
import type {Effect} from "./effects/base.ts";


export type NodeId = string & { __brand: 'NodeId' };

export interface Node {
    node_id: NodeId;
    cards: Card[];
    sensors: Sensor[];
    consequences: Consequence[];
    effects: Effect[];
}

export interface NodeGraph {
    board: Board;
    nodes: Node[];
    nodekit_version: string;
}