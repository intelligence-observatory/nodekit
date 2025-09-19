import type {Action, ClickAction, KeyAction, TimeoutAction} from "../../types/actions";
import type {ISO8601, PressableKey} from "../../types/common.ts";
import type {BoardCoordinateSystem} from "../board-view.ts";
import type {Region} from "../../types/regions";
import {checkPointInRegion} from "../../utils.ts";
import {performanceNowToISO8601} from "../../utils.ts";

// Generic contract:
export interface SensorBinding {
    arm(): void;

    destroy(): void;
}


// Click sensor
export class ClickSensorBinding implements SensorBinding {

    protected tArmed: DOMHighResTimeStamp | null = null;

    constructor(
        region: Region,
        onSensorFired: (action: ClickAction, timestampAction: ISO8601) => void,
        boardRootElement: HTMLDivElement,
        boardCoords: BoardCoordinateSystem,
    ) {

        const clickCallback = (e: MouseEvent) => {
            if (!this.tArmed) {
                return;
            }

            const {x, y} = boardCoords.getBoardLocationFromMouseEvent(e)

            // Do a region check:
            const inside = checkPointInRegion(x, y, region);
            if (!inside) {
                return
            }

            const action: ClickAction = {
                action_type: "ClickAction",
                click_x: x,
                click_y: y,
            };
            onSensorFired(action, performanceNowToISO8601(e.timeStamp));
        }

        // Subscribe to mousedown on the Board: (todo: create the PointerStream)
        boardRootElement.addEventListener(
            'mousedown',
            clickCallback,
            {
                capture: true, // Capture phase to get the event before it might be stopped by children.
            }
        );
    }

    arm(): void {
        this.tArmed = performance.now();
    }

    destroy(): void {
        this.tArmed = null;
    }
}

// TimeoutSensor
/**
A sensor which fires immediately when armed and yields a TimeoutAction.
 */
export class TimeoutSensorBinding implements SensorBinding {
    private onSensorFired:  (action: Action, timestampAction: ISO8601) => void

    constructor(
        onSensorFired: (action: Action, timestampAction: ISO8601)=> void,
    ) {
        this.onSensorFired = onSensorFired;
    }

    arm(): void {
        const action: TimeoutAction = {
            action_type: "TimeoutAction",
        };
        this.onSensorFired(action, performanceNowToISO8601(performance.now()))
    }

    destroy(): void {}
}

export class KeySensorBinding implements SensorBinding {
    private readonly onSensorFired:  (action: Action, timestampAction: ISO8601) => void
    private tArmed: number | null = null;
    private readonly keys: PressableKey[];

    constructor(
        onSensorFired:  (action: Action, timestampAction: ISO8601) => void,
        key: PressableKey
    ) {
        this.onSensorFired = onSensorFired;

        this.keys = [key];

        // This listener must be added to document (and not the BoardView.root) because
        // it is not guaranteed that the BoardView will have focus.
        // See: https://stackoverflow.com/a/12828055
        document.addEventListener('keydown', this.onKeyPress);
    }

    arm() {
        this.tArmed = performance.now();
    }

    destroy(): void {
        this.tArmed = null;
        document.removeEventListener('keydown', this.onKeyPress);
    }

    private onKeyPress = (e: KeyboardEvent) => {
        if (!this.tArmed) {
            return;
        }

        e.preventDefault();

        let key = e.key as PressableKey;
        if (!this.keys.includes(key)) {
            return
        }

        // Create the action to be fired:
        const action: KeyAction = {
            action_type: "KeyAction",
            key: key,
        };

        this.onSensorFired(action, performanceNowToISO8601(e.timeStamp));
    }
}

