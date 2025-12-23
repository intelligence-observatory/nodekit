import {OverlayBase} from "../overlay-base.ts";
import "./session-finished.css";

export class SessionFinishedOverlay extends OverlayBase {

    messageBox: HTMLDivElement;
    messageSpan: HTMLSpanElement;
    submitButton: HTMLButtonElement;

    constructor() {
        super('session-finished-overlay');

        // Create the submit button
        this.submitButton = document.createElement("button");
        this.submitButton.classList.add("submit-button");
        this.submitButton.textContent = "Press to Submit";
        // Mount
        this.root.appendChild(this.submitButton);

        // Add debrief message box
        this.messageBox = document.createElement("div");
        this.messageBox.classList.add("debrief-message-box");
        this.root.appendChild(this.messageBox);

        this.messageSpan = document.createElement("span");
        this.messageSpan.classList.add("debrief-message-box__text");
        this.messageBox.appendChild(this.messageSpan);
    }

    show(
        message: string,
        submitButtonClickedCallback: () => void
    ) {
        if (message.length == 0){
            // Set the message box display to none if no message is provided
            this.messageBox.style.visibility = "hidden";
        }
        else{
            this.messageBox.style.visibility = "visible";
        }

        this.messageSpan.textContent = message;
        this.submitButton.onclick = submitButtonClickedCallback;
        this.setVisibility(true);
    }

    hide() {
        // Clear the message text
        this.messageSpan.textContent = "";

        // Hide the overlay
        super.setVisibility(false);

        // Clear the event listener
        this.submitButton.onclick = null;
    }
}

