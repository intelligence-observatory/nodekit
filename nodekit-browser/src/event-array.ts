import type {Event, UnindexedEvent} from "./types/events";

export class EventArray {
    public events: Event[];
    private onEventCallback: (event: Event) => void;

    constructor(
        onEventCallback: ((event: Event) => void),
    ) {
        this.onEventCallback = onEventCallback;
        this.events = [];
    }

    push(event: UnindexedEvent) {
        const indexedEvent = {
            ...event,
            event_index: this.events.length,
        } as Event;
        this.events.push(indexedEvent);
        this.onEventCallback(indexedEvent);
    }
}
