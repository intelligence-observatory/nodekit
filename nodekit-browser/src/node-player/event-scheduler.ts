interface ScheduleEventParameters {
    triggerTimeMsec: number, // Msec elapsed from .t0 when this Event should occur
    triggerFunc: () => void, // The function that is called when the event triggers
}

interface TimedEvent {
    triggerTimeMsec: number;  // Msec elapsed relative to .t0 when this event should trigger
    triggerFunc: () => void;
}

type EventSchedulerState = 'OPEN' | 'RUNNING' | 'CLOSED';

export class EventScheduler {
    private events: TimedEvent[] = [];
    private rafId: number | null = null;

    private t0: number = 0; // The `performance.now()` time when the scheduler was started; initialized in start()

    private state : EventSchedulerState = 'OPEN';

    // Teardown:
    private onStopQueue: (() => void)[] = [];


    scheduleEvent(
        parameters: ScheduleEventParameters
    ): void {
        if (this.state !== 'OPEN') {
            throw new Error(`Cannot schedule event; scheduler state is ${this.state}`);
        }

        const ev: TimedEvent = {
            triggerTimeMsec: parameters.triggerTimeMsec,
            triggerFunc: parameters.triggerFunc,
        };

        // Insert Event in time-sorted order to this.events:
        const i = this.events.findIndex(e => e.triggerTimeMsec > ev.triggerTimeMsec);
        if (i === -1) {
            this.events.push(ev);
        } else {
            this.events.splice(i, 0, ev);
        }
    }

    scheduleOnStop(onStopCallback: () => void): void {
        if (this.state !== 'OPEN') {
            throw new Error(`Cannot schedule onStop callback; scheduler state is ${this.state}`);
        }
        // FIFO order
        this.onStopQueue.push(onStopCallback);
    }

    start(): void {
        if (this.state !== 'OPEN') {
            return;
        }
        // Transition from OPEN to RUNNING:
        this.state = 'RUNNING';
        this.t0 = performance.now();
        this.loop(this.t0);
    }

    stop(): void {
        if (this.state !== 'RUNNING') {
            return;
        }
        // Transition from RUNNING to CLOSED:
        this.state = 'CLOSED';

        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        // Run any onStop callbacks:
        console.log(`EventScheduler: running ${this.onStopQueue.length} onStop callbacks`);
        while (this.onStopQueue.length > 0) {
            const cb = this.onStopQueue.shift()!;
            cb();
        }
    }

    private loop = (timestamp: DOMHighResTimeStamp): void => {
        if (this.state !== 'RUNNING') {
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
        }
    };
}