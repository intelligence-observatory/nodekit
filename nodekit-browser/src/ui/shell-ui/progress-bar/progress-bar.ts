import {UIElementBase} from "../base.ts"
import "./progress-bar.css"

export class ProgressBar extends UIElementBase {
    root: HTMLDivElement;
    private progressBarDiv: HTMLDivElement;

    constructor(
        of: 'cognition' | 'system'
    ) {
        super();

        this.root = document.createElement('div');
        this.root.className = 'progress-bar';

        // Create the inner progress bar element
        this.progressBarDiv = document.createElement('div');
        this.progressBarDiv.className = 'progress-bar__inner';
        this.root.appendChild(this.progressBarDiv);

        // Match case on of
        switch (of) {
            case 'cognition':
                this.progressBarDiv.classList.add('progress-bar__inner--cognition');
                break;
            case 'system':
                this.progressBarDiv.classList.add('progress-bar__inner--system');
                break;
            default:
                throw new Error(`Unknown progress bar type: ${of}`);
        }
    }

    setProgress(percent: number) {
        // Round the percent to the nearest integer and ensure it's between 0 and 100
        const percentFilled = Math.round(Math.min(Math.max(percent, 0), 100));
        // Set the width of the progress bar
        this.progressBarDiv.style.width = `${percentFilled}%`;
    }
}
