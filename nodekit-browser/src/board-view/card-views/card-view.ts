import {BoardView} from "../board-view.ts";
import './card-view.css';

import type {Card} from "../../types/cards";


export abstract class CardView {
    root: HTMLElement;
    public card: Card
    protected boardView: BoardView

    constructor(
        card: Card,
        boardView: BoardView,
    ) {
        // Create the Card's root element
        this.root = document.createElement('div');
        this.root.classList.add('card');
        this.root.id = card.card_id;

        // Attach
        this.card = card;
        this.boardView = boardView;

        // By default, not visible and not interactive
        this.setVisibility(false);
        this.setInteractivity(false);

        // Place
        this.place(boardView);
    }

    private place(boardView: BoardView): void {
        const boardCoords = boardView.getCoordinateSystem();
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

        // Place the Card on the Board:
        boardView.root.appendChild(this.root);
    }


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

    async load(){}
    unload() {}
    async start() {}
}

export interface ClickableCardView extends CardView {
    addClickCallback: (callback: (e: MouseEvent) => void) => void
}

export interface DoneableCardView extends CardView {
    addDoneCallback: (callback: () => void) => void
}