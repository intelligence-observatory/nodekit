import {OverlayBase} from "../overlay-base.ts";
import './console-message.css'
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import 'highlight.js/styles/github.css';

hljs.registerLanguage('json', json);

export class ConsoleMessageOverlay extends OverlayBase {
    jsonViewer: JsonViewer
    titleTextDiv: HTMLDivElement;
    messageTextDiv: HTMLDivElement;
    copyButton: CopyButton;

    constructor(
    ) {
        super('console-message-overlay');
        // Add the console title box
        const titleBoxDiv = document.createElement("div");
        titleBoxDiv.classList.add("console-title-box");
        this.root.appendChild(titleBoxDiv);

        // Add the title content div box
        this.titleTextDiv = document.createElement("div");
        this.titleTextDiv.classList.add("console-title-box__text");
        titleBoxDiv.appendChild(this.titleTextDiv);

        // Add the message content div box
        this.messageTextDiv = document.createElement("div");
        this.messageTextDiv.classList.add("console-message__text");
        this.root.appendChild(this.messageTextDiv);

        // Add the JSON viewer to the root flow
        this.jsonViewer = new JsonViewer();
        this.root.appendChild(this.jsonViewer.root);

        // Copy button
        this.copyButton = new CopyButton();
        this.copyButton.setCopyTarget(this.jsonViewer.root);
        titleBoxDiv.appendChild(this.copyButton.root);
    }
    displayMessage(
        title: string,
        message: string,
        details: any,
        showCopy: boolean = true,
    ) {
        this.titleTextDiv.textContent = title;
        this.messageTextDiv.textContent = message;
        this.messageTextDiv.classList.toggle(
            "console-message__text--hidden",
            message.trim().length === 0,
        );
        this.copyButton.root.hidden = !showCopy;
        this.jsonViewer.displayAsJson(details);
        super.setVisibility(true)
    }
    hide(){
        this.titleTextDiv.textContent = "";
        this.messageTextDiv.textContent = "";
        this.messageTextDiv.classList.remove("console-message__text--hidden");
        // Clear the JSON data to avoid having to keep it in memory
        this.jsonViewer.clear()
        super.setVisibility(false)
    }
}



class CopyButton {
    root: HTMLButtonElement;

    constructor() {

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

class JsonViewer {
    root: HTMLDivElement;
    jsonViewerContent: HTMLDivElement;

    constructor() {

        this.root = document.createElement("div");
        this.root.classList.add("json-viewer");

        // Add content
        this.jsonViewerContent = document.createElement("div");
        this.jsonViewerContent.classList.add("json-viewer__content");
        this.root.appendChild(this.jsonViewerContent);
    }

    displayAsJson(
        data:any
    ){

        // Clear existing content
        this.clear()

        // Create a new pre containing the JSON data:
        const jsonPre = document.createElement("pre");
        jsonPre.classList.add("json-viewer__pre");
        jsonPre.textContent = JSON.stringify(data, null, 2);

        // Highlight the logs:
        hljs.highlightElement(jsonPre);

        // As a stylistic choice, make the background of the pre element transparent
        jsonPre.style.backgroundColor = "transparent";

        // Add as child
        this.jsonViewerContent.appendChild(jsonPre);
    }

    clear(){
        // Clear the content of the json viewer
        this.jsonViewerContent.innerHTML = "";
    }
}
