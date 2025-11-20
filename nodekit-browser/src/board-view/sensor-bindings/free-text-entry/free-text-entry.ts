import './free-text-entry.css'
import type {FreeTextEntrySensor} from "../../../types/sensors";
import {BoardCoordinateSystem, type BoardView, RegionView} from "../../board-view.ts";
import type {FreeTextEntryAction} from "../../../types/actions";
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
            const sensorValue: FreeTextEntryAction = {
                sensor_value_type: 'FreeTextEntryAction',
                text: sample,
                t: boardView.clock.now(),
            }
            this.emit(sensorValue)
        }

        sensorView.subscribe(freeTextEnteredCallback)

    }
}

export class FreeTextEntrySensorView2 extends RegionView {
    freeTextInputElement: HTMLTextAreaElement;

    constructor(
        sensor: FreeTextEntrySensor,
        boardCoords: BoardCoordinateSystem
    ){
        super(sensor.region, boardCoords)

        this.freeTextInputElement = document.createElement('textarea' );
        this.freeTextInputElement.classList.add('free-text-entry-card');
        this.freeTextInputElement.spellcheck=false;


        // Set font size:
        this.freeTextInputElement.style.fontSize = this.boardCoords.getSizePx(sensor.font_size) + 'px';

        // Set the initial prompt:
        this.freeTextInputElement.placeholder = sensor.prompt;

        // Cap the max length:
        let maxLength = 10000 // Arbitrary large number if null
        if (sensor.max_length !== null){
            maxLength = sensor.max_length;
        }
        this.freeTextInputElement.maxLength = maxLength;

        this.root.appendChild(this.freeTextInputElement);
    }

    subscribe(callback: (sample: string) => void): void {
        // Add an event listener
        this.freeTextInputElement.addEventListener(
            'input',
            (event) => {
                const value = (event.target as HTMLTextAreaElement).value;
                console.log('Updated text:', value);
                callback(value)
            });
    }
}

export class FreeTextEntrySensorView extends RegionView {
    private textAreaElement: HTMLTextAreaElement;
    private doneButton: HTMLButtonElement;

    constructor(
        sensor: FreeTextEntrySensor,
        boardCoords: BoardCoordinateSystem
    ) {
        super(sensor.region, boardCoords);

        // Parent wrapper
        const wrapper = document.createElement('div');
        wrapper.classList.add('free-text-entry');

        // Textarea
        const textAreaElement = document.createElement('textarea');
        textAreaElement.classList.add('free-text-entry__input');
        textAreaElement.spellcheck = false;
        textAreaElement.placeholder = sensor.prompt ?? '';
        textAreaElement.style.fontSize = boardCoords.getSizePx(sensor.font_size) + 'px';
        textAreaElement.maxLength = sensor.max_length ?? 10000;

        // Gutter
        const gutter = document.createElement('div');
        gutter.classList.add('free-text-entry__gutter');

        const defaultText=''
        const doneText='Done' // '↵'
        const doneButton = document.createElement('button');
        doneButton.classList.add('free-text-entry__submit');
        doneButton.textContent=defaultText;
        doneButton.disabled=sensor.min_length>0;
        gutter.appendChild(doneButton);

        wrapper.appendChild(textAreaElement);
        wrapper.appendChild(gutter);
        this.root.appendChild(wrapper);

        // Basic interaction
        textAreaElement.addEventListener('input', () => {
            const submittable = textAreaElement.value.trim().length >= sensor.min_length
            doneButton.textContent = submittable ? doneText:defaultText;

            if (submittable){
                doneButton.classList.add('submittable')
                doneButton.disabled=false;
            }
            else{
                doneButton.classList.remove('submittable')
                doneButton.disabled=true;
            }

        });

        this.textAreaElement = textAreaElement;
        this.doneButton = doneButton;
    }

    subscribe(callback: (sample: string) => void): void {
        this.doneButton.addEventListener('click', () => {
            const value = this.textAreaElement.value;
            callback(value);
            this.doneButton.textContent='✓'
        });
    }
}
