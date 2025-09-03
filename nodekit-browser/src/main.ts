import type {
    Event,
    StartEvent,
    EndEvent,
    NodeResultEvent,
    NodeResult,
    UUID,
    ISO8601,
    SubmitEventResponse
} from "./types.ts";

type QueuedEvent = {
    event: Event,
    resolve: (result: SubmitEventResponse) => void,
    reject: (error: Error) => void,
    attempts: number,
}


export class EventClient {
    private connectionUrl: string;
    private runId: UUID;
    private queue: QueuedEvent[];
    private flushing;
    private maxRetries;

    constructor(
        runId: string,
        connectionUrl: string,
    ) {
        this.queue = [];
        this.flushing = false;
        this.maxRetries = 5;
        this.connectionUrl = connectionUrl
        this.runId = runId as UUID;

        // Basic validation:
        if (!this.connectionUrl) {
            throw new Error("connectionUrl is required");
        }
        if (!this.runId) {
            throw new Error("runId is required");
        }
    }

    private async queueEvent(event: Event): Promise<SubmitEventResponse> {
        /*
        Enqueues an event to be sent. Returns a promise that resolves when the event is sent (or fails).
         */
        return new Promise<SubmitEventResponse>(
            (resolve, reject) => {
                this.queue.push(
                    {
                        event: event,
                        resolve: resolve,
                        reject: reject,
                        attempts: 0,
                    }
                );
                this._maybeFlushNext();
            }
        );
    }

    private _maybeFlushNext() {
        // Flushes the next event in the queue if not already flushing. Once done, calls _maybeFlushNext again to continue processing the queue.
        if (this.flushing) {
            return;
        }

        const nextQueuedEvent = this.queue.shift();
        if (!nextQueuedEvent) {
            // No events left in the queue
            return;
        }

        // Start flushing:
        this.flushing = true;
        console.log(`Flushing event: ${nextQueuedEvent.event.event_type} (attempt ${nextQueuedEvent.attempts + 1})`);
        let postEventPromise = this._postEvent(nextQueuedEvent.event);

        // Handle the result of the post attempt:
        postEventPromise
            .then(result => {
                nextQueuedEvent.resolve(result)

                // Continue processing the queue:
                this.flushing = false;
                this._maybeFlushNext();
            })
            .catch(_err => {
                nextQueuedEvent.attempts += 1;
                if (nextQueuedEvent.attempts >= this.maxRetries) {
                    nextQueuedEvent.reject(new Error(`Retry limit exceeded after ${this.maxRetries} retries`,));
                } else {
                    const backoffTimeMsec = Math.pow(2, nextQueuedEvent.attempts) * 100;
                    setTimeout(
                        () => {
                            this.queue.unshift(nextQueuedEvent);
                            this.flushing = false;
                            this._maybeFlushNext();
                        },
                        backoffTimeMsec
                    );
                }
            })
    }

    private async _postEvent(event: Event): Promise<SubmitEventResponse> {
        /*
         This method posts an event to the server
         */

        // Set a timeout for the fetch request:
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        // Post the event:
        let response: Response;
        try {
            response = await fetch(
                this.connectionUrl,
                {
                    method: 'POST',
                    body: JSON.stringify(event),
                    headers: {'Content-Type': 'application/json'},
                    keepalive: true,
                    signal: controller.signal,
                }
            );
        } catch (error) {
            throw new Error(`Fetch error: ${error}`);
        } finally {
            clearTimeout(timeout);
        }

        // Process the server response:
        if (!response.ok) {
            throw new Error(`Protocol error: got bad response: ${response.status} ${response.statusText}`);
        }

        let postEventResponse: SubmitEventResponse;
        const ct = response.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            postEventResponse = await response.json() as SubmitEventResponse;
        } else {
            throw new Error(`Protocol error: expected Content-Type application/json: ${response.status} ${response.statusText}`);
        }
        return postEventResponse;
    }

    // Helper methods:
    private getEventId(): UUID {
        return crypto.randomUUID() as UUID;
    }

    private getTimestamp(): ISO8601 {
        // Get the current time in UTC (using system time for now):
        const now = new Date();
        return now.toISOString() as ISO8601;
    }

    // Public methods:
    async sendStartEvent(): Promise<SubmitEventResponse> {
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
    ): Promise<SubmitEventResponse> {
        const reportEvent: NodeResultEvent = {
            run_id: this.runId,
            event_id: this.getEventId(),
            event_type: 'NodeResultEvent',
            event_payload: nodeResult,
            event_timestamp: this.getTimestamp(),
        }
        return this.queueEvent(reportEvent);
    }

    async sendEndEvent(): Promise<SubmitEventResponse> {
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

