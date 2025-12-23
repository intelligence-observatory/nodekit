import "./overlay-base.css"
import {UIElementBase} from "../base.ts";

export abstract class OverlayBase extends UIElementBase {
    root: HTMLDivElement;
    protected content: HTMLDivElement;

    constructor(id:string) {
        super();
        this.root = document.createElement("div");
        this.root.classList.add("overlay");
        this.root.id = id;

        this.content = document.createElement("div");
        this.content.classList.add("overlay__content");
        this.root.appendChild(this.content);
    }

    setVisibility(visible:boolean) {
        if (visible) {
            this.root.classList.add("overlay--visible-state");
        }
        else{
            this.root.classList.remove("overlay--visible-state");
        }
    }
}
