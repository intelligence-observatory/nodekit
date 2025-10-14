import type {SpatialSize,} from "../../../types/common.ts";

import './text-card-view.css'
import {CardView} from "../card-view.ts";
import type {TextCard} from "../../../types/cards";
import {renderTextContent, type TextContentParameters} from "../../../utils.ts";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */

type CardSelectedSubscriber = (selected: boolean) => void;

export class TextCardView extends CardView<TextCard> {
    textContainer: HTMLDivElement | undefined;

    private selected: boolean = false;
    private subscribers: Set<CardSelectedSubscriber> = new Set()

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

        // Add event listener for hover effect
        console.log(this.card )
        if (this.card.selectable) {
            this.textContainer.addEventListener('mouseenter', () => {
                this.textContainer!.style.background = 'var(--cognition-faint-color)'; // Just hardcode; CSS class switches weren't working. Todo: fix
            });

            this.textContainer.addEventListener('mouseleave', () => {
                this.textContainer!.style.background = this.card.background_color;
            });
        }

        // Add event listener for selection
        if (this.card.selectable) {
            this.textContainer.addEventListener('click', () => {
                this.selected = !this.selected;
                if (this.selected) {
                    this.textContainer!.classList.add('text-card--selected');
                }
                else {
                    this.textContainer!.classList.remove('text-card--selected');
                }

                this.emitSelectionState()
            }
            );
        }
    }
    onStart() {
        super.onStart();
        this.setInteractivity(true)
    }

    private emitSelectionState(){
        this.subscribers.forEach((callback) => {
            callback(this.selected);
        });
    }

    public subscribeToSelectionChanges(callback: CardSelectedSubscriber){
        this.subscribers.add(callback);
    }
}