import './card-view.css';

import type {Card} from "../../types/cards";
import type {BoardCoordinateSystem} from "../board-view.ts";
import type {AssetManager} from "../../asset-manager";

export abstract class CardView<C extends Card = Card> {
    root: HTMLElement;
    public card: C
    boardCoords: BoardCoordinateSystem;

    constructor(
        card: C,
        boardCoords: BoardCoordinateSystem,
    ) {
        this.card = card;
        this.boardCoords = boardCoords;

        // Create the Card's root element
        this.root = document.createElement('div');
        this.root.classList.add('card');

        // Configure Card position and size:
        const {leftPx, topPx} = boardCoords.getBoardLocationPx(
            card.x,
            card.y,
            card.w,
            card.h
        )

        const {widthPx, heightPx} = boardCoords.getBoardRectanglePx(
            card.w,
            card.h
        );

        this.root.style.left = `${leftPx}px`;
        this.root.style.top = `${topPx}px`;
        this.root.style.width = `${widthPx}px`;
        this.root.style.height = `${heightPx}px`;
    }

    async prepare(_assetManager:AssetManager){
        // Any Card-specific loading logic should go here
    }

    onStart() {

    }
    onDestroy() {
        // Called when the Card is destroyed
    }
}
