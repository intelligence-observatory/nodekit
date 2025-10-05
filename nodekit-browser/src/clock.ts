import type {TimeElapsedMsec} from "./types/common.ts";

export class Clock {
    private startTime: DOMHighResTimeStamp | null = null;

    start(): void {
        this.startTime = performance.now();
    }

    now(): TimeElapsedMsec {
        if (this.startTime === null) {
            throw new Error("Clock has not been started. Call start() before calling convertToTimeElapsedMsec().");
        }
        let delta = performance.now() - this.startTime;

        // Round to integer milliseconds:
        delta = Math.round(delta);
        return delta as TimeElapsedMsec;
    }

    checkClockStarted(): boolean {
        return this.startTime !== null;
    }
}
