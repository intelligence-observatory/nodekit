import type {NodeId} from "../node-graph.ts";

export type ISO8601 = string & { __brand: 'ISO8601' };
export type UUID = string & { __brand: 'UUID' };

import type {MonetaryAmountUsd} from "../common.ts";
import type {Action} from "../actions";

// Base event type
export type BaseEvent<T extends string, P> = {
    event_id: UUID
    event_index: number, // Monotonically increasing index of the event in the session.
    event_timestamp: ISO8601,

    event_type: T,
    event_payload: P,

    nodekit_version: string
}

// NodeGraph start and end events:
export type StartEvent = BaseEvent<'StartEvent', {}>
export type EndEvent = BaseEvent<'EndEvent', {}>

// User engagement events:
export type LeaveEvent = BaseEvent<'LeaveEvent', {}>
export type ReturnEvent = BaseEvent<'ReturnEvent', {}>

// NodeResultEvent:
export type NodeResultEvent = BaseEvent<
    'NodeResultEvent',
    {
        node_id: NodeId,
        timestamp_start: ISO8601,
        timestamp_end: ISO8601,
        action: Action,
    }
>

// BonusDisclosureEvent:
export type BonusDisclosureEvent = BaseEvent<'BonusDisclosureEvent', { bonus_amount_usd: MonetaryAmountUsd }>


// BrowserContextEvent:
export interface BrowserContext {
    user_agent: string,
    viewport_width_px: number,
    viewport_height_px: number,
    display_width_px: number,
    display_height_px: number
}

export type BrowserContextEvent = BaseEvent<'BrowserContextEvent', BrowserContext>

// Union type:
export type Event = StartEvent | EndEvent | NodeResultEvent | LeaveEvent | ReturnEvent | BonusDisclosureEvent | BrowserContextEvent;
