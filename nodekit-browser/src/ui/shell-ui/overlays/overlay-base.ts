import "./overlay-base.css"
import {UIElementBase} from "../base.ts";

export abstract class OverlayBase extends UIElementBase {
    root: HTMLSpanElement;

    constructor(id:string) {
        super();
        this.root = document.createElement("div");
        this.root.classList.add("overlay");
        this.root.id = id;
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
