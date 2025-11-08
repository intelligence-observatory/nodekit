import type {PressableKey, SpatialPoint, TimeElapsedMsec} from "../common.ts";

export interface BaseEvent<T extends string> {
    event_type: T,
    t: TimeElapsedMsec, // The time the Event was emitted, relative to the start of the Trace
}

export interface TraceStartedEvent extends BaseEvent<'TraceStartedEvent'>{}
export interface TraceEndedEvent extends BaseEvent<'TraceEndedEvent'>{}
export interface PageSuspendedEvent extends BaseEvent<'PageSuspendedEvent'>{}
export interface PageResumedEvent extends BaseEvent<'PageResumedEvent'>{}
export interface BrowserContextSampledEvent extends BaseEvent<'BrowserContextSampledEvent'>{
    user_agent: string,
    viewport_width_px: number,
    viewport_height_px: number,
    display_width_px: number,
    display_height_px: number,
    device_pixel_ratio: number,
}

export interface PointerSampledEvent extends BaseEvent<'PointerSampledEvent'> {
    x: SpatialPoint,
    y: SpatialPoint,
    kind: 'down' | 'up' | 'move'
}

export interface KeySampledEvent extends BaseEvent<'KeySampledEvent'> {
    key: PressableKey
    kind: 'down' | 'up'
}


// Union type:
export type Event =
    TraceStartedEvent |
    BrowserContextSampledEvent |
    PageSuspendedEvent |
    PageResumedEvent |
    KeySampledEvent |
    PointerSampledEvent |
    TraceEndedEvent;
