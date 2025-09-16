import './blank-card-view.css'
import type {BlankCard} from "../../../types/cards";
import {CardView, type ClickableCardView} from "../card-view.ts";

/**
 * A card which consists of a blank rectangle with a customizable color.
 */
export class BlankCardView extends CardView<BlankCard> implements ClickableCardView {

    async prepare(){
        this.root.style.backgroundColor = this.card.color;
    }


    addClickCallback(callback: (e: MouseEvent) => void) {
        this.root.addEventListener('click', (e: MouseEvent) => {
            callback(e);
        });
    }
}
