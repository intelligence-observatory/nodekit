import "./board-views-ui.css";

export type TmpBoardUIDiv = HTMLDivElement

export function tmpGetBoardViewsUIDiv(): TmpBoardUIDiv{
    const div = document.createElement('div');
    div.className = 'board-views-ui';
    return div
}


