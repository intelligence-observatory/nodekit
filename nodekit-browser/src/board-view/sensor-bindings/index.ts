import type {Action} from "../../types/actions";
import type {Sensor} from "../../types/sensors";
import {type BoardView} from "../board-view.ts";
import type {AssetManager} from "../../asset-manager";


export abstract class SensorBinding<S extends Sensor> {
    private subscriptions: ((sensorValue: Action) => void)[] = []
    protected readonly params: {
        sensor: S;
        boardView: BoardView;
        assetManager: AssetManager
    };

    constructor(
        sensor: S,
        boardView: BoardView,
        assetManager: AssetManager,
    ) {
        this.params = {
            sensor: sensor,
            boardView: boardView,
            assetManager: assetManager,
        }
    }
    
    async prepare(): Promise<void> {}
    
    start(){}
    
    protected emit(action: Action): void{
        this.subscriptions.forEach(cb => cb(action));
    }

    public subscribe(callback: (action: Action) => void): void {
        this.subscriptions.push(callback);
    }
}

