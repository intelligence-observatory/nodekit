import type {Board} from "./board";
import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {Effect} from "./effects/base.ts";
import type {Event} from "./events";

export interface Node {
    cards: Card[];
    sensors: Sensor[];
    effects: Effect[];
    board: Board;
}

export interface Timeline {
    nodes: Node[];
    nodekit_version: string;
}

export interface Trace {
    events: Event[];
    nodekit_version: string;
}