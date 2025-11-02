import type {ClickAction, FreeTextEntryState, KeyAction, SensorValue, SliderState} from "../../types/actions";
import type {Roundness} from "../../types/common.ts";
import type {PointerSample} from "../../input-streams/pointer-stream.ts";
import type {KeySample} from "../../input-streams/key-stream.ts";
import type {ClickSensor, FreeTextEntrySensor, KeySensor, Sensor, SliderSensor} from "../../types/sensors";
import {type BoardView, checkPointInRegion} from "../board-view.ts";
import {SliderCardView, type SliderSample} from "./slider/slider-card-view.ts";
import type {FreeTextEntryCard, SliderCard} from "../../types/cards";
import {FreeTextEntryCardView} from "./free-text-entry/free-text-entry.ts";


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

        const region =  sensor.region;

        const clickCallback = (pointerSample: PointerSample) => {
            if (pointerSample.sampleType !== 'down') {
                return;
            }

            const inside = checkPointInRegion(
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
            region: {
                x: sensor.x,
                y: sensor.y,
                w: sensor.w,
                h: sensor.h,
                z_index: sensor.z_index,
                roundness: 0 as Roundness,
            }
        }
        const sliderCardView = new SliderCardView(
            sliderCard,
            boardView.getCoordinateSystem()
        )

        sliderCardView.prepare()
        if (typeof sliderCard.region.z_index ==='number'){
            sliderCardView.root.style.zIndex = sliderCard.region.z_index.toString()
        }

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

export class FreeTextEntrySensorBinding extends SensorBinding {
    prepare(
        sensor: FreeTextEntrySensor,
        boardView: BoardView
    ){
        // Wire in old FreeTextEntryCard
        const freeTextCard: FreeTextEntryCard = {
            card_type: 'FreeTextEntryCard',
            prompt: sensor.prompt,
            font_size: sensor.font_size,
            text_color: sensor.text_color,
            background_color: sensor.background_color,
            max_length: sensor.max_length,
            region: {
                x: sensor.x,
                y: sensor.y,
                w: sensor.w,
                h: sensor.h,
                z_index: sensor.z_index,
                roundness: 0 as Roundness,
            },
        }

        const cardView = new FreeTextEntryCardView(
            freeTextCard,
            boardView.getCoordinateSystem()
            )
        cardView.prepare()
        if (typeof freeTextCard.region.z_index ==='number'){
            cardView.root.style.zIndex = freeTextCard.region.z_index.toString()
        }


        // Bind
        boardView.root.appendChild(cardView.root)

        // Subscribe
        const freeTextEnteredCallback = (sample: string): void => {
            const sensorValue: FreeTextEntryState = {
                text: sample
            }
            this.emit(sensorValue)
        }

        cardView.subscribe(freeTextEnteredCallback)

    }
}

