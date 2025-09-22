import "./board-views-ui.css";

export type BoardViewsContainerDiv = HTMLDivElement

export function getBoardViewsContainerDiv(): BoardViewsContainerDiv{
    const div = document.createElement('div');
    div.className = 'board-views-ui';
    return div
}


