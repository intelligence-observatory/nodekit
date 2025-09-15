import './image-card.css'
import {CardView, type ClickableCardView} from "../card-view.ts";
import type {ImageCard} from "../../../types/cards";
import type {BoardView} from "../../board-view.ts";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */
export class ImageCardView extends CardView implements ClickableCardView {

    imageContainer!: HTMLDivElement;
    image!: HTMLImageElement;

    private readonly imageLoadedPromise: Promise<void>;

    constructor(
        card: ImageCard,
        boardView: BoardView,
    ) {
        super(card, boardView);
        this.imageContainer = document.createElement('div');
        this.imageContainer.classList.add('image-card');
        this.root.appendChild(this.imageContainer);

        //
        this.imageLoadedPromise = (async () => {
            this.image = await boardView.assetManager.getImage(
                card.image_identifier
            );                                        // throws on error

            this.image.classList.add('image-card__content');
            this.image.draggable = false; // Prevents dragging the image in the browser
            this.imageContainer.appendChild(this.image);
        })();
    }

    addClickCallback(callback: (e: MouseEvent) => void) {
        this.imageContainer.addEventListener('click', (e: MouseEvent) => {
            callback(e);
        });
    }

    async load() {
        return this.imageLoadedPromise
    }
}
