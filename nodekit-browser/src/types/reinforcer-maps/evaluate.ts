import type {ReinforcerMap} from "./reinforcer-maps.ts";
import type {Action} from "../sensors/actions/actions.ts";
import type {Reinforcer} from "./reinforcers/reinforcers.ts";

export function evaluateReinforcerMap(reinforcerMap: ReinforcerMap, _action:Action): Reinforcer {

    switch (reinforcerMap.reinforcer_map_type){
        case "ConstantReinforcerMap":
            return reinforcerMap.reinforcer_map_parameters.reinforcer;
        case "NullReinforcerMap":
            return makeNullReinforcer();
        default:
            const _never: never = reinforcerMap;
            throw new Error(`Unknown reinforcer map type: ${_never}`);
    }
}

export function makeNullReinforcer(): Reinforcer{
    return {
        reinforcer_cards: []
    };
}