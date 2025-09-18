import './blank-card-view.css'
import type {BlankCard} from "../../../types/cards";
import {CardView} from "../card-view.ts";

/**
 * A card which consists of a blank rectangle with a customizable color.
 */
export class BlankCardView extends CardView<BlankCard> {

    async prepare(){
        this.root.style.backgroundColor = this.card.color;
    }
}
