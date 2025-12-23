import {OverlayBase} from "../overlay-base.ts";
import {Spinner} from "./spinner.ts";
import "./session-connecting.css"


export class SessionConnectingOverlay extends OverlayBase {
    spinner: Spinner

    private displayTimeout: number | null = null;

    constructor(
    ) {
        super('session-connecting-overlay');

        // Add connecting message div
        const messageBoxDiv = document.createElement("div");
        messageBoxDiv.classList.add("connecting-message-box");
        this.root.appendChild(messageBoxDiv);

        // Mount spinner before text
        this.spinner = new Spinner();
        messageBoxDiv.appendChild(this.spinner.root);

        // Add text
        const textDiv = document.createElement("div");
        textDiv.classList.add("connecting-message-box__text");
        textDiv.textContent = 'Connecting...'
        messageBoxDiv.appendChild(textDiv);
    }
    show(startDelayMsec:number) {
        // Always delay showing the overlay by ~500 ms to avoid flickering
        this.displayTimeout = window.setTimeout(() => {
            this.spinner.startSpinning();
            super.setVisibility(true)
        }, startDelayMsec
        );
    }

    hide(){
        // Clear the display timeout if it exists
        if (this.displayTimeout !== null) {
            clearTimeout(this.displayTimeout);
            this.displayTimeout = null;
        }

        // Stop the spinner animation
        this.spinner.stopSpinning();

        // Hide the overlay
        super.setVisibility(false);
    }
}
