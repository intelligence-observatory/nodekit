import type {TimeElapsedMsec} from "./types/common.ts";

export class Clock {
    private startTime: DOMHighResTimeStamp | null = null;


    start(): void {
        this.startTime = performance.now();
    }

    now(): TimeElapsedMsec {
        return this.convertDomTimestampToClockTime(performance.now());
    }

    /**
     * Convert a DOMHighResTimeStamp from performance.now() to TimeElapsedMsec since the clock was started.
     * @throws Error if the clock has not been started.
     * @param t
     */
    convertDomTimestampToClockTime(t: DOMHighResTimeStamp): TimeElapsedMsec {
        if (this.startTime === null) {
            throw new Error("Clock has not been started. Call start() before calling convertToTimeElapsedMsec().");
        }
        let delta = t - this.startTime;
        // Round to integer milliseconds:
        delta = Math.round(delta);
        return delta as TimeElapsedMsec;
    }

    checkStarted(): boolean {
        return this.startTime !== null;
    }
}
