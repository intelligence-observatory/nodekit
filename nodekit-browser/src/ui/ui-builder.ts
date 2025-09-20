import './variables.css'
import {ShellUI} from "./shell-ui/shell-ui.ts";
import {BoardViewsUI} from "./board-views-ui/board-views-ui.ts";
import {AssetManager} from "../asset-manager";


export function buildUIs() {

    // Create a parent <div> and append it to the body:
    const parentContainer =document.createElement("div")
    document.body.appendChild(parentContainer);

    // Create the root <div> which will house all components of the NodeEngine:
    const nodeEngineDiv = document.createElement("div");
    nodeEngineDiv.classList.add("node-engine-container")
    parentContainer.appendChild(nodeEngineDiv);

    // Create the content <div> which will contain all visual and interactive components of the NodeEngine.
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("node-engine-content");
    nodeEngineDiv.appendChild(contentDiv);

    // Instantiate the AssetManager:
    const assetManager = new AssetManager();

    // Create and mount the BoardViewsUI:
    const boardUI = new BoardViewsUI(
        assetManager,
    );
    contentDiv.appendChild(boardUI.root);

    // Create and mount the ShellUI:
    const shellUI = new ShellUI();
    shellUI.mount(contentDiv);

    return {
        boardViewsUI: boardUI,
        shellUI: shellUI,
        assetManager: assetManager,
    };
}

