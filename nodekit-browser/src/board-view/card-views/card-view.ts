import './card-view.css'

import type {Card} from "../../types/cards";
import {type BoardCoordinateSystem, createRegionDiv} from "../board-view.ts";
import type {AssetManager} from "../../asset-manager";


export abstract class CardView<C extends Card = Card>{
    root: HTMLElement;
    boardCoords: BoardCoordinateSystem
    card: C

    constructor(
        card: C,
        boardCoords: BoardCoordinateSystem,
    ) {
        this.root = createRegionDiv(card.region, boardCoords);
        this.boardCoords = boardCoords;
        this.card = card;
    }

    abstract prepare(_assetManager:AssetManager): Promise<void>;
    onStart(): void {}
    onDestroy(): void {}

    setHoverState(
        hovered:boolean,
    ){
        if (hovered){
            this.root.classList.add('card--hovered')
        }
        else{
            this.root.classList.remove('card--hovered')
        }
    }

    setSelectedState(
        selected:boolean,
    ){
        if (selected){
            this.root.classList.add('card--selected')
        }
        else{
            this.root.classList.remove('card--selected')
        }
    }

    setOpacity(opacity:number){
        // Between 0 and 1
        this.root.style.opacity = `${Math.min(1, Math.max(0, opacity))*100}%`
    }
}

