import './image-card.css'
import {CardView, type ClickableCardView} from "../card-view.ts";
import type {ImageCard} from "../../../types/cards";
import type {AssetManager} from "../../../asset-manager/asset-manager.ts";

/**
 * A card which displays left-justified Markdown text on a light background.
 * Offers a scrollbar if the content is too long.
 */
export class ImageCardView extends CardView<ImageCard> implements ClickableCardView {

    imageContainer: HTMLDivElement | undefined;
    image: HTMLImageElement | undefined;

    addClickCallback(callback: (e: MouseEvent) => void) {
        if (!this.imageContainer) {
            throw new Error('Image container not initialized. Did you forget to call load()?');
        }

        this.imageContainer.addEventListener('click', (e: MouseEvent) => {
            callback(e);
        });
    }

    async load(assetManager:AssetManager) {
        this.imageContainer = document.createElement('div');
        this.imageContainer.classList.add('image-card');
        this.root.appendChild(this.imageContainer);

        this.image = await assetManager.getImage(
            this.card.image_identifier
        );

        this.image.classList.add('image-card__content');
        this.image.draggable = false; // Prevents dragging the image in the browser
        this.imageContainer.appendChild(this.image);
    }
}
