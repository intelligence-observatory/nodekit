import './card-view.css'

import type {Card, CompositeCard, LeafCard} from "../../types/cards";
import {type BoardCoordinateSystem, createRegionDiv} from "../board-view.ts";
import type {AssetManager} from "../../asset-manager";
import type {SpatialPoint} from "../../types/value.ts";

export abstract class BaseCardView<C extends Card = Card>{
    card: C
    root: HTMLElement;
    hoverable: boolean = false;
    protected constructor(
        card: C,
        root: HTMLElement,
    ){
        this.card = card;
        this.root = root;
    }
    abstract prepare(_assetManager:AssetManager): Promise<void>;
    onStart(): void {}
    onDestroy(): void {}

    setHoverable(isHoverable: boolean):void{
        this.hoverable = isHoverable;
    }



    abstract setHoverState(hovered:boolean):void
    abstract setSelectedState(selected:boolean):void
    abstract setOpacity(opacity:number):void

    abstract checkPointInCard(
        x: SpatialPoint,
        y: SpatialPoint,
    ): boolean
}


export abstract class LeafCardView<C extends LeafCard = LeafCard> extends BaseCardView<C>{
    boardCoords: BoardCoordinateSystem
    constructor(
        card: C,
        boardCoords: BoardCoordinateSystem,
    ) {

        // If a leaf Card, instantiate the root as a region div:
        const root = createRegionDiv(card.region, boardCoords);
        super(card, root)
        this.boardCoords = boardCoords;
    }

    setHoverable(isHoverable:boolean){

    }
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

    checkPointInCard(
        x: SpatialPoint,
        y: SpatialPoint,
    ): boolean{
        const region = this.card.region;
        switch (region.mask) {
            case 'rectangle':
                const left = region.x - region.w / 2;
                const right = region.x + region.w / 2;
                const top = region.y + region.h / 2;
                const bottom = region.y - region.h / 2;
                return (x >= left) &&
                    (x <= right) &&
                    (y >= bottom) &&
                    (y <= top);
            case 'ellipse':
                const radius_x = region.w / 2;
                const radius_y = region.h / 2;
                const delta_x = x - region.x;
                const delta_y = y - region.y;

                return (
                    (delta_x * delta_x) / (radius_x * radius_x) +
                    (delta_y * delta_y) / (radius_y * radius_y) <=
                    1
                );
            default:
                throw new Error(`Unknown mask: ${region.mask}`);
        }
    }
}

export class CompositeCardView extends BaseCardView<CompositeCard>{
    private childViews:Record<string, CardView>

    constructor(
        card: CompositeCard,
        childViews: Record<string, CardView>
    ){
        const root = document.createElement('div')
        super(card, root)
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
    setHoverState(hovered:boolean):void{
        for (const cardView of Object.values(this.childViews)) {
            cardView.setHoverState(hovered);
        }
    }
    setSelectedState(selected:boolean):void{
        for (const cardView of Object.values(this.childViews)) {
            cardView.setSelectedState(selected);
        }

    }
    setOpacity(opacity:number):void{
        for (const cardView of Object.values(this.childViews)) {
            cardView.setOpacity(opacity);
        }

    }

    checkPointInCard(
        x: SpatialPoint,
        y: SpatialPoint
    ): boolean {
        for (const cardView of Object.values(this.childViews)){
            let inside = cardView.checkPointInCard(x, y)
            if (inside){
                return true
            }
        }
        return false
    }
}

export type CardView = CompositeCardView | LeafCardView