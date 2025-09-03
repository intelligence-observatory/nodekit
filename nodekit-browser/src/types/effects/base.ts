import type {Timespan} from "../fields.ts";
import type {NullParameters} from "../base.ts";

export interface BaseEffect<T extends string, P>{
    effect_type: T;
    effect_parameters: P;
    effect_timespan: Timespan;
}

export interface HidePointerEffect extends BaseEffect<'HidePointerEffect', NullParameters> {}

// Union type for all effects
export type Effect = HidePointerEffect;