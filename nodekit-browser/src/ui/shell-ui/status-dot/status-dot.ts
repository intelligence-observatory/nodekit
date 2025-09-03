import {UIElementBase} from "../base.ts"
import "./status-dot.css"

export class StatusDot extends UIElementBase {
    root: HTMLDivElement;

    constructor() {
        super();

        this.root = document.createElement('div');
        this.root.className = 'status-dot';
    }

    setState(state: "positive" | "negative" | "neutral") {
        const base = this.root;
        // Clear any existing status classes
        base.classList.remove(
            "status-dot--positive",
            "status-dot--negative",
            "status-dot--neutral"
        );

        const validStates = new Set(["positive", "negative", "neutral"]);
        const chosen = validStates.has(state) ? state : "negative";
        base.classList.add(`status-dot--${chosen}`);
    }
}
