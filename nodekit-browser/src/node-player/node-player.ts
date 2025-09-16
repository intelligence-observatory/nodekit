import type {Node} from "../types/node-graph.ts";

import type {PlayNodeResult} from "./node-play.ts";
import {buildUIs} from "../ui/ui-builder.ts";
import type {ShellUI} from "../ui/shell-ui/shell-ui.ts";
import type {BoardViewsUI} from "../ui/board-views-ui/board-views-ui.ts";
import {NodePlay} from "./node-play.ts";
import {type NodePlayId} from "../types/common.ts";
import type {Board} from "../types/board";


export class NodePlayer {
    public boardViewsUI: BoardViewsUI;
    private shellUI: ShellUI;
    private bufferedNodePlays: Map<NodePlayId, NodePlay> = new Map();
    private _boardShape: Board;

    constructor(
        board: Board
    ){
        // Create all DIVs needed for the NodePlayer in a centralized call:
        const {shellUI, boardViewsUI} = buildUIs();
        this.shellUI = shellUI;
        this.boardViewsUI = boardViewsUI;
        this._boardShape = board;
    }

    async prepare(node: Node): Promise<NodePlayId> {
        /*
        Prepares a NodePlay instance and returns its ID.
         */
        const nodePlayId: NodePlayId = crypto.randomUUID() as NodePlayId;
        const boardView = this.boardViewsUI.createBoardView(nodePlayId, this._boardShape);
        const nodePlay = new NodePlay(
            node,
            boardView,
        )
        await nodePlay.prepare()

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
            this.showErrorMessageOverlay(error as Error)
            throw error;
        }

        // Set active board:
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

    // Overlays:
    showConnectingOverlay(startDelayMsec:number=500){
        this.shellUI.showSessionConnectingOverlay(startDelayMsec)
    }
    hideConnectingOverlay() {
        this.shellUI.hideSessionConnectingOverlay()
    }
    showConsoleMessageOverlay(banner: string, message: any) {
        this.shellUI.showConsoleMessageOverlay(banner, message);
    }
    hideConsoleMessageOverlay() {
        this.shellUI.hideConsoleMessageOverlay()
    }

    async playStartScreen() {
        await this.shellUI.playStartScreen()
    }

    async playEndScreen(message:string='', endScreenTimeoutMsec: number=10000) {
        await this.shellUI.playEndScreen(message, endScreenTimeoutMsec)
    }

    showErrorMessageOverlay(error: Error){
        console.error('An error occurred:', error);
        this.shellUI.showConsoleMessageOverlay(
            'The following error occurred:',
            {
                name: (error as Error).name,
                message: (error as Error).message,
                stack: (error as Error).stack,
            },
        );
    }
}
