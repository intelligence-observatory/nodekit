import './blank-card-view.css'
import type {BlankCard} from "../../../types/cards";
import {CardView, type ClickableCardView} from "../card-view.ts";
import {BoardView} from "../../board-view.ts";

/**
 * A card which consists of a blank rectangle with a customizable color.
 */
export class BlankCardView extends CardView implements ClickableCardView {
    constructor(
        card: BlankCard,
        boardView: BoardView,
    ) {
        super(card, boardView);
        this.root.style.backgroundColor = card.color;
    }

    addClickCallback(callback: (e: MouseEvent) => void) {
        this.root.addEventListener('click', (e: MouseEvent) => {
            callback(e);
        });
    }
}
