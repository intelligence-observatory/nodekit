import {OverlayBase} from "../overlay-base.ts";
import "./session-start.css";

export class SessionStartedOverlay extends OverlayBase {

    startButton: HTMLButtonElement;

    constructor() {
        super('session-started-overlay');

        // Create the submit button
        this.startButton = document.createElement("button");
        this.startButton.classList.add("start-button");
        this.startButton.textContent = "Press to Start";

        // Mount
        this.root.appendChild(this.startButton);
    }

    show(
        submitButtonClickedCallback: () => void
    ) {
        this.startButton.onclick = submitButtonClickedCallback;
        this.setVisibility(true);
    }

    hide() {
        // Hide the overlay
        super.setVisibility(false);

        // Clear the event listener
        this.startButton.onclick = null;
    }

}

