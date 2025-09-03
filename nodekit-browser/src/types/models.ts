import type {ISO8601} from "./fields.ts";
import type {Card} from "./cards/cards.ts";
import type {Sensor} from "./sensors/sensors.ts";
import type {Board} from "./board.ts";
import type {Action} from "./sensors/actions/actions.ts";
import type {RuntimeMetrics} from "./runtime-metrics.ts";
import type {ReinforcerMap} from "./reinforcer-maps/reinforcer-maps.ts";
import type {Effect} from "./effects/base.ts";


export interface NodeParameters {
    board: Board;
    cards: Card[];
    sensors: Sensor[];
    reinforcer_maps: ReinforcerMap[];
    effects: Effect[];
}

export interface NodeMeasurements {
    timestamp_node_started: ISO8601;
    timestamp_node_completed: ISO8601;
    action: Action;
    runtime_metrics: RuntimeMetrics;
}
