import type {Card} from "../types/cards";
import type {ColorHexString, SpatialPoint, SpatialSize} from "../types/common.ts";
import type {Sensor} from "../types/sensors";
import './board-view.css'
import type {CardView} from "./card-views/card-view.ts";
import {ClickSensorBinding, FreeTextEntrySensorBinding, KeySensorBinding, type SensorBinding, SliderSensorBinding} from "./sensor-bindings";
import {ImageCardView} from "./card-views/image/image-card.ts";
import {TextCardView} from "./card-views/text/text-card-view.ts";
import {VideoCardView} from "./card-views/video/video-card.ts";
import {PointerStream} from "../input-streams/pointer-stream.ts";
import {KeyStream} from "../input-streams/key-stream.ts";
import {Clock} from "../clock.ts";


export class BoardCoordinateSystem {
    public boardWidthPx: number; // Width of the board in pixels
    public boardHeightPx: number; // Height of the board in pixels
    public boardLeftPx: number;
    public boardTopPx: number;

    constructor(
        target: HTMLDivElement,
    ) {
        const {width, height, left, top} = target.getBoundingClientRect();
        // Initialize the board coordinate system with the given width and height in pixels
        this.boardWidthPx = width;
        this.boardHeightPx = height;
        this.boardLeftPx = left;
        this.boardTopPx = top;
    }

    getUnitPx(): number {
        // Returns the size of one board unit in pixels
        return Math.min(this.boardWidthPx, this.boardHeightPx);
    }

    getBoardLocationPx(
        x: SpatialPoint,
        y: SpatialPoint,
        w: SpatialSize,
        h: SpatialSize,
    ) {
        // Returns the (left, top) coordinates of the given Board rectangle of size boardRectangle, with centroid located at boardLocation
        const unit = this.getUnitPx();
        const widthBoard = this.boardWidthPx / unit;
        const heightBoard = this.boardHeightPx / unit;
        const leftPx = unit * (x - w / 2 + widthBoard / 2);
        const topPx = unit * (-y - h / 2 + heightBoard / 2);

        return {
            leftPx: leftPx,
            topPx: topPx,
        }
    }

    getBoardRectanglePx(
        width: SpatialSize,
        height: SpatialSize,
    ) {
        // Returns the (width, height) of the given Board rectangle in pixels
        return {
            widthPx: this.getSizePx(width),
            heightPx: this.getSizePx(height),
        }
    }

    getSizePx(boardSize: SpatialSize): number {
        // Returns the size of the given Board size in pixels
        return this.getUnitPx() * boardSize;
    }

    getBoardLocationFromPointerEvent(e: PointerEvent):{
        x: SpatialPoint,
        y: SpatialPoint,
    }{
        // Converts a MouseEvent's (clientX, clientY) to Board coordinates (x, y)
        let clickX = (e.clientX - this.boardLeftPx) / this.boardWidthPx - 0.5;
        let clickY = -((e.clientY - this.boardTopPx) / this.boardHeightPx - 0.5);

        // Standardize decimal places
        const precision = 10;
        clickX = parseFloat(clickX.toFixed(precision));
        clickY = parseFloat(clickY.toFixed(precision));

        return {
            x:clickX as SpatialPoint,
            y:clickY as SpatialPoint
        };
    }
}

/**
 * Represents a standardized display. Basically a wrapper over a <div>.
 */
export class BoardView {
    root: HTMLDivElement
    pointerStream: PointerStream;
    keyStream: KeyStream;
    clock: Clock;

    constructor(
        boardColor: ColorHexString,
    ) {
        this.root = document.createElement("div")
        this.root.className = 'board-view'

        // Set background color:
        this.root.style.backgroundColor = boardColor;

        // Set color of entire page:
        document.body.style.backgroundColor = boardColor;

        // Set streams
        this.clock=new Clock();
        this.pointerStream = new PointerStream(this.root, this.clock);
        this.keyStream = new KeyStream(this.clock);

        // Initialize state
        this.setBoardState(false, false);
    }

    getCoordinateSystem(): BoardCoordinateSystem {
        return new BoardCoordinateSystem(this.root);
    }

    setBoardState(
        visible: boolean,
        interactivity: boolean
    ) {

        // Set visibility
        if (visible) {
            this.root.style.opacity = '1';
        } else {
            this.root.style.opacity = '0';
        }

        // Set interactivity
        if (interactivity) {
            this.root.removeAttribute('disabled');
            this.root.style.pointerEvents = '';
            this.root.style.userSelect = '';
            this.root.style.opacity = '';
        } else {
            this.root.setAttribute('disabled', 'true');
            this.root.style.pointerEvents = 'none';
            this.root.style.userSelect = 'none';
        }
    }

}

export function createCardView(
    card: Card,
    boardView: BoardView,
): CardView{
    // Dynamic dispatch
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

    // If a z_index property is present in card, inject it manually here. // Todo this is hack
    if (typeof card.z_index ==='number'){
        cardView.root.style.zIndex = card.z_index.toString()
    }

    return cardView
}

export function createSensorBinding(
    sensor: Sensor,
    boardView: BoardView,
): SensorBinding {

    // Factory function for creating a SensorBinding
    let sensorBinding: SensorBinding | null = null;
    switch (sensor.sensor_type){
        case "KeySensor": {
            sensorBinding = new KeySensorBinding();
            break
        }
        case "ClickSensor": {
            sensorBinding = new ClickSensorBinding();
            break
        }
        case "SliderSensor": {
            sensorBinding = new SliderSensorBinding();
            break;
        }
        case "FreeTextEntrySensor":{
            sensorBinding = new FreeTextEntrySensorBinding();
            break
        }
        default: {
            const _exhaustive: never = sensor;
            throw new Error(`Unknown Sensor provided: ${JSON.stringify(_exhaustive)}`);
        }
    }

    sensorBinding.prepare(
        sensor,
        boardView,
    );
    return sensorBinding
}