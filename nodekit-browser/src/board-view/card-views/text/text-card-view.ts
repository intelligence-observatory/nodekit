import {marked} from 'marked';
import DOMPurify from 'dompurify';
import type {SpatialSize, TextContent} from "../../../types/common.ts";

import './text-card-view.css'
import {CardView, type ClickableCardView} from "../card-view.ts";
import type {TextCard} from "../../../types/cards";
import {BoardView} from "../../board-view.ts";

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
        this.textContainer.style.backgroundColor = card.card_parameters.background_color;

        // Mount text content
        const textContentDiv = renderTextContent(
            card.card_parameters.content,
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


export function renderTextContent(
    textContent: TextContent,
    fontSizeToCSS: (fontSize:SpatialSize) => string
): HTMLDivElement {
    const textDiv = document.createElement('div');
    textDiv.classList.add('text-content');

    // Set styles based on textContent parameters:
    textDiv.style.color = textContent.text_color;
    textDiv.style.textAlign = textContent.justification_horizontal;
    switch (textContent.justification_vertical) {
        case 'top':
            textDiv.style.justifyContent = 'flex-start';
            break;
        case 'center':
            textDiv.style.justifyContent = 'center';
            break;
        case 'bottom':
            textDiv.style.justifyContent = 'flex-end';
            break;
        default:
            throw new Error(`Unknown vertical justification: ${textContent.justification_vertical}`);
    }

    // Process font size
    const fontSizeCss = fontSizeToCSS(textContent.font_size);
    textDiv.style.fontSize = fontSizeCss;


    let parsed = marked.parse(textContent.text);
    // If a promise, wait for it to resolve
    if (parsed instanceof Promise) {
        parsed.then((result) =>{
            textDiv.innerHTML = DOMPurify.sanitize(result);
        })
    }
    else{
        textDiv.innerHTML = DOMPurify.sanitize(parsed);
    }

    return textDiv
}