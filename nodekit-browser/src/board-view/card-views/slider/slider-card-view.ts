import './slider-card-view.css'
import {CardView} from "../card-view.ts";
import type {SliderCard} from "../../../types/cards";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */
export class SliderCardView extends CardView<SliderCard> {
    sliderElement: HTMLInputElement | undefined;

    async prepare(
    ) {
        // Add a slider element to the root
        this.sliderElement = document.createElement('input');
        this.sliderElement.type = 'range';
        this.sliderElement.classList.add('slider-card');

        // Set the number of bins:
        this.sliderElement.min = '1';
        this.sliderElement.step = '1';
        this.sliderElement.max = (this.card.num_bins).toString();

        // Set orientation:
        if (this.card.orientation === 'horizontal')
            this.sliderElement.classList.add('slider-card--horizontal');
        else{
            this.sliderElement.classList.add('slider-card--vertical');
        }

        // Set initial value to middle bin
        const middleBin = (this.card.num_bins / 2);
        this.sliderElement.value = middleBin.toString();

        // Mount
        this.root.appendChild(this.sliderElement);
    }

    onStart() {
        // Set the card to interactive
        this.setInteractivity(true);
    }
}