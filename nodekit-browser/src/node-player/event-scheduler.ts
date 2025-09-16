export type ScheduleToken = number;

interface ScheduleEventParameters {
    triggerTimeMsec: number, // Msec elapsed from .t0 when this Event should occur
    triggerFunc: () => void, // The function that is called when the event triggers
}

interface TimedEvent {
    triggerTimeMsec: number;  // Msec elapsed relative to .t0 when this event should trigger
    triggerFunc: () => void;
    token: ScheduleToken;
}

export class EventScheduler {
    private events: TimedEvent[] = [];
    private nextToken = 1;
    private running = false;
    private rafId: number | null = null;

    private t0: number = 0; // The `performance.now()` time when the scheduler was started; initialized in start()
    private abortSignal: AbortSignal;

    constructor(
        abortSignal: AbortSignal, // If the abortSignal is triggered, the scheduler stops
    ){
        this.abortSignal = abortSignal;

        // If the abortSignal is triggered, stop the scheduler:
        const abortHandler = () => {
            this.stop();
            this.abortSignal.removeEventListener('abort', abortHandler);
        };
        this.abortSignal.addEventListener('abort', abortHandler, { once: true });
    }

    scheduleEvent(
        parameters: ScheduleEventParameters
    ): void {

        const token = this.nextToken++;
        const ev: TimedEvent = {
            triggerTimeMsec: parameters.triggerTimeMsec,
            triggerFunc: parameters.triggerFunc,
            token,
        };

        // Insert Event in time-sorted order to this.events:
        const i = this.events.findIndex(e => e.triggerTimeMsec > ev.triggerTimeMsec);
        if (i === -1) {
            this.events.push(ev);
        } else {
            this.events.splice(i, 0, ev);
        }
    }

    start(): void {
        console.log('Called start?!')
        if (this.running) {
            return;
        }
        this.running = true;
        this.t0 = performance.now();
        this.loop(this.t0);
    }

    private stop(): void {
        if (!this.running) {
            return;
        }

        this.running = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    private loop = (timestamp: DOMHighResTimeStamp): void => {
        if (!this.running) {
            return;
        }

        const timeElapsedSinceStart = timestamp - this.t0;

        // Fire all events that are due *now*:
        while (this.events.length > 0 && this.events[0].triggerTimeMsec <= timeElapsedSinceStart) {
            const ev = this.events.shift()!;
            ev.triggerFunc();
        }

        // Keep ticking if anything remains:
        if (this.events.length > 0) {
            this.rafId = requestAnimationFrame(this.loop);
        } else {
            this.stop();
        }
    };
}