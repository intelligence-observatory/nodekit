import './fixation-point-card-view.css'
import {CardView} from "../card-view.ts";
import type {ClickableCardView} from "../card-view.ts";

import type {FixationPointCard} from "../../../types/cards/cards.ts";
import {BoardView} from "../../board-view.ts";

export class FixationPointCardView extends CardView implements ClickableCardView{
    button: HTMLButtonElement
    constructor(
        card: FixationPointCard,
        boardView: BoardView,
    ) {
        super(card, boardView)

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
        this.button.addEventListener('click', (e:MouseEvent) => {
            callback(e)
        });
    }
}
