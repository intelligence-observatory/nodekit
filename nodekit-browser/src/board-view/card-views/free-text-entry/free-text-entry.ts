
import './free-text-entry.css'
import {CardView} from "../card-view.ts";
import type {FreeTextEntryCard} from "../../../types/cards";

export class FreeTextEntryView extends CardView<FreeTextEntryCard> {
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

    onStart() {
        // Set the card to default interactive
        this.setInteractivity(true);


    }
    onStop() {
        // Called when the Card is stopped
    }
    onDestroy() {
        // Called when the Card is destroyed
    }
}