
import type {NodeMeasurements, NodeParameters} from "./types/models.ts";
import {DeviceGate} from "./user-gates/device-gate.ts";
import {buildUIs} from "./ui/ui-builder.ts";
import type {ShellUI} from "./ui/shell-ui/shell-ui.ts";
import type {BoardViewsUI} from "./ui/board-views-ui/board-views-ui.ts";
import {NodePlay} from "./node-player/node-play.ts";
import {type NodePlayId} from "./types/fields.ts";

export class NodePlayer {
    private boardViewsUI: BoardViewsUI;
    private shellUI: ShellUI;

    // NodePlay lookups:
    private nodePlays: Map<string, NodePlay> = new Map();

    constructor(
    ){
        // Create all DIVs needed for the NodeEngine in a centralized call:
        const {shellUI, boardViewsUI} = buildUIs();
        this.shellUI = shellUI;
        this.boardViewsUI = boardViewsUI;

        try {
            if (!DeviceGate.isValidDevice()){
                throw new Error('Unsupported device. Please use a desktop browser.');
            }
        }
        catch (error) {
            this.showErrorMessageOverlay(error as Error);
            throw new Error('NodePlayer initialization failed: ' + (error as Error).message);
        }
    }

    async prepare(
        nodeParameters: NodeParameters
    ): Promise<NodePlayId> {
        try{
            // Generate random UUID4:
            const nodePlayId = crypto.randomUUID();
            const boardView = this.boardViewsUI.createBoardView(nodePlayId, nodeParameters.board);
            const nodePlay = new NodePlay(
                nodeParameters,
                boardView,
            )
            await nodePlay.prepare()

            // Attach
            this.nodePlays.set(nodePlayId, nodePlay);

            return nodePlayId as NodePlayId;
        }
        catch(error) {
            // Show error message overlay
            this.showErrorMessageOverlay(error as Error);
            throw new Error('NodePlayer preparation failed: ' + (error as Error).message);
        }
    }

    async play(nodePlayId: NodePlayId): Promise<NodeMeasurements>{
        try{
            // Check if the node has been prepared:
            const nodePlay = this.nodePlays.get(nodePlayId);
            if (!nodePlay) {
                throw new Error(`NodePlay ${nodePlayId} does not exist. `);
            }

            // Set active board
            this.boardViewsUI.setActiveBoard(nodePlayId);

            const nodeMeasurements = await nodePlay.run()

            // Deprovision:
            this.boardViewsUI.destroyBoardView(nodePlayId);
            this.nodePlays.delete(nodePlayId);

            return nodeMeasurements
        }
        catch(error) {
            // Show error message overlay
            this.showErrorMessageOverlay(error as Error);
            throw error; // Re-throw the error after showing the overlay
        }
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

    async playEndScreen(message:string='', endScreenTimeoutMsec: number=10000) {
        await this.shellUI.playEndScreen(message, endScreenTimeoutMsec)
    }

    private showErrorMessageOverlay(error: Error){
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
