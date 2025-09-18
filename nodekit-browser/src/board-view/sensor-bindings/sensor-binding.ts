import type {Action, ClickAction, KeyAction, TimeoutAction} from "../../types/actions";
import type {PressableKey} from "../../types/common.ts";
import {type SensorId} from "../../types/common.ts";
import type {BoardCoordinateSystem} from "../board-view.ts";
import type {ClickableCardView, DoneableCardView} from "../card-views/card-view.ts";
import {CardView} from "../card-views/card-view.ts";
import type {BoardRegion} from "../../types/regions";

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
        sensorId: SensorId,
        onSensorFired: (action: ClickAction) => void,
        boardCoords: BoardCoordinateSystem,
    ) {

        const clickCallback = (e: MouseEvent) => {
            if (!this.tArmed) {
                return;
            }

            const location = boardCoords.getBoardLocationFromMouseEvent(e)

            const action: ClickAction = {
                sensor_id: sensorId,
                action_type: "ClickAction",
                click_x: location.x,
                click_y: location.y,
                timestamp_action: performanceNowToISO8601(performance.now())
            };
            onSensorFired(action);
        }

        cardView.addClickCallback(clickCallback);
    }

    arm(): void {
        this.cardView.root.classList.add('card--clickable');
        this.tArmed = performance.now();
        this.cardView.setInteractivity(true);
    }

    destroy(): void {
        this.cardView.root.classList.remove('card--clickable');
        this.tArmed = null;
        this.cardView.setInteractivity(false);
    }
}

// TimeoutSensor
/**
A sensor which fires immediately when armed and yields a TimeoutAction.
 */
export class TimeoutSensorBinding implements SensorBinding {
    private sensorId: SensorId;
    private onSensorFired: (action: Action) => void

    constructor(
        sensorId: SensorId,
        onSensorFired: (action: Action) => void,
    ) {
        this.sensorId = sensorId;
        this.onSensorFired = onSensorFired;
    }

    arm(): void {
        const action: TimeoutAction = {
            sensor_id: this.sensorId,
            action_type: "TimeoutAction",
            timestamp_action: performanceNowToISO8601(performance.now())
        };
        this.onSensorFired(action)
    }

    destroy(): void {}
}

export class KeySensorBinding implements SensorBinding {
    private readonly sensorId: SensorId;
    private readonly onSensorFired: (action: Action) => void
    private tArmed: number | null = null;
    private readonly keys: PressableKey[];

    constructor(
        sensorId: SensorId,
        onSensorFired: (action: Action) => void,
        key: PressableKey
    ) {
        this.sensorId = sensorId;
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
            sensor_id: this.sensorId,
            action_type: "KeyAction",
            key: key,
            timestamp_action: performanceNowToISO8601(performance.now())
        };

        this.onSensorFired(action);
    }
}

