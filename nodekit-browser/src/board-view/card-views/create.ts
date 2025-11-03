import type {Card} from "../../types/cards";
import {BoardView} from "../board-view.ts";
import {ImageCardView} from "./image/image-card-view.ts";
import {VideoCardView} from "./video/video-card-view.ts";
import {TextCardView} from "./text/text-card-view.ts";
import {CardView} from "./card-view.ts";


export function createCardView(
    card: Card,
    boardView: BoardView,
): CardView {

    const boardCoords = boardView.getCoordinateSystem();
    let cardView: CardView | null = null;
    switch (card.card_type) {
        case "ImageCard":
            cardView = new ImageCardView(
                card,
                boardCoords,
            )
            break
        case "VideoCard":
            cardView = new VideoCardView(
                card,
                boardCoords
            );
            break
        case "TextCard":
            cardView = new TextCardView(
                card, boardCoords
            )
            break
        default:
            throw new Error(`Unsupported Card type: ${JSON.stringify(card)}`);
    }

    // Mount CardView to BoardView:
    boardView.root.appendChild(cardView.root);

    return cardView
}