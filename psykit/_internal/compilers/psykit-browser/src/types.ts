type ISO8601 = string & { __brand: 'ISO8601' };
export type UUID = string & { __brand: 'UUID' };


// NodeResult:
export type NodeResult = {
    node_id: UUID,
    timestamp_start: ISO8601,
    timestamp_end: ISO8601,
    node_execution_index: number, // 0 for first execution, 1 for second, etc.
    action: any, // todo flow from NodePlayer
    runtime_metrics: any
}

// Base event type
export type BaseEvent<T extends string, P> = {
    event_id: UUID
    run_id: UUID
    event_type: T,
    event_payload: P,
    event_timestamp: ISO8601,
}


export type StartEvent = BaseEvent<'StartEvent', {}>
export type EndEvent = BaseEvent<'EndEvent', {}>
export type NodeResultEvent = BaseEvent<'NodeResultEvent', NodeResult>

// Union of all event types
export type Event = StartEvent | EndEvent | NodeResultEvent;


// Server responses
export type SubmitEventResponse = {
    redirect_url: string | null;
}

