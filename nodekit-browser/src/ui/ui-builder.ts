import './variables.css'
import {ShellUI} from "./shell-ui/shell-ui.ts";
import {BoardViewsUI} from "./board-views-ui/board-views-ui.ts";
import {AssetManager} from "../asset-manager";


export function buildUIs() {

    // Create the root <div> which will house all components of NodeKit:
    const nodeKitDiv = document.createElement("div");
    nodeKitDiv.classList.add("nodekit-container")
    document.body.appendChild(nodeKitDiv);

    // Create the content <div> which will contain all visual and interactive components of NodeKit.
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("nodekit-content");
    nodeKitDiv.appendChild(contentDiv);

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

