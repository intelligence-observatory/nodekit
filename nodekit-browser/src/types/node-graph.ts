import type {BonusRule} from "./bonus_rules/bonus_policy.ts";
import type {Board} from "./board";
import type {Card} from "./cards/cards.ts";
import type {Sensor} from "./sensors/sensors.ts";
import type {ReinforcerMap} from "./reinforcer-maps/reinforcer-maps.ts";
import type {Effect} from "./effects/base.ts";


export type NodeId = string & { __brand: 'NodeId' };

export interface Node {
    node_id: NodeId;
    board: Board;
    cards: Card[];
    sensors: Sensor[];
    reinforcer_maps: ReinforcerMap[];
    effects: Effect[];
}

export interface NodeGraph {
    nodes: Node[];
    bonus_rules: BonusRule[];
    nodekit_version: string;
}