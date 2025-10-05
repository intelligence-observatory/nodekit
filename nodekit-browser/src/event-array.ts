import type {Event} from "./types/events";

export class EventArray {
    public events: Event[];
    private onEventCallback: (event: Event) => void;

    constructor(
        initialEvents: Event[],
        onEventCallback: ((event: Event) => void),
    ) {
        this.onEventCallback = onEventCallback;
        this.events = initialEvents;
    }

    push(event: Event) {
        this.events.push(event);
        this.onEventCallback(event);
    }
}