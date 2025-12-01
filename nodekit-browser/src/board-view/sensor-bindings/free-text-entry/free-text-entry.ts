import './free-text-entry.css'
import type {FreeTextEntrySensor} from "../../../types/sensors";
import {BoardCoordinateSystem, createRegionDiv} from "../../board-view.ts";
import type {FreeTextEntryAction} from "../../../types/actions";
import {SensorBinding} from "../index.ts";


export class FreeTextEntrySensorBinding extends SensorBinding<FreeTextEntrySensor> {
    async prepare() {
        const sensorView = new FreeTextEntrySensorView(
            this.params.sensor,
            this.params.boardView.getCoordinateSystem()
        )

        // Bind
        this.params.boardView.root.appendChild(sensorView.root)

        // Subscribe
        const freeTextEnteredCallback = (sample: string): void => {
            const sensorValue: FreeTextEntryAction = {
                action_type: 'FreeTextEntryAction',
                text: sample,
                t: this.params.boardView.clock.now(),
            }
            this.emit(sensorValue)
        }

        sensorView.subscribe(freeTextEnteredCallback)

    }
}

export class FreeTextEntrySensorView {
    private textAreaElement: HTMLTextAreaElement;
    private doneButton: HTMLButtonElement;
    public root: HTMLElement


    constructor(
        sensor: FreeTextEntrySensor,
        boardCoords: BoardCoordinateSystem
    ) {
        this.root = createRegionDiv(sensor.region, boardCoords);


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

        const doneText='Done' // '↵'
        const defaultText='';
        const doneButton = document.createElement('button');
        doneButton.classList.add('free-text-entry__submit');
        doneButton.textContent=defaultText;
        doneButton.disabled=sensor.min_length>0;
        gutter.appendChild(doneButton);

        wrapper.appendChild(textAreaElement);
        wrapper.appendChild(gutter);
        this.root.appendChild(wrapper);


        const updateAppearance = () =>{
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
        }
        // Basic interaction
        textAreaElement.addEventListener('input', () => {
            updateAppearance()
        });

        this.textAreaElement = textAreaElement;
        this.doneButton = doneButton;

        updateAppearance()
    }

    subscribe(callback: (sample: string) => void): void {
        this.doneButton.addEventListener('click', () => {
            const value = this.textAreaElement.value;
            callback(value);
            this.doneButton.textContent='✓'
        });
    }
}
