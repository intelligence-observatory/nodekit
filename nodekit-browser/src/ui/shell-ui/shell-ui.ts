import './shell-ui.css'

import {SessionConnectingOverlay} from "./overlays/session-connecting/session-connecting.ts";
import {ConsoleMessageOverlay} from "./overlays/console-message/console-message.ts";
import {SessionFinishedOverlay} from "./overlays/session-finished/session-finished.ts";
import {SessionStartedOverlay} from "./overlays/session-start/session-start.ts";

export class ShellUI {
    root: HTMLDivElement

    // Overlays
    private sessionConnectingOverlay: SessionConnectingOverlay;
    private overlayConsoleMessage: ConsoleMessageOverlay;
    private sessionStartedOverlay: SessionStartedOverlay;
    private sessionFinishedOverlay: SessionFinishedOverlay;

    constructor() {
        // Make a root div which will hold all Shell UI elements
        this.root = document.createElement("div");
        this.root.className = 'shell-ui';

        // Initialize overlay for session connecting
        this.sessionConnectingOverlay = new SessionConnectingOverlay();
        this.root.appendChild(this.sessionConnectingOverlay.root);

        // Initialize overlay for JSON data
        this.overlayConsoleMessage = new ConsoleMessageOverlay()
        this.root.appendChild(this.overlayConsoleMessage.root);

        // Initialize overlay for session finished
        this.sessionFinishedOverlay = new SessionFinishedOverlay();
        this.root.appendChild(this.sessionFinishedOverlay.root);

        // Initialize overlay for session started
        this.sessionStartedOverlay = new SessionStartedOverlay();
        this.root.appendChild(this.sessionStartedOverlay.root);

    }

    showSessionConnectingOverlay(startDelayMsec: number = 500) {
        // Show the overlay
        this.sessionConnectingOverlay.show(startDelayMsec);
        console.log('yo')
    }

    hideSessionConnectingOverlay() {
        // Hide the overlay
        this.sessionConnectingOverlay.hide();
    }

    showConsoleMessageOverlay(
        title: string,
        message: string,
        details: unknown | null = null,
    ) {
        // Show the overlay with the provided data
        this.overlayConsoleMessage.displayMessage(title, message, details);
    }

    hideConsoleMessageOverlay() {
        this.overlayConsoleMessage.hide();
    }


    async playStartScreen(){
        // Await for the button to be pressed
        let startPressed = new Promise<void>((resolve, _reject) => {
            this.sessionStartedOverlay.show(
                () => {
                    this.sessionStartedOverlay.hide()
                    resolve()
                }
            )
        })

        await startPressed
    }
    async playEndScreen(
        endScreenTimeoutMsec: number = 10000
    ) {

        // Await for the button to be pressed
        let timeoutId: number | null = null;
        let submitPressed = new Promise<void>((resolve, _reject) => {
            this.sessionFinishedOverlay.show(
                () => {
                    this.sessionFinishedOverlay.hide()
                    if (timeoutId !== null) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                    resolve()
                }
            )
        })

        let timeoutPromise = new Promise<void>((resolve, _reject) => {
            timeoutId = window.setTimeout(() => {
                this.sessionFinishedOverlay.hide()
                resolve()
            }, endScreenTimeoutMsec);
        })

        await Promise.race([submitPressed, timeoutPromise])
    }
}
