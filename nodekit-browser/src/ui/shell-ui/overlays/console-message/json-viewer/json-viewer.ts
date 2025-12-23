import "./json-viewer.css"
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage('json', json);
import 'highlight.js/styles/github.css';

export class JsonViewer {
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
