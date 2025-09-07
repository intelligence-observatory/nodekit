import type {NodeId} from "../node-graph.ts";
export type ISO8601 = string & { __brand: 'ISO8601' };
export type UUID = string & { __brand: 'UUID' };

import type {MonetaryAmountUsd} from "../common.ts";
import type {Action} from "../actions";
import type {RuntimeMetrics} from "./runtime-metrics.ts";

// NodeResult:
export type NodeResult = {
    node_id: NodeId,
    timestamp_start: ISO8601,
    timestamp_end: ISO8601,
    node_execution_index: number, // 0 for first execution, 1 for second, etc.
    action: Action,
    runtime_metrics: RuntimeMetrics
}

// Base event type
export type BaseEvent<T extends string, P> = {
    event_id: UUID
    event_type: T,
    event_payload: P,
    event_timestamp: ISO8601,
}

// Concrete event types:
export type StartEvent = BaseEvent<'StartEvent', {}>
export type EndEvent = BaseEvent<'EndEvent', {}>
export type LeaveEvent = BaseEvent<'LeaveEvent', {}>
export type ReturnEvent = BaseEvent<'ReturnEvent', {}>
export type NodeResultEvent = BaseEvent<'NodeResultEvent', NodeResult>
export type BonusDisclosureEvent = BaseEvent<'BonusDisclosureEvent', { bonus_amount_usd: MonetaryAmountUsd }>

// Union type:
export type Event = StartEvent | EndEvent | NodeResultEvent | LeaveEvent | ReturnEvent | BonusDisclosureEvent;
