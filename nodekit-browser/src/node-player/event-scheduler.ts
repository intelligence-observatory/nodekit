export type ScheduleToken = number;

interface ScheduleEventParameters {
    triggerTimeMsec: number, // Msec elapsed from .t0 when this Event should occur
    triggerFunc: () => void, // The function that is called when the event triggers
    signal?: AbortSignal // Optional AbortSignal to allow cancellation of this event, if emitted
}

interface TimedEvent {
    triggerTimeMsec: number;  // Msec elapsed relative to .t0 when this event should trigger
    triggerFunc: () => void;
    token: ScheduleToken;
    cancelled: boolean;
}

export class EventScheduler {
    private events: TimedEvent[] = [];
    private nextToken = 1;
    private running = false;
    private rafId: number | null = null;

    private t0: number = 0; // The `performance.now()` time when the scheduler was started; initialized in start()

    scheduleEvent(
        parameters: ScheduleEventParameters
    ): void {
        if (!this.running) this.start();

        const token = this.nextToken++;
        const ev: TimedEvent = {
            triggerTimeMsec: parameters.triggerTimeMsec,
            triggerFunc: parameters.triggerFunc,
            token,
            cancelled: false
        };
        this.insertEvent(ev);

        /* Optional cancellation via AbortSignal */
        const signal = parameters.signal;
        if (signal) {
            const abortHandler = () => {
                ev.cancelled = true;
                signal.removeEventListener('abort', abortHandler);
            };
            signal.addEventListener('abort', abortHandler, { once: true });
        }
    }

    start(): void {
        if (this.running) {
            return;
        }
        this.running = true;
        this.t0 = performance.now();
        this.loop();
    }

    stop(): void {
        if (!this.running) {
            return;
        }

        this.running = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    clearAll(): void {
        this.events = [];
    }

    private loop = (): void => {
        if (!this.running) {
            return;
        }

        const now = performance.now();

        // Fire all events that are due *now*
        while (this.events.length && this.events[0].triggerTimeMsec <= now) {
            const ev = this.events.shift()!;
            if (!ev.cancelled) {
                ev.triggerFunc();
            }
        }

        // Keep ticking if anything remains
        if (this.events.length) {
            this.rafId = requestAnimationFrame(this.loop);
        } else {
            this.stop();          // auto-stop when empty (optional)
        }
    };

    private insertEvent(ev: TimedEvent): void {
        const i = this.events.findIndex(e => e.triggerTimeMsec > ev.triggerTimeMsec);
        if (i === -1) {
            this.events.push(ev);
        } else {
            this.events.splice(i, 0, ev);
        }
    }
}