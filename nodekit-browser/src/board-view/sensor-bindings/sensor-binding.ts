import type {Action, ClickAction, DoneAction, KeyPressAction} from "../../types/sensors/actions/actions.ts";
import type {SensorId, TimePointMsec} from "../../types/fields.ts";
import type {BoardView} from "../board-view.ts";
import type {ClickableCardView, DoneableCardView} from "../card-views/card-view.ts";
import {CardView} from "../card-views/card-view.ts";
import type {PressableKey} from "../../types/fields.ts";

// Generic contract:
export interface SensorBinding {
    // Represents a Sensor that is bound to a Target, which emits Actions. An Action Listener may be attached to the SensorBinding.
    // A Sensor must be armed before it emits Actions.
    arm(): void;

    disarm(): void;
}


// Click sensor
export class ClickSensorBinding implements SensorBinding {

    protected tArmed: DOMHighResTimeStamp | null = null;
    private cardView: ClickableCardView;

    constructor(
        sensorId: SensorId,
        onSensorFired: (action: ClickAction) => void,
        cardView: ClickableCardView,
        boardView: BoardView,
    ) {
        this.cardView = cardView;
        // Attach the click sensor to the card
        cardView.addClickCallback(
            (e) => {
                if (!this.tArmed) {
                    return;
                }
                // Get timing
                const reactionTimeMsec = Math.round(performance.now() - this.tArmed);

                // Get the click coordinates in board units (center is 0, 0; extends -0.5 to 0.5)
                const boardRect = boardView.root.getBoundingClientRect();
                const clickX = (e.clientX - boardRect.left) / boardRect.width - 0.5;
                const clickY = (e.clientY - boardRect.top) / boardRect.height - 0.5;

                // Create the action to be fired
                const action: ClickAction = {
                    sensor_id: sensorId,
                    action_type: "ClickAction",
                    action_value: {
                        click_x: clickX,
                        click_y: clickY,
                    },
                    reaction_time_msec: reactionTimeMsec as TimePointMsec
                };
                // Call the onSensorFired callback with the action
                onSensorFired(action);
            }
        )
    }

    arm(): void {
        this.cardView.root.classList.add('card--clickable');
        this.tArmed = performance.now();
        this.cardView.setInteractivity(true);
    }

    disarm(): void {

        this.cardView.root.classList.remove('card--clickable');
        this.tArmed = null;
        this.cardView.setInteractivity(false);
    }
}

// Done sensor
export class DoneSensorBinding implements SensorBinding {
    protected tArmed: DOMHighResTimeStamp | null = null;
    private cardView: DoneableCardView;

    constructor(
        sensorId: SensorId,
        onSensorFired: (action: Action) => void,
        cardView: DoneableCardView,
    ) {
        this.cardView = cardView;
        // Attach the done sensor to the card
        cardView.addDoneCallback(
            () => {
                if (!this.tArmed) {
                    return;
                }
                const reactionTimeMsec = Math.round(performance.now() - this.tArmed);
                // Create the action to be fired
                const action: DoneAction = {
                    sensor_id: sensorId,
                    action_type: "DoneAction",
                    action_value: {},
                    reaction_time_msec: reactionTimeMsec as TimePointMsec
                };
                // Call the onSensorFired callback with the action
                onSensorFired(action);
            }
        )
    }

    arm(): void {
        this.tArmed = performance.now();
        this.cardView.setInteractivity(true);
    }

    disarm(): void {
        this.tArmed = null;
        this.cardView.setInteractivity(false);
    }
}

// TimeoutSensor
export class TimeoutSensorBinding implements SensorBinding {
    private timeoutId: number | null = null;
    private sensorId: SensorId;
    private onSensorFired: (action: Action) => void
    private timeoutMsec: number;

    constructor(
        sensorId: SensorId,
        onSensorFired: (action: Action) => void,
        timeoutMsec: number,
    ) {
        this.sensorId = sensorId;
        this.onSensorFired = onSensorFired;
        this.timeoutMsec = timeoutMsec;
    }

    arm(): void {
        // Start the timer
        const startTime = performance.now();
        this.timeoutId = window.setTimeout(
            () => {
                const reactionTimeMsec = Math.round(performance.now() - startTime);
                // Create the action to be fired
                const action: Action = {
                    sensor_id: this.sensorId,
                    action_type: "TimeoutAction",
                    action_value: {},
                    reaction_time_msec: reactionTimeMsec as TimePointMsec
                };
                // Call the onSensorFired callback with the action
                this.onSensorFired(action);
            },
            this.timeoutMsec
        );
    }

    disarm(): void {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}

export class KeyPressSensorBinding implements SensorBinding {
    private readonly sensorId: SensorId;
    private readonly onSensorFired: (action: Action) => void
    private tArmed: number | null = null;
    private readonly keys: PressableKey[];
    private readonly onKeyPressCallback: (e: KeyboardEvent) => void;

    constructor(
        sensorId: SensorId,
        onSensorFired: (action: Action) => void,
        keys: Set<PressableKey>
    ) {
        this.sensorId = sensorId;
        this.onSensorFired = onSensorFired;

        // It would be better for `this.keys` to be `Set<PressableKey>`.
        // Unfortunately, the Typescript generator will turn that into an array, not a set,
        // and therefore `this.keys.has(key)` won't work.
        // So, `keys` is converted to an array, which appeases the generator.
        this.keys = [...keys];

        // This event must be added to document, and not BoardView.root because
        // this is the only way to ensure that KeyboardEvents are heard, due to how focus works.
        // See: https://stackoverflow.com/a/12828055
        this.onKeyPressCallback = this.onKeyPress.bind(this);
        document.addEventListener('keydown', this.onKeyPressCallback);
    }

    arm() {
        this.tArmed = performance.now();
    }

    disarm() {
        this.tArmed = null;

        // Manually remove the listener.
        document.removeEventListener('keydown', this.onKeyPressCallback);
    }

    private onKeyPress(e: KeyboardEvent) {
        if (!this.tArmed) {
            return;
        }
        console.log('here');
        e.preventDefault();
        let key = e.key as PressableKey;
        if (this.keys.includes(key)) {
                const reactionTimeMsec = Math.round(performance.now() - this.tArmed) as TimePointMsec;
                // Create the action to be fired
                const action: KeyPressAction = {
                    sensor_id: this.sensorId,
                    action_type: "KeyPressAction",
                    action_value: {
                        key: key
                    },
                    reaction_time_msec: reactionTimeMsec as TimePointMsec
                };
                this.onSensorFired(action);
            }
    }
}

// Type Guards
export function assertClickable(cardView: CardView): asserts cardView is ClickableCardView {
    if (!('addClickCallback' in cardView)) {
        throw new Error("CardView is not clickable");
    }
}

export function assertDoneable(cardView: CardView): asserts cardView is DoneableCardView {
    if (!('addDoneCallback' in cardView)) {
        throw new Error("CardView is not doneable");
    }
}