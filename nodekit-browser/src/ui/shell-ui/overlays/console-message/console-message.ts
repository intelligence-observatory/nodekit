import {OverlayBase} from "../overlay-base.ts";
import {JsonViewer} from "./json-viewer/json-viewer.ts";

import './console-message.css'
import {UIElementBase} from "../../base.ts";
export class ConsoleMessageOverlay extends OverlayBase {
    jsonViewer: JsonViewer
    titleTextDiv: HTMLDivElement;

    constructor(
    ) {
        super('console-message-overlay');
        // Add the console title box
        const titleBoxDiv = document.createElement("div");
        titleBoxDiv.classList.add("console-title-box");
        this.content.appendChild(titleBoxDiv);

        // Add the title content div box
        this.titleTextDiv = document.createElement("div");
        this.titleTextDiv.classList.add("console-title-box__text");
        titleBoxDiv.appendChild(this.titleTextDiv);

        // Add the JSON viewer to the root flow
        this.jsonViewer = new JsonViewer();
        this.jsonViewer.mount(this.content);

        // Copy button
        const copyButton = new CopyButton();
        copyButton.setCopyTarget(this.jsonViewer.root);
        copyButton.mount(titleBoxDiv);
    }
    displayMessage(banner:string, data:any) {
        this.titleTextDiv.textContent = banner;
        this.jsonViewer.displayAsJson(data);
        super.setVisibility(true)
    }
    hide(){
        this.titleTextDiv.textContent = "";
        // Clear the JSON data to avoid having to keep it in memory
        this.jsonViewer.clear()
        super.setVisibility(false)
    }
}



class CopyButton extends UIElementBase {
    root: HTMLButtonElement;

    constructor() {
        super();

        const copyButton = document.createElement("button");
        copyButton.classList.add("copy-button");


        copyButton.classList.add("copy-button");
        copyButton.textContent = "Copy";

        this.root = copyButton;
    }

    setCopyTarget(target: HTMLElement) {
        // Append the button to the target element
        this.root.onclick = () => {
            const text = target.textContent || "";
            navigator.clipboard.writeText(text)
        };

    }
}
