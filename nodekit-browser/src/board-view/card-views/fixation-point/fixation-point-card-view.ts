import './fixation-point-card-view.css'
import {CardView} from "../card-view.ts";
import type {ClickableCardView} from "../card-view.ts";

import type {FixationPointCard} from "../../../types/cards";

export class FixationPointCardView extends CardView<FixationPointCard> implements ClickableCardView{
    private button: HTMLButtonElement | undefined;

    async load(){
        this.button = document.createElement('button');
        this.button.classList.add('fixation-point');

        // Draw the fixation cross
        const fixationCrossDivHorizontal = document.createElement('div')
        fixationCrossDivHorizontal.className = 'fixation-point-cross--horizontal';
        this.button.appendChild(fixationCrossDivHorizontal);

        const fixationCrossDivVertical = document.createElement('div')
        fixationCrossDivVertical.className = 'fixation-point-cross--vertical';
        this.button.appendChild(fixationCrossDivVertical);
        // Add to root
        this.root.appendChild(this.button);
    }

    addClickCallback(callback: (e: MouseEvent) => void) {
        if (!this.button) {
            throw new Error('Button not initialized. Did you forget to call load()?');
        }

        this.button.addEventListener('click', (e:MouseEvent) => {
            callback(e)
        });
    }
}
