import type {Action, ClickAction, KeyAction, TimeoutAction} from "../../types/actions";
import type {Mask, PressableKey, SpatialPoint, SpatialSize} from "../../types/common.ts";
import type {BoardCoordinateSystem} from "../board-view.ts";

// Generic contract:
export interface SensorBinding {
    arm(): void;

    destroy(): void;
}


// Click sensor
export class ClickSensorBinding implements SensorBinding {

    protected tArmed: DOMHighResTimeStamp | null = null;
    private region: {
        x: SpatialPoint;
        y: SpatialPoint;
        w: SpatialSize;
        h: SpatialSize;
        mask: Mask
    };

    constructor(
        x: SpatialPoint,
        y: SpatialPoint,
        w: SpatialSize,
        h: SpatialSize,
        mask: Mask,
        onSensorFired: (action: ClickAction, domTimestampAction: DOMHighResTimeStamp) => void,
        boardRootElement: HTMLDivElement,
        boardCoords: BoardCoordinateSystem,
    ) {

        this.region = {
            x: x,
            y: y,
            w: w,
            h: h,
            mask: mask,
        };

        const clickCallback = (e: MouseEvent) => {
            if (!this.tArmed) {
                return;
            }

            const click = boardCoords.getBoardLocationFromMouseEvent(e)

            // Do a region check:
            const inside = this.checkPointInRegion(click.x, click.y);
            if (!inside) {
                return
            }

            const action: ClickAction = {
                action_type: "ClickAction",
                click_x: click.x,
                click_y: click.y,
            };
            onSensorFired(
                action,
                performance.now()
            );
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

    private checkPointInRegion(x: SpatialPoint, y: SpatialPoint): boolean {
        const region = this.region;
        switch (region.mask) {
            case 'rectangle':
                const left = region.x - region.w / 2;
                const right = region.x + region.w / 2;
                const top = region.y + region.h / 2;
                const bottom = region.y - region.h / 2;
                return (x >= left) &&
                    (x <= right) &&
                    (y >= bottom) &&
                    (y <= top);
            case 'ellipse':
                const radius_x = region.w / 2;
                const radius_y = region.h / 2;
                const delta_x = x - region.x;
                const delta_y = y - region.y;

                return (
                    (delta_x * delta_x) / (radius_x * radius_x) +
                    (delta_y * delta_y) / (radius_y * radius_y) <=
                    1
                );
            default:
                throw new Error(`Unknown mask: ${region.mask}`);
        }
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
    private onSensorFired:  (action: Action, domTimestampAction: DOMHighResTimeStamp) => void

    constructor(
        onSensorFired: (action: Action, domTimestampAction: DOMHighResTimeStamp)=> void,
    ) {
        this.onSensorFired = onSensorFired;
    }

    arm(): void {
        const action: TimeoutAction = {
            action_type: "TimeoutAction",
        };
        this.onSensorFired(action, performance.now());
    }

    destroy(): void {}
}

export class KeySensorBinding implements SensorBinding {
    private onSensorFired:  (action: Action, domTimestampAction: DOMHighResTimeStamp) => void
    private tArmed: number | null = null;
    private readonly keys: PressableKey[];

    constructor(
        onSensorFired:  (action: Action, domTimestampAction: DOMHighResTimeStamp) => void,
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

        this.onSensorFired(action, performance.now());
    }
}

