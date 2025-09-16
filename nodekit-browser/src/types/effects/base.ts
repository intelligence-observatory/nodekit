import type {TimePointMsec} from "../common.ts";

export interface BaseEffect<T extends string>{
    effect_type: T;
    t_start: TimePointMsec;
    t_end: TimePointMsec | null
}

export interface HidePointerEffect extends BaseEffect<'HidePointerEffect'> {
    t_end: TimePointMsec; // Must have an end time.
}

// Union type for all effects
export type Effect = HidePointerEffect;