import './image-card.css'
import {CardView} from "../card-view.ts";
import type {ImageCard} from "../../../types/cards";
import type {AssetManager} from "../../../asset-manager";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */
export class ImageCardView extends CardView<ImageCard> {

    imageContainer: HTMLDivElement | undefined;
    image: HTMLImageElement | undefined;

    async prepare(assetManager:AssetManager) {
        this.imageContainer = document.createElement('div');
        this.imageContainer.classList.add('image-card');
        this.root.appendChild(this.imageContainer);

        this.image = await assetManager.getImageElement(
            this.card.image
        );

        this.image.classList.add('image-card__content');
        this.image.draggable = false; // Prevents dragging the image in the browser
        this.imageContainer.appendChild(this.image);
    }
}
