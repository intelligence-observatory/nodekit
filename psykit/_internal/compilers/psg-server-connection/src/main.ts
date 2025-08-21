type ISO8601 = string & { __brand: 'ISO8601' };
type EventCode = 'START' | 'REPORT' | 'UNLOAD' | 'END';

type Event = {
    event_code: EventCode,
    event_data?: string,
    event_timestamp: ISO8601,
}

type ServerResponse = {
    message?: string,
    redirect_url?: string,
}

type SendEventResult = {
    response: ServerResponse,
    status: number,
    ok: boolean,
}

type QueuedEvent = {
    event: Event,
    resolve: (result: SendEventResult) => void,
    reject: (error: Error) => void,
}


export class PsgServerConnection {
    private readonly connectionUrl: string;
    private readonly queue: QueuedEvent[] = [];
    private flushing = false;

    constructor(
        connectionUrl: string,
    ) {
        this.connectionUrl = connectionUrl
    }

    private async queueEvent(event: Event): Promise<SendEventResult> {
        return new Promise<SendEventResult>((resolve, reject) => {
            this.queue.push({event, resolve, reject});
            this._maybeFlushNext();
        });
    }

    private async sendEventCore(event: Event): Promise<SendEventResult> {
        let response = await fetch(
            this.connectionUrl,
            {
                method: 'POST',
                body: JSON.stringify(event),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        let postEventResponse: ServerResponse = {}
        if (response.ok) {
            // Check if the response is a valid JSON:
            if (!response.headers.get('content-type')?.includes('application/json')) {
                console.error('Response is not JSON:', response.headers.get('content-type'))
            } else {
                postEventResponse = await response.json() as ServerResponse
            }
        } else {
            console.error('Failed to post event:', response.status, response.statusText)
        }

        const sendEventResult = {
            'response': postEventResponse,
            'status': response.status,
            'ok': response.ok,
        }

        console.log('Sent:', event, 'Received:', sendEventResult);

        return sendEventResult
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

    async sendStartEvent(): Promise<SendEventResult> {
        return await this.queueEvent(
            {
                event_code: "START",
                event_timestamp: this.getTimestamp(),
            }
        )
    }

    async sendReportEvent(
        data: any,
    ): Promise<SendEventResult> {
        const reportEvent: Event = {
            event_code: 'REPORT',
            event_data: JSON.stringify(data),
            event_timestamp: this.getTimestamp(),
        }
        return new Promise<SendEventResult>((resolve, reject) => {
            this.queue.push({event: reportEvent, resolve, reject});
            this._maybeFlushNext();
        });
    }

    async sendEndEvent() {

        let result = await this.queueEvent(
            {
                event_code: 'END',
                event_timestamp: this.getTimestamp(),
            }
        )

        // Check if the response contains a redirect:
        if (result.response.redirect_url) {
            // Get the URL
            return result.response.redirect_url
        }
    }
}


// Manually attach the play function to the global window object, for testing purposes:
// This code snippet is unnecessary for production, but needed to use vite's development tools.
if (typeof window !== 'undefined') {
    (window as any).PsgServerConnection = PsgServerConnection;
}
