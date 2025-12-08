import type {Event} from "./types/events";

export class EventArray {
    public events: Event[];
    private onEventCallback: (event: Event) => void;

    constructor(
        onEventCallback: ((event: Event) => void),
    ) {
        this.onEventCallback = onEventCallback;
        this.events = [];
    }

    push(event: Event) {
        this.events.push(event);
        this.onEventCallback(event);
    }
}