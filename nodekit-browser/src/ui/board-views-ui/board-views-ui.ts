import "./board-views-ui.css";
import type {Board} from "../../types/board";
import {BoardView} from "../../board-view/board-view.ts";

export type TmpBoardUIDiv = HTMLDivElement

export function tmpGetBoardViewsUIDiv(): TmpBoardUIDiv{
    const div = document.createElement('div');
    div.className = 'board-views-ui';
    return div
}

export class BoardViewsUI {

    public root: HTMLDivElement;
    private boardViews: Map<string, BoardView> = new Map(); // Map of board ID to BoardView
    private activeBoardId: string | null = null;

    constructor(
        root: TmpBoardUIDiv
    ) {
        this.root = root;
        // Set class
    }

    createBoardView(
        boardId: string,
        board: Board
    ):BoardView{
        // Check if already exists:
        if (this.boardViews.has(boardId)){
            return this.getBoardView(boardId);
        }

        const newBoardView = new BoardView(boardId, board);
        this.boardViews.set(boardId, newBoardView);

        // Mount the new board view to the root element
        this.root.appendChild(newBoardView.root);

        return newBoardView;
    }

    getBoardView(boardId: string): BoardView {
        // Get or create the BoardView:
        const boardView = this.boardViews.get(boardId);
        if (!boardView){
            throw new Error(`Could not getBoardView for Board ID: ${boardId}`)
        }
        return boardView;
    }

    setActiveBoard(
        boardId: string,
    ){
        // Turns off the currently active BoardView, and sets the new BoardView as active.
        if(this.activeBoardId) {
            if (this.activeBoardId === boardId) {
                // Already active, nothing to do
                return;
            }
            const currentBoardView = this.getBoardView(this.activeBoardId);
            currentBoardView.setBoardState(false, false);
        }

        // Turn on the new BoardView
        const newBoardView = this.getBoardView(boardId);
        newBoardView.setBoardState(true, true);
        this.activeBoardId = boardId;
    }

    destroyBoardView(boardId: string){
        // Destroys the BoardView for the given boardId.
        // This should remove all event listeners and clean up resources.
        const boardView = this.boardViews.get(boardId);
        if (!boardView) {
            // Doesn't exist, so nothing to do
            return
        }
        boardView.reset();

        // Remove the board view from the root element
        this.root.removeChild(boardView.root);
        // Remove the board view from the map
        this.boardViews.delete(boardId);

        // If this was the active board, reset activeBoardId
        if (this.activeBoardId === boardId) {
            this.activeBoardId = null;
        }
    }
}




