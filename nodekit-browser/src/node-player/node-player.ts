import type {Node} from "../types/node.ts";
import type {PlayNodeResult} from "./node-play.ts";
import {NodePlay} from "./node-play.ts";
import type {ShellUI} from "../ui/shell-ui/shell-ui.ts";
import type {BoardViewsUI} from "../ui/board-views-ui/board-views-ui.ts";
import {type NodePlayId} from "../types/common.ts";


export class NodePlayer {
    public boardViewsUI: BoardViewsUI;
    private shellUI: ShellUI;
    private bufferedNodePlays: Map<NodePlayId, NodePlay> = new Map();

    constructor(shellUI:ShellUI, boardViewsUI:BoardViewsUI) {
        // Create all DIVs needed for the NodePlayer in a centralized call:
        this.shellUI = shellUI;
        this.boardViewsUI = boardViewsUI;
    }

    async prepare(node: Node): Promise<NodePlayId> {
        /*
        Prepares a NodePlay instance and returns its ID.
         */
        const nodePlayId: NodePlayId = crypto.randomUUID() as NodePlayId;
        const boardView = this.boardViewsUI.createBoardView(nodePlayId, node.board);
        const nodePlay = new NodePlay(
            node,
            boardView,
        )
        await nodePlay.prepare(this.boardViewsUI.assetManager)

        // Add the prepared NodePlay to buffer
        this.bufferedNodePlays.set(nodePlayId, nodePlay);

        return nodePlayId as NodePlayId;
    }

    async play(nodePlayId: NodePlayId): Promise<PlayNodeResult>{
        /*
        Executes the NodePlay instance with the given ID.
        Returns a NodeMeasurements upon completion.
         */
        const nodePlay = this.bufferedNodePlays.get(nodePlayId);

        if (!nodePlay) {
            const error = new Error(`NodePlay ${nodePlayId} does not exist. `);
            this.shellUI.showErrorOverlay(error as Error)
            throw error;
        }

        // Set active Board:
        this.boardViewsUI.setActiveBoard(nodePlayId);
        const playNodeResult = await nodePlay.run()

        // Remove the NodePlay instance and its BoardView from the buffer:
        this.boardViewsUI.destroyBoardView(nodePlayId);
        this.bufferedNodePlays.delete(nodePlayId);
        return playNodeResult;
    }

    setProgressBar(percent: number) {
        this.shellUI.setProgressBar(percent);
    }

}
