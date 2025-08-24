type ISO8601 = string & { __brand: 'ISO8601' };

import type {
    Event,
    StartEvent,
    EndEvent,
    NodeResultEvent,
    NodeResult,
    SubmitEventResponse,
    UUID
} from "./types.ts";

type SendEventResult = {
    response: SubmitEventResponse | null,
    status: number,
    ok: boolean,
}

type QueuedEvent = {
    event: Event,
    resolve: (result: SendEventResult) => void,
    reject: (error: Error) => void,
}


export class EventClient {
    private readonly connectionUrl: string;
    private readonly queue: QueuedEvent[] = [];
    private flushing = false;
    private runId: UUID;

    constructor(
        runId: string,
        connectionUrl: string,
    ) {
        this.connectionUrl = connectionUrl
        this.runId = runId as UUID;
    }

    private async queueEvent(event: Event): Promise<SendEventResult> {
        return new Promise<SendEventResult>((resolve, reject) => {
            this.queue.push({event, resolve, reject});
            this._maybeFlushNext();
        });
    }

    private async sendEventCore(event: Event): Promise<SendEventResult> {
        const controller = new AbortController();
        const response = await fetch(this.connectionUrl, {
            method: 'POST',
            body: JSON.stringify(event),
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout?.(8000) ?? controller.signal, // fallback if needed
            keepalive: true, // helps on unload
        });

        let postEventResponse: SubmitEventResponse | null = null;
        if (response.ok) {
            const ct = response.headers.get('content-type') || '';
            if (response.status !== 204 && ct.includes('application/json')) {
                postEventResponse = await response.json() as SubmitEventResponse;
            }
        } else {
            console.error('Failed to post event:', response.status, response.statusText);
        }

        return {
            response: postEventResponse,
            status: response.status,
            ok: response.ok,
        };
    }

    private getTimestamp(): ISO8601 {
        // Get the current time in UTC (using system time for now):
        const now = new Date();
        return now.toISOString() as ISO8601;
    }

    private _maybeFlushNext() {
        // Flushes the next event in the queue if not already flushing. Once done, calls _maybeFlushNext again to continue processing the queue.
        if (this.flushing) return;

        const next = this.queue.shift();
        if (!next) return; // No more events to process

        this.flushing = true;
        this.sendEventCore(next.event)
            .then(result => {
                if (!result.ok) {
                    // Requeue if an error occurred
                    this.queue.unshift(next);
                } else {
                    next.resolve(result)
                }
            })
            .catch(err => {
                console.warn("Fetch error, requeuing:", err);
                this.queue.unshift(next);
            })
            .finally(() => {
                    this.flushing = false;
                    this._maybeFlushNext(); // Continue processing the queue
                }
            )
    }

    private getEventId(): UUID{
        return crypto.randomUUID() as UUID;
    }

    async sendStartEvent(): Promise<SendEventResult> {
        let startEvent: StartEvent = {
            run_id: this.runId,
            event_id: this.getEventId(),
            event_type: 'StartEvent',
            event_payload: {},
            event_timestamp: this.getTimestamp(),
        }
        return this.queueEvent(startEvent)
    }

    async sendNodeResultEvent(
        nodeResult: NodeResult,
    ): Promise<SendEventResult> {
        const reportEvent: NodeResultEvent = {
            run_id: this.runId,
            event_id: this.getEventId(),
            event_type: 'NodeResultEvent',
            event_payload: nodeResult,
            event_timestamp: this.getTimestamp(),
        }
        return this.queueEvent(reportEvent);
    }

    async sendEndEvent():Promise<SendEventResult> {

        let endEvent: EndEvent = {
            run_id: this.runId,
            event_id: this.getEventId(),
            event_type: 'EndEvent',
            event_payload: {},
            event_timestamp: this.getTimestamp(),
        }
        return this.queueEvent(endEvent)
    }
}


// Manually attach the play function to the global window object, for testing purposes:
// This code snippet is unnecessary for production, but needed to use vite's development tools.
if (typeof window !== 'undefined') {
    (window as any).EventClient = EventClient;
}
