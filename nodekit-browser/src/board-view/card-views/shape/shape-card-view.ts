import './shape-card-view.css'
import type {ShapeCard} from "../../../types/cards";
import {CardView} from "../card-view.ts";

/**
 * A card which consists of a shape filled with a customizable color.
 */
export class ShapeCardView extends CardView<ShapeCard> {

    async prepare(){

        let shapeElement: HTMLElement;
        if (this.card.shape == 'rectangle'){
            // Create a rectangle which fills the card
            shapeElement = document.createElement('div');
            shapeElement.style.position = 'absolute';
            shapeElement.style.top = '0';
            shapeElement.style.left = '0';
            shapeElement.style.width = '100%';
            shapeElement.style.height = '100%';
        }
        else if (this.card.shape == 'ellipse'){
            // Create an ellipse which fills the card
            shapeElement = document.createElement('div');
            shapeElement.style.position = 'absolute';
            shapeElement.style.top = '0';
            shapeElement.style.left = '0';
            shapeElement.style.width = '100%';
            shapeElement.style.height = '100%';
            shapeElement.style.borderRadius = '50%';
        }
        else {
            throw new Error(`Unknown shape given: ${this.card.shape}`);
        }
        shapeElement.style.backgroundColor = this.card.color;

        // Attach to the root
        this.root.appendChild(shapeElement);
    }
}
