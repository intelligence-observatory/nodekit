import type {NodeTimePointMsec} from "../common.ts";

export interface BaseEffect<T extends string>{
    effect_type: T;
    start_msec: NodeTimePointMsec;
    end_msec: NodeTimePointMsec | null
}

export interface HidePointerEffect extends BaseEffect<'HidePointerEffect'> {
    end_msec: NodeTimePointMsec; // Must have an end time.
}

// Union type for all effects
export type Effect = HidePointerEffect;