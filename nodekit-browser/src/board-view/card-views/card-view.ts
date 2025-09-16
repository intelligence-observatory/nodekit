import './card-view.css';

import type {Card} from "../../types/cards";
import type {BoardCoordinateSystem} from "../board-view.ts";
import type {AssetManager} from "../../asset-manager/asset-manager.ts";

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
        this.root.id = card.card_id;

        // Configure Card position and size:
        const {leftPx, topPx} = boardCoords.getBoardLocationPx(
            this.card.x,
            this.card.y,
            this.card.w,
            this.card.h
        )

        const {widthPx, heightPx} = boardCoords.getBoardRectanglePx(
            this.card.w,
            this.card.h
        );

        this.root.style.left = `${leftPx}px`;
        this.root.style.top = `${topPx}px`;
        this.root.style.width = `${widthPx}px`;
        this.root.style.height = `${heightPx}px`;

        // By default, the Card is not visible and not interactive
        this.setVisibility(false);
        this.setInteractivity(false);
    }

    async load(_assetManager:AssetManager){}

    setVisibility(
        visible: boolean
    ) {
        if (visible) {
            this.root.classList.remove('card--hidden');
        } else {
            this.root.classList.add('card--hidden');
        }
    }

    setInteractivity(
        interactivity: boolean
    ) {
        // Toggles any UI interactivity
        if (interactivity) {
            this.root.classList.remove('card--noninteractive');
        } else {
            this.root.classList.add('card--noninteractive');
        }
    }

    unload() {}
    async start() {}
}

export interface ClickableCardView extends CardView {
    addClickCallback: (callback: (e: MouseEvent) => void) => void
}

export interface DoneableCardView extends CardView {
    addDoneCallback: (callback: () => void) => void
}