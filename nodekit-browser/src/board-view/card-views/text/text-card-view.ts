import type {SpatialSize,} from "../../../types/common.ts";

import './text-card-view.css'
import {CardView, type ClickableCardView} from "../card-view.ts";
import type {TextCard} from "../../../types/cards";
import {BoardView} from "../../board-view.ts";
import {renderTextContent, type TextContentParameters} from "../../../utils.ts";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */
export class TextCardView extends CardView implements ClickableCardView {
    textContainer: HTMLDivElement;

    constructor(
        card: TextCard,
        boardView: BoardView,

    ) {
        super(card, boardView);
        this.textContainer = document.createElement('div');
        this.textContainer.classList.add('text-card');
        this.root.appendChild(this.textContainer);


        // Set styles based on card parameters:
        this.textContainer.style.backgroundColor = card.background_color;

        // Mount text content
        const textContent: TextContentParameters = {
            text: card.text,
            textColor: card.text_color,
            fontSize: card.font_size,
            justificationHorizontal: card.justification_horizontal,
            justificationVertical: card.justification_vertical,
        }

        const textContentDiv = renderTextContent(
            textContent,
            (fontSize:SpatialSize) =>{
                const boardCoords = boardView.getCoordinateSystem()
                const sizePx = boardCoords.getSizePx(fontSize)
                return sizePx + 'px';
            }
        )
        this.textContainer.appendChild(textContentDiv);
    }


    addClickCallback(callback: (e: MouseEvent) => void) {
        this.textContainer.addEventListener('click', (e: MouseEvent) => {
            callback(e);
        });
    }
}