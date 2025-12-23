import {OverlayBase} from "../overlay-base.ts";
import {UIElementBase} from "../../base.ts";
import "./session-start.css";

export class SessionStartedOverlay extends OverlayBase {
    startButton: StartButton;

    constructor() {
        super('session-started-overlay');

        // Create the submit button
        this.startButton = new StartButton();
        // Mount
        this.startButton.mount(this.content)
    }

    show(
        submitButtonClickedCallback: () => void
    ) {
        this.startButton.attachClickListener(submitButtonClickedCallback);
        this.setVisibility(true);
    }

    hide() {
        // Hide the overlay
        super.setVisibility(false);

        // Clear the event listener
        this.startButton.removeAllEventListeners()
    }

}


class StartButton extends UIElementBase {
    root: HTMLButtonElement;

    constructor() {
        super();

        const startButton = document.createElement("button");
        startButton.classList.add("start-button");
        startButton.textContent = "Press to Start";
        this.root = startButton;
    }

    attachClickListener(callback: () => void): void {
        this._registerEventListener(this.root, 'click', callback);
    }
}
