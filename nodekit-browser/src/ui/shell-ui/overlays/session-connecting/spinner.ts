import {UIElementBase} from "../../base.ts";

export class Spinner extends UIElementBase {
    root: HTMLSpanElement;

    private spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    private spinnerInterval: number | null = null;
    private frameIndex = 0;

    constructor(
    ) {
        super();

        // Add spinner text node
        this.root = document.createElement("span");
        this.root.style.paddingRight = "0.5rem";
        //spinnerSpan.classList.add("shell-ui-spinner-frame");
        this.root.textContent = this.spinnerFrames[this.frameIndex];
    }

    startSpinning(){
        this.frameIndex = 0;

        // Animate spinner
        this.spinnerInterval = window.setInterval(() => {
            this.root.textContent = this.spinnerFrames[this.frameIndex++ % this.spinnerFrames.length];
        }, 100);
    }

    stopSpinning(){
        if (this.spinnerInterval !== null) {
            clearInterval(this.spinnerInterval);
            this.spinnerInterval = null;
        }
    }
}
