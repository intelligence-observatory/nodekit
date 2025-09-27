type KeySampleType = 'down' | 'up';
type PressableKey = string;

export interface KeySample {
    sampleType: KeySampleType
    key: PressableKey; // Using string for simplicity; could be more specific
    domTimestamp: DOMHighResTimeStamp
}

export class KeyStream {
    private listeners: ((sample: KeySample) => void)[] = [];

    constructor() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        const sample: KeySample = {
            sampleType: 'down',
            key: event.key,
            domTimestamp: event.timeStamp
        };
        this.emit(sample);
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        const sample: KeySample = {
            sampleType: 'up',
            key: event.key,
            domTimestamp: event.timeStamp
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