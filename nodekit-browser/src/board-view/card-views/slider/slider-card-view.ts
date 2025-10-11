import './slider-card-view.css'
import {CardView} from "../card-view.ts";
import type {SliderCard} from "../../../types/cards";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */
export class SliderCardView extends CardView<SliderCard> {
    sliderElement: HTMLDivElement | undefined;

    async prepare(
    ) {
        // Add a slider element to the root
        this.sliderElement = document.createElement('div');
        this.sliderElement.classList.add('slider-card');
        this.root.appendChild(this.sliderElement);


    }
}