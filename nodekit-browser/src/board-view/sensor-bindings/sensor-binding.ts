import type {Action, ClickAction, DoneAction, KeyHold, KeyHoldsAction, KeyPressAction} from "../../types/actions";
import type {PressableKey} from "../../types/common.ts";
import {type SensorId} from "../../types/common.ts";
import type {BoardView} from "../board-view.ts";
import type {ClickableCardView, DoneableCardView} from "../card-views/card-view.ts";
import {CardView} from "../card-views/card-view.ts";

import {performanceNowToISO8601} from "../../utils.ts";

// Generic contract:
export interface SensorBinding {
    // Represents a Sensor that is bound to a Target. When a Sensor is triggered, it emits an Action.
    // A Sensor must be armed before it can be triggered.
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
        // Bind the ClickSensor to the Card:
        cardView.addClickCallback(
            (e) => {
                if (!this.tArmed) {
                    return;
                }
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
                    timestamp_action: performanceNowToISO8601(performance.now())
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
                // Create the action to be fired
                const action: DoneAction = {
                    sensor_id: sensorId,
                    action_type: "DoneAction",
                    action_value: {},
                    timestamp_action: performanceNowToISO8601(performance.now())
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
        this.timeoutId = window.setTimeout(
            () => {
                // Create the action to be fired
                const action: Action = {
                    sensor_id: this.sensorId,
                    action_type: "TimeoutAction",
                    action_value: {},
                    timestamp_action: performanceNowToISO8601(performance.now())
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

    constructor(
        sensorId: SensorId,
        onSensorFired: (action: Action) => void,
        keys: Set<PressableKey>
    ) {
        this.sensorId = sensorId;
        this.onSensorFired = onSensorFired;

        this.keys = [...keys];

        // This listener must be added to document (and not the BoardView.root) because
        // it is not guaranteed that the BoardView will have focus.
        // See: https://stackoverflow.com/a/12828055
        document.addEventListener('keydown', this.onKeyPress);
    }

    arm() {
        this.tArmed = performance.now();
    }

    disarm() {
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
        const action: KeyPressAction = {
            sensor_id: this.sensorId,
            action_type: "KeyPressAction",
            action_value: {
                key: key
            },
            timestamp_action: performanceNowToISO8601(performance.now())
        };

        // Disarm the sensor after a key press:
        this.disarm();

        this.onSensorFired(action);
    }
}

// A raw keyboard event with some extra metadata.
interface KeyEvent {
    event: KeyboardEvent,
    t: DOMHighResTimeStamp, // The timestamp returned by `performance.now()`.
}

export class KeyHoldSensorBinding implements SensorBinding {
    private readonly sensorId: SensorId;
    private readonly onSensorFired: (action: Action) => void
    private readonly keyToKeyEvents:  Record<PressableKey, KeyEvent[]>; // Dictionary of key to KeyEvent[]
    private tArmed: number | null = null;

    constructor(
        sensorId: SensorId,
        onSensorFired: (action: Action) => void,
        keys: Set<PressableKey>,
    ) {
        this.sensorId = sensorId;
        this.onSensorFired = onSensorFired;

        // Initialize keyToKeyEvents:
        this.keyToKeyEvents = {} as Record<PressableKey, KeyEvent[]>;
        keys.forEach(key => {
            this.keyToKeyEvents[key] = [];
        })

        // These events must be added to document, and not BoardView.root because
        // it is not guaranteed that the BoardView.root element will have focus.
        document.addEventListener('keydown', this.onKeyboardEvent);
        document.addEventListener('keyup', this.onKeyboardEvent);
    }

    arm() {
        this.tArmed = performance.now();
    }

    disarm() {

        // Manually remove the listeners:
        document.removeEventListener('keydown', this.onKeyboardEvent);
        document.removeEventListener('keyup', this.onKeyboardEvent);
        this.tArmed = null;

        // Package the Action:
        const tEnd = performance.now();
        let keyHolds = this.deriveKeyHolds();

        let action: KeyHoldsAction = {
            sensor_id: this.sensorId,
            action_type: "KeyHoldsAction",
            action_value: {
                key_holds: keyHolds
            },
            timestamp_action: performanceNowToISO8601(tEnd)
        };
        this.onSensorFired(action);
    }

    private onKeyboardEvent = (event: KeyboardEvent)=> {
        // Ignore the event if the sensor isn't armed yet:
        if (!this.tArmed) {
            return;
        }

        const key: PressableKey = event.key as PressableKey;
        // Ignore the event if it isn't on a legal key:
        if (!(key in this.keyToKeyEvents)) {
            return;
        }

        // Prevent default behavior (e.g., scrolling the page with arrow keys):
        event.preventDefault();

        // If this is a repeat event and at least one event for this key is already recorded, ignore it.
        // This correctly records the case where the first keydown event observed by the armed Sensor is a repeat event,
        // and ignores any subsequent repeat events.
        if (event.repeat && this.keyToKeyEvents[key].length > 0) {
            return;
        }

        // Log the event:
        this.keyToKeyEvents[key].push({
            event: event,
            t: performance.now()
        });
    }

    private deriveKeyHolds() : KeyHold[] {
        // Maps the raw keydown and keyup events to KeyHold objects.

        const holds: KeyHold[] = [];

        for (const key of Object.keys(this.keyToKeyEvents) as PressableKey[]) {

            // Get time-sorted KeyEvents for this key:
            const events = [...this.keyToKeyEvents[key]].sort((a, b) => a.t - b.t);

            let downT: DOMHighResTimeStamp | null = null;

            for (const { event, t } of events) {
                if (event.type === "keydown") {
                    // Ignore auto-repeat or duplicate downs while already down
                    if (downT !== null) continue;
                    // Start a new hold
                    downT = t;
                } else if (event.type === "keyup") {
                    if (downT === null) {
                        // Sensor was armed while key was already down; start_time is unknown
                        holds.push({
                            key,
                            timestamp_start: null,
                            timestamp_end: performanceNowToISO8601(t),
                        });
                    } else {
                        holds.push({
                            key,
                            timestamp_start: performanceNowToISO8601(downT),
                            timestamp_end: performanceNowToISO8601(t),
                        });
                        downT = null;
                    }
                }
            }

            // If still down at disarm: open-ended hold
            if (downT !== null) {
                holds.push({
                    key,
                    timestamp_start: performanceNowToISO8601(downT),
                    timestamp_end: null,
                });
            }
        }
        return holds
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