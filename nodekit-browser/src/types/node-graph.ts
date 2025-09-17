import type {Board} from "./board";
import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {Outcome} from "./outcomes";
import type {Effect} from "./effects/base.ts";

export type NodeId = string & { __brand: 'NodeId' };

export interface Node {
    node_id: NodeId;
    cards: Card[];
    sensors: Sensor[];
    outcomes: Outcome[];
    effects: Effect[];
}

export interface NodeGraph {
    board: Board;
    nodes: Node[];
    nodekit_version: string;
}