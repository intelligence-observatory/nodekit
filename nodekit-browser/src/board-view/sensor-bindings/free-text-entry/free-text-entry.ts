import './free-text-entry.css'
import {CardView} from "../../card-views/card-view.ts";
import type {FreeTextEntrySensor} from "../../../types/sensors";
import type {BoardView} from "../../board-view.ts";
import type {ColorHexString, PlainString, Roundness, SpatialSize} from "../../../types/common.ts";
import type {FreeTextEntryState} from "../../../types/actions";
import {SensorBinding} from "../index.ts";
import type {Region} from "../../../types/region";


export interface FreeTextEntryCard{
    region: Region
    prompt: PlainString;
    font_size: SpatialSize;
    text_color: ColorHexString;
    background_color: ColorHexString;
    max_length: number | null; // Maximum number of characters allowed
}


export class FreeTextEntryCardView extends CardView<FreeTextEntryCard> {
    freeTextInputElement: HTMLTextAreaElement | undefined;

    async prepare() {
        this.freeTextInputElement = document.createElement('textarea' );
        this.freeTextInputElement.classList.add('free-text-entry-card');
        this.freeTextInputElement.spellcheck=false;

        // Set background color from card
        this.freeTextInputElement.style.backgroundColor = this.card.background_color;

        // Set text color
        this.freeTextInputElement.style.color = this.card.text_color;

        // Set font size:
        this.freeTextInputElement.style.fontSize = this.boardCoords.getSizePx(this.card.font_size) + 'px';

        // Set the initial prompt:
        this.freeTextInputElement.placeholder = this.card.prompt;

        // Cap the max length:
        let maxLength = 10000 // Arbitary large number if null
        if (this.card.max_length !== null){
            maxLength = this.card.max_length;
        }
        this.freeTextInputElement.maxLength = maxLength;

        this.root.appendChild(this.freeTextInputElement);
    }

    subscribe(callback: (sample: string) => void): void {
        // Add an event listener
        this.freeTextInputElement?.addEventListener(
            'input',
            (event) => {
                const value = (event.target as HTMLTextAreaElement).value;
                console.log('Updated text:', value);
                callback(value)
            });
    }
}

export class FreeTextEntrySensorBinding extends SensorBinding {
    prepare(
        sensor: FreeTextEntrySensor,
        boardView: BoardView
    ) {
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
        if (typeof freeTextCard.region.z_index === 'number') {
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