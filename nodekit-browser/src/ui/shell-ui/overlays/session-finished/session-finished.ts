import {OverlayBase} from "../overlay-base.ts";

export class SessionFinishedOverlay extends OverlayBase {

    submitButton: HTMLButtonElement;

    constructor() {
        super('session-finished-overlay');

        // Create the submit button
        this.submitButton = document.createElement("button");
        this.submitButton.textContent = "Submit ↑";
        // Mount
        this.root.appendChild(this.submitButton);
    }

    show(
        submitButtonClickedCallback: () => void
    ) {
        this.submitButton.onclick = submitButtonClickedCallback;
        this.setVisibility(true);
    }

    hide() {
        // Hide the overlay
        super.setVisibility(false);

        // Clear the event listener
        this.submitButton.onclick = null;
    }
}

