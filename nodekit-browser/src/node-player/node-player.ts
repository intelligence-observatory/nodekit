import type {PlayNodeResult} from "./node-play.ts";
import {NodePlay} from "./node-play.ts";
import type {BoardViewsUI} from "../ui/board-views-ui/board-views-ui.ts";
import {type NodePlayId} from "../types/common.ts";


export class NodePlayer {
    public boardViewsUI: BoardViewsUI;
    private bufferedNodePlays: Map<NodePlayId, NodePlay> = new Map();

    constructor(boardViewsUI:BoardViewsUI) {
        // Create all DIVs needed for the NodePlayer in a centralized call:
        this.boardViewsUI = boardViewsUI;
    }

    async play(nodePlayId: NodePlayId): Promise<PlayNodeResult>{
        /*
        Executes the NodePlay instance with the given ID.
        Returns a NodeMeasurements upon completion.
         */
        const nodePlay = this.bufferedNodePlays.get(nodePlayId);

        if (!nodePlay) {
            throw new Error(`NodePlay ${nodePlayId} does not exist. `);
        }

        // Set active Board:
        this.boardViewsUI.setActiveBoard(nodePlayId);
        const playNodeResult = await nodePlay.run()

        // Remove the NodePlay instance and its BoardView from the buffer:
        this.boardViewsUI.destroyBoardView(nodePlayId);
        this.bufferedNodePlays.delete(nodePlayId);
        return playNodeResult;
    }
}
