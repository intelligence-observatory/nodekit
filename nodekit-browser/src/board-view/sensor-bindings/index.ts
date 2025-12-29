import type {Action} from "../../types/actions.ts";
import type {Sensor} from "../../types/sensors.ts";
import {type BoardView} from "../board-view.ts";
import type {AssetManager} from "../../asset-manager";


export abstract class SensorBinding<S extends Sensor> {
    private subscriptions: ((sensorValue: Action) => void)[] = []
    private timeoutId: number | null = null;
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
    
    start() {
        this.clearTimeout();
        this.scheduleTimeout();
        this.onStart();
    }

    protected onStart(): void {}
    
    protected emit(action: Action): void{
        this.clearTimeout();
        this.subscriptions.forEach(cb => cb(action));
    }

    public subscribe(callback: (action: Action) => void): void {
        this.subscriptions.push(callback);
    }

    private scheduleTimeout(): void {
        const duration = this.params.sensor.duration_msec;
        if (duration == null) {
            return;
        }
        this.timeoutId = window.setTimeout(
            () => {
                const waitAction: Action = {
                    action_type: "WaitAction",
                    action_value: null,
                }
                this.emit(waitAction)
            },
            duration,
        )
    }

    private clearTimeout(): void {
        if (this.timeoutId === null) {
            return;
        }
        window.clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }
}
