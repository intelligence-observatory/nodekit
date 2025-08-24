import type {
    Event,
    StartEvent,
    EndEvent,
    NodeResultEvent,
    NodeResult,
    SubmitEventResponse,
    UUID,
    ISO8601
} from "./types.ts";

type SendEventResult = {
    response: SubmitEventResponse | null,
    status: number,
    ok: boolean,
}

export class EventClient {
    private readonly connectionUrl: string;
    private readonly runId: UUID;

    constructor(
        runId: string,
        connectionUrl: string,
    ) {
        this.connectionUrl = connectionUrl
        this.runId = runId as UUID;
    }

    private async postEventCore(event: Event): Promise<SendEventResult> {
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
        return {
            response: postEventResponse,
            status: response.status,
            ok: response.ok,
        };
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
    async sendStartEvent(): Promise<SendEventResult> {
        let startEvent: StartEvent = {
            run_id: this.runId,
            event_id: this.getEventId(),
            event_type: 'StartEvent',
            event_payload: {},
            event_timestamp: this.getTimestamp(),
        }
        console.log('start event', startEvent)
        return this.postEventCore(startEvent)
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
        console.log('start event', reportEvent)
        return this.postEventCore(reportEvent);
    }

    async sendEndEvent(): Promise<SendEventResult> {
        let endEvent: EndEvent = {
            run_id: this.runId,
            event_id: this.getEventId(),
            event_type: 'EndEvent',
            event_payload: {},
            event_timestamp: this.getTimestamp(),
        }
        console.log('end event', endEvent)
        return this.postEventCore(endEvent)
    }
}


// Manually attach the play function to the global window object, for testing purposes:
// This code snippet is unnecessary for production, but needed to use vite's development tools.
if (typeof window !== 'undefined') {
    (window as any).EventClient = EventClient;
}
