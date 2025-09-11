import type {NodeId} from "../node-graph.ts";
import type {MonetaryAmountUsd} from "../common.ts";
import type {Action} from "../actions";
import type {BrowserContext} from "../../user-gates/browser-context.ts";

export type ISO8601 = string & { __brand: 'ISO8601' };
export type UUID = string & { __brand: 'UUID' };

// Base Event:
export type BaseEvent<T extends string, P> = {
    event_id: UUID
    timestamp_event: ISO8601,

    event_type: T,
    event_payload: P,

    nodekit_version: string
}

// Concrete Event types:
export type StartEvent = BaseEvent<'StartEvent', {}>
export type EndEvent = BaseEvent<'EndEvent', {}>
export type LeaveEvent = BaseEvent<'LeaveEvent', {}>
export type ReturnEvent = BaseEvent<'ReturnEvent', {}>
export type BrowserContextEvent = BaseEvent<'BrowserContextEvent', BrowserContext>
export type NodeResultEvent = BaseEvent<
    'NodeResultEvent',
    {
        node_id: NodeId,
        timestamp_node_start: ISO8601,
        timestamp_node_end: ISO8601,
        action: Action,
    }
>
export type BonusDisclosureEvent = BaseEvent<
    'BonusDisclosureEvent',
    { bonus_amount_usd: MonetaryAmountUsd }
>


// Union:
export type Event =
    StartEvent |
    EndEvent |
    NodeResultEvent |
    LeaveEvent |
    ReturnEvent |
    BonusDisclosureEvent |
    BrowserContextEvent;
