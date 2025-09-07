
import type {NullParameters} from "../common.ts";
import type {Card} from "../cards/cards.ts";
import type {SensorId} from "../common.ts";

export interface BaseReinforcerMap<T extends string, P> {
    reinforcer_map_type: T,
    reinforcer_map_parameters: P,
    sensor_id: SensorId
}

export interface Reinforcer {
    // Configures stimulus delivery in Reinforcement phase:
    reinforcer_cards: Card[],
}

interface ConstantReinforcerMapParameters {
    reinforcer: Reinforcer
}

export interface ConstantReinforcerMap
    extends BaseReinforcerMap<'ConstantReinforcerMap', ConstantReinforcerMapParameters>{}

export interface NullReinforcerMap
    extends BaseReinforcerMap<'NullReinforcerMap', NullParameters>{}

export type ReinforcerMap = ConstantReinforcerMap | NullReinforcerMap;