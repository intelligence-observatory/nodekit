import type {Board} from "./board";
import type {Card} from "./cards";
import type {Sensor} from "./sensors";
import type {Effect} from "./effects/base.ts";
import type {Event} from "./events";
//import type {Outcome} from "./outcomes";

export interface Node {
    cards: Card[];
    sensors: Sensor[];
    //outcomes: Outcome[];
    effects: Effect[];
    board: Board;
}

export interface Timeline {
    nodekit_version: string;
    nodes: Node[];
}

export interface Trace {
    nodekit_version: string;
    events: Event[];
}