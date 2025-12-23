import "./overlay-base.css"

export abstract class OverlayBase {

    root: HTMLDivElement;
    constructor(id:string) {

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
