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
    copyButton: HTMLButtonElement;
    cardDiv: HTMLDivElement;

    constructor(
    ) {
        super('console-message-overlay');
        // Add the console card container
        this.cardDiv = document.createElement("div");
        this.cardDiv.classList.add("console-card");
        this.root.appendChild(this.cardDiv);

        // Add header
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("console-card__header");
        this.cardDiv.appendChild(headerDiv);

        // Add the title content div
        this.titleTextDiv = document.createElement("div");
        this.titleTextDiv.classList.add("console-card__title");
        headerDiv.appendChild(this.titleTextDiv);

        // Copy button
        this.copyButton = document.createElement("button");
        this.copyButton.classList.add("copy-button");
        this.copyButton.textContent = "Copy";
        this.copyButton.onclick = () => {
            const text = this.jsonViewer.root.textContent || "";
            navigator.clipboard.writeText(text)
        };
        headerDiv.appendChild(this.copyButton);

        // Add the message content div
        this.messageTextDiv = document.createElement("div");
        this.messageTextDiv.classList.add("console-message__text");
        this.cardDiv.appendChild(this.messageTextDiv);

        // Add the JSON viewer to the root flow
        this.jsonViewer = new JsonViewer();
        this.cardDiv.appendChild(this.jsonViewer.root);
    }
    displayMessage(
        title: string,
        message: string,
        details: unknown | null,
    ) {
        this.titleTextDiv.textContent = title;
        this.messageTextDiv.textContent = message;
        this.messageTextDiv.classList.toggle(
            "console-message__text--hidden",
            message.trim().length === 0,
        );
        const hasDetails = details !== null;
        this.cardDiv.classList.toggle("console-card--compact", !hasDetails);
        this.copyButton.hidden = !hasDetails;
        this.jsonViewer.root.classList.toggle(
            "json-viewer--hidden",
            !hasDetails,
        );
        if (hasDetails) {
            this.jsonViewer.displayAsJson(details);
        } else {
            this.jsonViewer.clear();
        }
        super.setVisibility(true)
    }
    hide(){
        this.titleTextDiv.textContent = "";
        this.messageTextDiv.textContent = "";
        this.messageTextDiv.classList.remove("console-message__text--hidden");
        this.cardDiv.classList.remove("console-card--compact");
        this.jsonViewer.root.classList.remove("json-viewer--hidden");
        // Clear the JSON data to avoid having to keep it in memory
        this.jsonViewer.clear()
        super.setVisibility(false)
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
