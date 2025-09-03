import type {BoardView} from "../board-view.ts";

export interface EffectBinding {
    start(): void;
    stop(): void;
}


export class HideCursorEffectBinding implements EffectBinding {
    boardView: BoardView;
    constructor(
        boardView: BoardView
    ){
        this.boardView = boardView;
    }

    start(){
        this.boardView.root.style.cursor = 'none';
    }
    stop(){
        this.boardView.root.style.cursor = '';
    }
}
