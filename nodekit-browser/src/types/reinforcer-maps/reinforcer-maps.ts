import type {Reinforcer} from "./reinforcers/reinforcers.ts";
import type {BaseReinforcerMap} from "./base.ts";
import type {NullParameters} from "../base.ts";

interface ConstantReinforcerMapParameters {
    reinforcer: Reinforcer
}

export interface ConstantReinforcerMap
    extends BaseReinforcerMap<'ConstantReinforcerMap', ConstantReinforcerMapParameters>{}

export interface NullReinforcerMap
    extends BaseReinforcerMap<'NullReinforcerMap', NullParameters>{}

export type ReinforcerMap = ConstantReinforcerMap | NullReinforcerMap;