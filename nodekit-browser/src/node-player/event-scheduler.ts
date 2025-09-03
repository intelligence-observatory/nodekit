/*
Contract
 */
export type ScheduleToken = number;
interface ScheduleEventParams {
    offsetMsec: number,
    triggerEventFunc: () => void,
    signal?: AbortSignal
}
export interface EventScheduler {
    /** Schedule a callback `cb` to run `offsetMs` after `start()`. */
    scheduleEvent(
        parameters: ScheduleEventParams
    ): ScheduleToken;

    /** Cancel a previously scheduled Event. */
    cancel(token: ScheduleToken): void;

    /** Remove *all* pending callbacks and stop the timing loop. */
    clearAll(): void;

    /** Start the timing loop (idempotent). */
    start(): void;

    /** Stop the timing loop (idempotent). Pending Events are dropped. */
    stop(): void;
}

/*
RAF-based implementation
 */
interface TimedEvent {
    due: number;              // absolute timestamp, relative to start() timestamp
    cb: () => void;
    token: ScheduleToken;
    cancelled: boolean;
}

export class RAFScheduler implements EventScheduler {
    private events: TimedEvent[] = [];
    private nextToken = 1;
    private running = false;
    private rafId: number | null = null;
    private t0 = 0;           // time at start()

    /* --- EventScheduler API --- */
    start(): void {
        if (this.running) return;
        this.running = true;
        this.t0 = performance.now();
        this.loop();            // kick-off
    }

    stop(): void {
        if (!this.running) return;
        this.running = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    scheduleEvent(
        parameters: ScheduleEventParams
    ): ScheduleToken {
        if (!this.running) this.start();

        const token = this.nextToken++;
        const ev: TimedEvent = {
            due: this.t0 + parameters.offsetMsec,
            cb: parameters.triggerEventFunc,
            token,
            cancelled: false
        };
        this.insertEvent(ev);

        /* Optional cancellation via AbortSignal */
        const signal = parameters.signal;
        if (signal) {
            const abortHandler = () => {
                this.cancel(token);
                signal.removeEventListener('abort', abortHandler);
            };
            signal.addEventListener('abort', abortHandler, { once: true });
        }
        return token;
    }

    cancel(token: ScheduleToken): void {
        const idx = this.events.findIndex(e => e.token === token);
        if (idx !== -1) this.events[idx].cancelled = true;
    }

    clearAll(): void {
        this.events = [];
    }

    /* --- Internal loop --- */
    private loop = (): void => {
        if (!this.running) return;

        const now = performance.now();

        // Fire all events that are due *now*
        while (this.events.length && this.events[0].due <= now) {
            const ev = this.events.shift()!;
            if (!ev.cancelled) {
                ev.cb();
            }
        }

        // Keep ticking if anything remains
        if (this.events.length) {
            this.rafId = requestAnimationFrame(this.loop);
        } else {
            this.stop();          // auto-stop when empty (optional)
        }
    };

    /* --- Helpers --- */

    /** Maintain events sorted by `due` (O(N) insert; sufficient for small queues). */
    private insertEvent(ev: TimedEvent): void {
        const i = this.events.findIndex(e => e.due > ev.due);
        if (i === -1) {
            this.events.push(ev);
        } else {
            this.events.splice(i, 0, ev);
        }
    }
}