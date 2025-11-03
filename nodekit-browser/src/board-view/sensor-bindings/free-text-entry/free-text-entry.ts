import './free-text-entry.css'
import type {FreeTextEntrySensor} from "../../../types/sensors";
import {BoardCoordinateSystem, type BoardView, RegionView} from "../../board-view.ts";
import type {FreeTextEntryState} from "../../../types/actions";
import {SensorBinding} from "../index.ts";


export class FreeTextEntrySensorBinding extends SensorBinding<FreeTextEntrySensor> {
    prepare(
        boardView: BoardView
    ) {
        const sensorView = new FreeTextEntrySensorView(
            this.sensor,
            boardView.getCoordinateSystem()
        )

        // Bind
        boardView.root.appendChild(sensorView.root)

        // Subscribe
        const freeTextEnteredCallback = (sample: string): void => {
            const sensorValue: FreeTextEntryState = {
                text: sample
            }
            this.emit(sensorValue)
        }

        sensorView.subscribe(freeTextEnteredCallback)

    }
}
export class FreeTextEntrySensorView extends RegionView {
    freeTextInputElement: HTMLTextAreaElement | undefined;

    constructor(
        sensor: FreeTextEntrySensor,
        boardCoords: BoardCoordinateSystem
    ){
        super(sensor.region, boardCoords)

        this.freeTextInputElement = document.createElement('textarea' );
        this.freeTextInputElement.classList.add('free-text-entry-card');
        this.freeTextInputElement.spellcheck=false;

        // Set background color from card
        this.freeTextInputElement.style.backgroundColor = sensor.background_color;

        // Set text color
        this.freeTextInputElement.style.color = sensor.text_color;

        // Set font size:
        this.freeTextInputElement.style.fontSize = this.boardCoords.getSizePx(sensor.font_size) + 'px';

        // Set the initial prompt:
        this.freeTextInputElement.placeholder = sensor.prompt;

        // Cap the max length:
        let maxLength = 10000 // Arbitary large number if null
        if (sensor.max_length !== null){
            maxLength = sensor.max_length;
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
