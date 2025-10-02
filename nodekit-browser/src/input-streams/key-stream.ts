import type {Clock} from "../clock.ts";

type KeySampleType = 'down' | 'up';
import type {PressableKey, TimeElapsedMsec} from "../types/common.ts";

export interface KeySample {
    sampleType: KeySampleType
    key: PressableKey; // Using string for simplicity; could be more specific
    t: TimeElapsedMsec
}

export class KeyStream {
    private listeners: ((sample: KeySample) => void)[] = [];

    private holdingKeys: Set<PressableKey> = new Set();
    private clock: Clock

    constructor(
        clock: Clock
    ) {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);

        // Add a listener to reset holdingKeys when the window loses focus
        window.addEventListener('blur', () => {
            this.holdingKeys.clear();
        });

        this.clock = clock;
    }

    private handleKeyDown = (event: KeyboardEvent) => {

        // Short circuit if clock has not started
        if (!this.clock.checkStarted()) {
            return;
        }

        // Short circuit if it's a repeat event and we already have a keydown for this key:
        if (this.holdingKeys.has(event.key as PressableKey) && event.repeat) {
            return;
        }

        // Mark this key as being held down:
        this.holdingKeys.add(event.key as PressableKey);

        const sample: KeySample = {
            sampleType: 'down',
            key: event.key,
            t: this.clock.now()
        };
        this.emit(sample);
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        // Short circuit if clock has not started
        if (!this.clock.checkStarted()) {
            return;
        }
        // Mark this key as no longer being held down:
        this.holdingKeys.delete(event.key as PressableKey);

        const sample: KeySample = {
            sampleType: 'up',
            key: event.key,
            t: this.clock.now()
        };
        this.emit(sample);
    };

    private emit(sample: KeySample) {
        for (const listener of this.listeners) {
            listener(sample);
        }
    }

    public subscribe(callback: (sample: KeySample) => void): () => void {
        // Returns an unsubscribe function
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    public destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.listeners = [];
    }
}