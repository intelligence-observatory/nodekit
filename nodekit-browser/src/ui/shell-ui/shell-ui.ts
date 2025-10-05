import {UIElementBase} from "./base.ts";
import {StatusDot} from "./status-dot/status-dot.ts";

import './shell-ui.css'

import {ProgressBar} from "./progress-bar/progress-bar.ts";
import {SessionConnectingOverlay} from "./overlays/session-connecting/session-connecting.ts";
import {ConsoleMessageOverlay} from "./overlays/console-message/console-message.ts";
import {SessionFinishedOverlay} from "./overlays/session-finished/session-finished.ts";
import {SessionStartedOverlay} from "./overlays/session-start/session-start.ts";

export class ShellUI extends UIElementBase {
    root: HTMLDivElement

    // Widgets:
    private progressBar: ProgressBar
    private statusDot: StatusDot

    // Overlays
    private sessionConnectingOverlay: SessionConnectingOverlay;
    private overlayConsoleMessage: ConsoleMessageOverlay;
    private sessionStartedOverlay: SessionStartedOverlay;
    private sessionFinishedOverlay: SessionFinishedOverlay;

    constructor() {
        super()
        // Make a root div which will hold all Shell UI elements
        this.root = document.createElement("div");
        this.root.className = 'shell-ui';

        // Initialize progress bar
        this.progressBar = new ProgressBar('cognition');
        this.progressBar.mount(this.root);

        // Initialize status dot
        this.statusDot = new StatusDot();
        this.statusDot.mount(this.root);

        // Initialize overlay for session connecting
        this.sessionConnectingOverlay = new SessionConnectingOverlay();
        this.sessionConnectingOverlay.mount(this.root);

        // Initialize overlay for JSON data
        this.overlayConsoleMessage = new ConsoleMessageOverlay()
        this.overlayConsoleMessage.mount(this.root);

        // Initialize overlay for session finished
        this.sessionFinishedOverlay = new SessionFinishedOverlay();
        this.sessionFinishedOverlay.mount(this.root);

        // Initialize overlay for session started
        this.sessionStartedOverlay = new SessionStartedOverlay();
        this.sessionStartedOverlay.mount(this.root);

    }

    setProgressBar(percent: number) {
        this.progressBar.setProgress(percent);
    }

    setStatusDot(state: "positive" | "negative" | "neutral") {
        this.statusDot.setState(state)
    }

    showSessionConnectingOverlay(startDelayMsec: number = 500) {
        // Show the overlay
        this.sessionConnectingOverlay.show(startDelayMsec);
    }

    hideSessionConnectingOverlay() {
        // Hide the overlay
        this.sessionConnectingOverlay.hide();
    }

    showConsoleMessageOverlay(banner: string, data: any) {
        // Show the overlay with the provided data
        this.overlayConsoleMessage.displayMessage(banner, data);
    }

    showErrorOverlay(error: Error) {
        this.showConsoleMessageOverlay(
            'The following error occurred:',
            {
                name: (error as Error).name,
                message: (error as Error).message,
                stack: (error as Error).stack,
            },
        );
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
        message:string = '',
        endScreenTimeoutMsec: number = 10000
    ) {

        // Await for the button to be pressed
        let submitPressed = new Promise<void>((resolve, _reject) => {
            this.sessionFinishedOverlay.show(
                message,
                () => {
                    this.sessionFinishedOverlay.hide()
                    resolve()
                }
            )
        })

        await submitPressed

        let timeoutPromise = new Promise<void>((resolve, _reject) => {
            setTimeout(() => {
                this.sessionFinishedOverlay.hide()
                resolve()
            }, endScreenTimeoutMsec);
        })

        await Promise.race([submitPressed, timeoutPromise])
    }
}
