import type {ClickAction, KeyAction, SensorValue, SliderState} from "../../types/actions";
import type {NodeTimePointMsec, SpatialPoint} from "../../types/common.ts";
import type {PointerSample} from "../../input-streams/pointer-stream.ts";
import type {KeySample} from "../../input-streams/key-stream.ts";
import type {ClickSensor, KeySensor, Sensor, SliderSensor} from "../../types/sensors";
import type {BoardView} from "../board-view.ts";
import type {Region} from "../../types/region";
import {SliderCardView, type SliderSample} from "../card-views/slider/slider-card-view.ts";
import type {SliderCard} from "../../types/cards";


export abstract class SensorBinding {
    private subscriptions: ((sensorValue: SensorValue) => void)[] = []


    abstract prepare(
        sensor: Sensor,
        boardView: BoardView,
    ): void;

    /**
     * Should be called by the SensorBinding whenever a new valid SensorValue has been set by the agent.
     * @param sensorValue
     */
    protected emit(sensorValue: SensorValue): void{
        this.subscriptions.forEach(cb => cb(sensorValue));
    }

    public subscribe(
        callback: (sensorValue: SensorValue) => void
    ): void {
        this.subscriptions.push(callback);
    }
}

/**
 *
 */
export class KeySensorBinding extends SensorBinding {
    prepare(
        sensor: KeySensor,
        boardView: BoardView
    ){
        const keys = sensor.keys;

        const keyCallback = (keySample: KeySample) => {
            if (keySample.sampleType !== 'down') {
                return;
            }
            if (!keys.has(keySample.key)) {
                return;
            }
            const action: KeyAction = {
                action_type: "KeyAction",
                key: keySample.key,
            };

            this.emit(action)
        }
        boardView.keyStream.subscribe(
            keyCallback
        )
    }
}

/**
 *
 */
export class ClickSensorBinding extends SensorBinding  {

    prepare(
        sensor: ClickSensor,
        boardView: BoardView
    ){

        const region: Region = {
            x: sensor.x,
            y: sensor.y,
            w: sensor.w,
            h: sensor.h,
            mask: sensor.mask
        }
        const clickCallback = (pointerSample: PointerSample) => {
            if (pointerSample.sampleType !== 'down') {
                return;
            }

            const inside = this.checkPointInRegion(
                pointerSample.x,
                pointerSample.y,
                region,
            );
            if (inside){
                const action: ClickAction = {
                    action_type: "ClickAction",
                    x: pointerSample.x,
                    y: pointerSample.y,
                };

                this.emit(action)
                return
            }
        }
        boardView.pointerStream.subscribe(clickCallback);
    }

    private checkPointInRegion(
        x: SpatialPoint,
        y: SpatialPoint,
        region: Region,
    ): boolean {
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
}

export class SliderSensorBinding extends SensorBinding {
    prepare(
        sensor: SliderSensor,
        boardView: BoardView
    ){
        // Wire in old SliderCard
        const sliderCard: SliderCard = {
            card_type: 'SliderCard',
            num_bins: sensor.num_bins,
            show_bin_markers: sensor.show_bin_markers,
            initial_bin_index: sensor.initial_bin_index,
            orientation: sensor.orientation,
            x: sensor.x,
            y: sensor.y,
            w: sensor.w,
            h: sensor.h,
            z_index: sensor.z_index,
            start_msec: 0 as NodeTimePointMsec,
            end_msec:null,
        }
        const sliderCardView = new SliderCardView(
            sliderCard,
            boardView.getCoordinateSystem()
        )
        sliderCardView.prepare()
        if (typeof sliderCard.z_index ==='number'){
            sliderCardView.root.style.zIndex = sliderCard.z_index.toString()
        }
        sliderCardView.setInteractivity(true)
        sliderCardView.setVisibility(true);

        // Bind
        boardView.root.appendChild(sliderCardView.root)

        // Subscribe
        const sliderChangedCallback = (sliderSample: SliderSample): void => {
            const sliderValue: SliderState = {
                slider_normalized_position: sliderSample.sliderNormalizedPosition,
                slider_bin_index: sliderSample.binIndex
            }
            this.emit(sliderValue)
        }

        sliderCardView.subscribeToSlider(sliderChangedCallback)
    }
}