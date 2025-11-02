
import type {Card} from "../../types/cards";
import {type BoardCoordinateSystem, RegionView} from "../board-view.ts";
import type {AssetManager} from "../../asset-manager";


export abstract class CardView<C extends Card = Card> extends RegionView{
    card: C

    constructor(
        card: C,
        boardCoords: BoardCoordinateSystem,
    ) {
        super(card.region, boardCoords)
        this.card = card;
    }

    abstract prepare(_assetManager:AssetManager): Promise<void>;
    onStart(): void {}
    onDestroy(): void {}
}

