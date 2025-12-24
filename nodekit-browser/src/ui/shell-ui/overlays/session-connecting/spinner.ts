
export class Spinner {
    root: HTMLSpanElement;

    private spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    private spinnerInterval: number | null = null;
    private frameIndex = 0;

    constructor(
    ) {

        // Add spinner text node
        this.root = document.createElement("span");
        this.root.style.paddingRight = "0.5rem";
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
