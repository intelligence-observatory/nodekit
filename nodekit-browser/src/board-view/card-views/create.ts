import type {Card} from "../../types/cards";
import {BoardView} from "../board-view.ts";
import {ImageCardView} from "./image/image-card-view.ts";
import {VideoCardView} from "./video/video-card-view.ts";
import {TextCardView} from "./text/text-card-view.ts";
import {type CardView, CompositeCardView} from "./base-card-view.ts";
import type {AssetManager} from "../../asset-manager";


export async function createCardView(
    card: Card,
    boardView: BoardView,
    assetManager: AssetManager,
): Promise<CardView> {

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
                card,
                boardCoords
            )
            break
        case "CompositeCard":
            // Instantiate all children
            const childPromises = Object.entries(card.children).map(
                async ([key, childCard]) => {
                    const childView = await createCardView(
                        childCard,
                        boardView,
                        assetManager,
                    );
                    return [key, childView] as const;
                },
            );

            // Await them all at once
            const resolvedEntries = await Promise.all(childPromises);

            const childViews: Record<string, CardView> =
                Object.fromEntries(resolvedEntries);
            cardView = new CompositeCardView(
                card,
                childViews,
            )
            break
        default:
            const _exhaustive: never = card;
            throw new Error(`Unsupported Card type: ${JSON.stringify(_exhaustive)}`);
    }

    // Mount CardView to BoardView:
    boardView.root.appendChild(cardView.root);
    await cardView.prepare(assetManager)
    return cardView
}