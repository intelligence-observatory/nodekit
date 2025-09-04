import type {CommandMessage, Event} from "./events.ts";

type QueuedEvent = {
    event: Event,
    resolve: () => void,
    reject: (error: Error) => void,
    attempts: number,
}

export class EventClient {
    private connectionUrl: string;
    private queue: QueuedEvent[];
    private flushing;
    private maxRetries;

    constructor(
        connectionUrl: string,
    ) {
        this.queue = [];
        this.flushing = false;
        this.maxRetries = 5;
        this.connectionUrl = connectionUrl

        // Basic validation:
        if (!this.connectionUrl) {
            throw new Error("connectionUrl is required");
        }
    }

    public async sendEvent(event: Event): Promise<void> {
        /*
        Enqueues an event to be sent. Returns a promise that resolves when the event is sent (or fails).
         */
        return new Promise<void>(
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
        let postEventPromise = this._postEvent(nextQueuedEvent.event);

        // Handle the result of the post attempt:
        postEventPromise
            .then(() => {
                console.log(`Posted ${nextQueuedEvent.event.event_type} on attempt ${nextQueuedEvent.attempts + 1}`);
                nextQueuedEvent.resolve()

                // Continue processing the queue:
                this.flushing = false;
                this._maybeFlushNext();
            })
            .catch(_err => {
                console.log(`Failed to post ${nextQueuedEvent.event.event_type} on attempt ${nextQueuedEvent.attempts + 1}: ${_err}`);
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

    private async _postEvent(event: Event): Promise<void> {
        /*
         This method posts a single event to the Server.
         If the post is successful, the server is expected to return a 2xx response.
         */

        // Post the event:
        let response =await postJsonMessage(
            JSON.stringify(event),
            this.connectionUrl,
        )

        // Process the server response:
        if (!response.ok) {
            throw new Error(`Got bad response from server: ${response.status} ${response.statusText}`);
        }
    }
}

async function postJsonMessage(
    stringifiedJson: string,
    url: string,
): Promise<Response>{

    // Set a timeout for the fetch request:
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Abort after 5 seconds

    // Post the event:
    let response: Response;
    try {
        response = await fetch(
            url,
            {
                method: 'POST',
                body: stringifiedJson,
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
    return response;
}

export class CommandClient {
    // The ControlClient polls the server for command messages (e.g. to redirect to a webpage).
    private connectionUrl: string;

    constructor(
        connectionUrl: string,
    ) {
        this.connectionUrl = connectionUrl
        // Basic validation:
        if (!this.connectionUrl) {
            throw new Error("connectionUrl is required");
        }
    }

    public async fetchCommand(): Promise<CommandMessage> {
        // Fetches a command message from the server.
        let response = await postJsonMessage('{}', this.connectionUrl);
        if (!response.ok) {
            throw new Error(`Got bad response from server: ${response.status} ${response.statusText}`);
        }

        // Parse the response JSON into a CommandMessage:
        let commandMessage: CommandMessage;
        const ct = response.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            commandMessage = await response.json() as CommandMessage;
        } else {
            throw new Error(`Protocol error: expected Content-Type application/json: ${response.status} ${response.statusText}`);
        }

        return commandMessage;
    }
}