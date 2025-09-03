export declare class EventClient {
    private connectionUrl;
    private runId;
    private queue;
    private flushing;
    private maxRetries;
    constructor(runId: string, connectionUrl: string);
    private queueEvent;
    private _maybeFlushNext;
    private _postEvent;
    private getEventId;
    private getTimestamp;
    sendStartEvent(): Promise<SubmitEventResponse>;
    sendNodeResultEvent(nodeResult: NodeResult): Promise<SubmitEventResponse>;
    sendEndEvent(): Promise<SubmitEventResponse>;
}

declare type ISO8601 = string & {
    __brand: 'ISO8601';
};

declare type NodeResult = {
    node_id: UUID;
    timestamp_start: ISO8601;
    timestamp_end: ISO8601;
    node_execution_index: number;
    action: any;
    runtime_metrics: any;
};

declare type SubmitEventResponse = {
    redirect_url: string | null;
};

declare type UUID = string & {
    __brand: 'UUID';
};

export { }
