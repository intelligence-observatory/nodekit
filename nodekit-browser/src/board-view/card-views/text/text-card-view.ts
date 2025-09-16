import type {SpatialSize,} from "../../../types/common.ts";

import './text-card-view.css'
import {CardView, type ClickableCardView} from "../card-view.ts";
import type {TextCard} from "../../../types/cards";
import {renderTextContent, type TextContentParameters} from "../../../utils.ts";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */
export class TextCardView extends CardView<TextCard> implements ClickableCardView {
    textContainer: HTMLDivElement | undefined;

    async prepare(
    ) {
        this.textContainer = document.createElement('div');
        this.textContainer.classList.add('text-card');
        this.root.appendChild(this.textContainer);


        // Set styles based on card parameters:
        this.textContainer.style.backgroundColor = this.card.background_color;

        // Mount text content
        const textContent: TextContentParameters = {
            text: this.card.text,
            textColor: this.card.text_color,
            fontSize: this.card.font_size,
            justificationHorizontal: this.card.justification_horizontal,
            justificationVertical: this.card.justification_vertical,
        }

        const textContentDiv = renderTextContent(
            textContent,
            (fontSize:SpatialSize) =>{
                const sizePx = this.boardCoords.getSizePx(fontSize)
                return sizePx + 'px';
            }
        )
        this.textContainer.appendChild(textContentDiv);
    }


    addClickCallback(callback: (e: MouseEvent) => void) {
        if (!this.textContainer) {
            throw new Error('Text container not initialized. Did you forget to call load()?');
        }
        this.textContainer.addEventListener('click', (e: MouseEvent) => {
            callback(e);
        });
    }
}