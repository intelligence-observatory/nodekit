import './variables.css'

export type NodeKitRootDiv = HTMLDivElement & { __brand: 'NodeKitRootDiv' };



export function createNodeKitRootDiv(): NodeKitRootDiv {
    const nodeKitDiv = document.createElement("div");
    nodeKitDiv.classList.add("nodekit-container")
    document.body.appendChild(nodeKitDiv);
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("nodekit-content");
    nodeKitDiv.appendChild(contentDiv);
    return contentDiv as NodeKitRootDiv;
}