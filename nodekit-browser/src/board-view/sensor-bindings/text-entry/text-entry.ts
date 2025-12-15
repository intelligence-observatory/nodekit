import './text-entry.css'
import type {TextEntrySensor} from "../../../types/sensors";
import {BoardCoordinateSystem, createRegionDiv} from "../../board-view.ts";
import type {TextEntryAction} from "../../../types/actions.ts";
import {SensorBinding} from "../index.ts";


export class TextEntrySensorBinding extends SensorBinding<TextEntrySensor> {
    async prepare() {
        const sensorView = new TextEntrySensorView(
            this.params.sensor,
            this.params.boardView.getCoordinateSystem()
        )

        // Bind
        this.params.boardView.root.appendChild(sensorView.root)

        // Subscribe
        const textEnteredCallback = (sample: string): void => {
            const sensorValue: TextEntryAction = {
                action_type: 'TextEntryAction',
                action_value: sample,
            }
            this.emit(sensorValue)
        }

        sensorView.subscribe(textEnteredCallback)

    }
}

export class TextEntrySensorView {
    private textAreaElement: HTMLTextAreaElement;
    private doneButton: HTMLButtonElement;
    public root: HTMLElement

    constructor(
        sensor: TextEntrySensor,
        boardCoords: BoardCoordinateSystem
    ) {
        this.root = createRegionDiv(sensor.region, boardCoords);


        // Parent wrapper
        const wrapper = document.createElement('div');
        wrapper.classList.add('text-entry');

        // Textarea
        const textAreaElement = document.createElement('textarea');
        textAreaElement.classList.add('text-entry__input');
        textAreaElement.spellcheck = false;
        textAreaElement.placeholder = sensor.prompt ?? '';
        textAreaElement.style.fontSize = boardCoords.getSizePx(sensor.font_size) + 'px';
        textAreaElement.maxLength = sensor.max_length ?? 10000;

        // Gutter
        const gutter = document.createElement('div');
        gutter.classList.add('text-entry__gutter');

        const doneText='Done' // '↵'
        const defaultText='';
        const doneButton = document.createElement('button');
        doneButton.classList.add('text-entry__submit');
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
