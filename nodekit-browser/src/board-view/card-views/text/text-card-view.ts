import type {SpatialSize,} from "../../../types/values.ts";

import './text-card-view.css'
import {LeafCardView} from "../card-view.ts";
import type {TextCard} from "../../../types/cards";
import {renderTextContent, type TextContentParameters} from "../../../utils.ts";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */


export class TextCardView extends LeafCardView<TextCard> {
    textContainer!: HTMLDivElement;

    async prepare(
    ) {
        this.textContainer = document.createElement('div');
        this.textContainer.classList.add('text-card');
        this.root.style.borderRadius='8px'
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
}