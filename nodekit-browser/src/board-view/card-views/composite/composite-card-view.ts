import {CardView} from "../card-view.ts";
import type {CompositeCard} from "../../../types/cards";
import type {AssetManager} from "../../../asset-manager";
import type {BoardCoordinateSystem} from "../../board-view.ts";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */
export class CompositeCardView extends CardView<CompositeCard> {

    private childViews:Record<string, CardView>
    constructor(
        card: CompositeCard,
        boardCoords: BoardCoordinateSystem,
        childViews: Record<string, CardView>
    ){
        super(
            card,
            boardCoords
        )
        this.childViews = childViews

        // Mount all childViews to root
        for (let [_, cardView] of Object.entries(this.childViews)){
            this.root.appendChild(cardView.root);
        }
    }

    async prepare(_assetManager:AssetManager) {}

    onStart(): void {
        for (let cardView of Object.values(this.childViews)){
            cardView.onStart()
        }
    }

    onDestroy(): void {
        for (let cardView of Object.values(this.childViews)){
            cardView.onDestroy()
        }
    }
}
