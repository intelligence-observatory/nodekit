import type {Action, ClickAction, FreeTextEntryState, KeyAction, SliderState, TimeoutAction} from "../../types/actions";
import type {CardId, Mask, PressableKey, SpatialPoint, SpatialSize, TimeElapsedMsec} from "../../types/common.ts";
import type {PointerSample, PointerStream} from "../../input-streams/pointer-stream.ts";
import type {KeySample, KeyStream} from "../../input-streams/key-stream.ts";
import type {Clock} from "../../clock.ts";
import type {TextCardView} from "../card-views/text/text-card-view.ts";
import type {FreeTextEntryCardView} from "../card-views/free-text-entry/free-text-entry.ts";
import type {SliderCardView} from "../card-views/slider/slider-card-view.ts";

// Generic contract:
export interface SensorBinding {
    arm(): void;

    destroy(): void;
}


export class ClickSensorBinding implements SensorBinding {

    protected tArmed: DOMHighResTimeStamp | null = null;
    private region: {
        x: SpatialPoint;
        y: SpatialPoint;
        w: SpatialSize;
        h: SpatialSize;
        mask: Mask
    };
    private unsubscribe: () => void;

    constructor(
        x: SpatialPoint,
        y: SpatialPoint,
        w: SpatialSize,
        h: SpatialSize,
        mask: Mask,
        onSensorFired: (action: ClickAction, tAction: TimeElapsedMsec) => void,
        pointerStream: PointerStream,
    ) {
        this.region = {
            x: x,
            y: y,
            w: w,
            h: h,
            mask: mask,
        };

        const clickCallback = (pointerSample: PointerSample) => {
            if (!this.tArmed) {
                return;
            }

            if (pointerSample.sampleType !== 'down') {
                return;
            }

            // Do a region check:
            const inside = this.checkPointInRegion(
                pointerSample.x,
                pointerSample.y
            );

            if (!inside) {
                return
            }

            const action: ClickAction = {
                action_type: "ClickAction",
                x: pointerSample.x,
                y: pointerSample.y,
            };
            onSensorFired(
                action,
                pointerSample.t,
            );
        }

        // Subscribe to mousedown on the Board: (todo: create the PointerStream)
        this.unsubscribe = pointerStream.subscribe(clickCallback);
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
        this.unsubscribe();
    }
}

/**
 A sensor which fires immediately when armed.
 */
export class TimeoutSensorBinding implements SensorBinding {
    private onSensorFired: (action: Action, tAction: TimeElapsedMsec) => void
    private clock: Clock

    constructor(
        onSensorFired: (action: Action, tAction: TimeElapsedMsec) => void,
        clock: Clock,
    ) {
        this.onSensorFired = onSensorFired;
        this.clock = clock;
    }

    arm(): void {
        const action: TimeoutAction = {
            action_type: "TimeoutAction",
        };
        this.onSensorFired(action, this.clock.now());
    }

    destroy(): void {}
}

export class KeySensorBinding implements SensorBinding {
    private onSensorFired: (action: Action, tAction: TimeElapsedMsec) => void
    private tArmed: number | null = null;
    private unsubscribe: () => void;

    constructor(
        onSensorFired: (action: Action, tAction: TimeElapsedMsec) => void,
        key: PressableKey,
        keyStream: KeyStream,
    ) {
        this.onSensorFired = onSensorFired;

        const keyCallback = (keySample: KeySample) => {
            if (!this.tArmed) {
                return;
            }
            if (keySample.sampleType !== 'down') {
                return;
            }
            if (keySample.key !== key) {
                return;
            }
            const action: KeyAction = {
                action_type: "KeyAction",
                key: keySample.key,
            };
            this.onSensorFired(action, keySample.t);
        }
        this.unsubscribe = keyStream.subscribe(keyCallback)
    }

    arm() {
        this.tArmed = performance.now();
    }

    destroy(): void {
        this.tArmed = null;
        this.unsubscribe();
    }
}

export class SubmitSensorBinding implements SensorBinding {
    private armed: boolean = false;
    constructor(
        onSensorFired: (action: Action, tAction: TimeElapsedMsec) => void,
        submitterCardView: TextCardView,
        sourceCardViews: Record<CardId, FreeTextEntryCardView | SliderCardView>,
        clock: Clock,
    ){

        const submitButtonStateChanged = (selected: boolean)=> {
            console.log('yo', selected)
            if (!selected){
                return;
            }

            if (!this.armed){
                return;
            }

            let submittedValues: Record<CardId, FreeTextEntryState | SliderState> = {};
            if (selected){
                // Gather form values
                for (const sourceCardId of Object.keys(sourceCardViews) as CardId[]) {
                    const sourceCardView = sourceCardViews[sourceCardId];

                    if (sourceCardView.card.card_type == 'FreeTextEntryCard'){
                        const freeTextEntryCardView = sourceCardView as FreeTextEntryCardView;
                        submittedValues[sourceCardId] = {"text": freeTextEntryCardView.getCurrentText()}
                    }

                    if (sourceCardView.card.card_type == 'SliderCard'){
                        const sliderCardView = sourceCardView as SliderCardView;
                        submittedValues[sourceCardId] = {
                            "slider_normalized_position": sliderCardView.getCurrentNormalizedPosition(),
                            "slider_bin_index": sliderCardView.getCurrentBinIndex(),
                        }
                    }
                }

                // Fire
                const action: Action = {
                    action_type: "SubmitAction",
                    submitted_values: submittedValues,
                }
                onSensorFired(action, clock.now());
            }
        }

        // Subscribe to the submitterCardView's submit event:
        submitterCardView.subscribeToSelectionChanges(submitButtonStateChanged)

    }

    arm() {
        this.armed=true;
    }
    destroy(): void {

    }

}