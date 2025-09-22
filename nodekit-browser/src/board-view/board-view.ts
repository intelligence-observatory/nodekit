import type {AssetManager} from "../asset-manager";
import type {Board} from "../types/board";
import type {Card} from "../types/cards";
import type {SpatialPoint, SpatialSize} from "../types/common.ts";
import type {Sensor} from "../types/sensors";
import type {Action} from "../types/actions";
import './board-view.css'
import type {CardView} from "./card-views/card-view.ts";
import {ClickSensorBinding, KeySensorBinding, type SensorBinding, TimeoutSensorBinding} from "./sensor-bindings/sensor-binding.ts";
import {ImageCardView} from "./card-views/image/image-card.ts";
import {TextCardView} from "./card-views/text/text-card-view.ts";
import {VideoCardView} from "./card-views/video/video-card.ts";
import {PointerStream} from "../input-streams/pointer-stream.ts";

type CardViewId = string & { __brand: 'CardViewId' };


export type SensorBindingId = string & { __brand: 'SensorBindingId' };

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

export class BoardView {
    root: HTMLDivElement
    cardViews: Map<CardViewId, CardView> = new Map(); // Map of card ID to CardView
    sensorBindings: Map<SensorBindingId, SensorBinding> = new Map(); // Map of sensor ID to SensorBinding
    private pointerStream: PointerStream

    constructor(
        boardId: string,
        board: Board,
    ) {
        this.root = document.createElement("div")
        this.root.className = 'board-view'
        this.root.id = `${boardId}`;
        this.root.style.width = board.board_width_px + 'px';
        this.root.style.height = board.board_height_px + 'px';
        this.root.style.backgroundColor = board.background_color;

        this.setBoardState(false, false);

        this.pointerStream = new PointerStream(this.root);
    }

    getCoordinateSystem(): BoardCoordinateSystem {
        return new BoardCoordinateSystem(this.root);
    }

    reset() {
        // Removes all child elements on the boardDiv
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
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

    private getCardView(cardId: CardViewId): CardView {
        const cardView = this.cardViews.get(cardId);
        if (!cardView) {
            throw new Error(`CardView with ID ${cardId} not found.`);
        }
        return cardView;
    }

    async prepareCard(
        card: Card,
        assetManager: AssetManager,
    ): Promise<CardViewId> {
        // Dynamic dispatch
        const boardCoords = this.getCoordinateSystem();
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
                throw new Error(`Unsupported Card type: ${card}`);
        }

        // Load all Card resources:
        await cardView.prepare(assetManager);

        // Mount CardView to BoardView:
        this.root.appendChild(cardView.root);

        // Issue a new CardViewId:
        const cardId = crypto.randomUUID() as CardViewId;
        this.cardViews.set(cardId, cardView);
        return cardId
    }

    startCard(cardId: CardViewId) {
        // Show and start the CardView
        const cardView = this.getCardView(cardId);
        cardView.setVisibility(true);
        cardView.onStart();
    }

    stopCard(cardId: CardViewId) {
        // Hide and stop the CardView
        const cardView = this.getCardView(cardId);
        cardView.setVisibility(false);
        cardView.onStop();
    }

    destroyCard(cardId: CardViewId) {
        // Unload and remove the CardView
        const cardView = this.getCardView(cardId);
        cardView.onDestroy();
        this.root.removeChild(cardView.root);
        this.cardViews.delete(cardId);
    }

    private getSensorBinding(sensorBindingId: SensorBindingId): SensorBinding {
        const sensorBinding = this.sensorBindings.get(sensorBindingId);
        if (!sensorBinding) {
            throw new Error(`SensorBinding with ID ${sensorBindingId} not found.`);
        }
        return sensorBinding;
    }

    prepareSensor(
        sensor: Sensor,
        onSensorFired: (action: Action, domTimestampAction: DOMHighResTimeStamp) => void,
    ): SensorBindingId {

        // Dynamic dispatch for initializing SensorBinding from Sensor
        let sensorBinding: SensorBinding | null = null;
        if (sensor.sensor_type === 'TimeoutSensor') {
            sensorBinding = new TimeoutSensorBinding(
                onSensorFired,
            );
        }
        else if (sensor.sensor_type === 'KeySensor') {
            sensorBinding = new KeySensorBinding(
                onSensorFired,
                sensor.key,
            );
        }
        else if (sensor.sensor_type == "ClickSensor"){
            sensorBinding = new ClickSensorBinding(
                sensor.x,
                sensor.y,
                sensor.w,
                sensor.h,
                sensor.mask,
                onSensorFired,
                this.pointerStream,
            )
        }
        else {
            throw new Error(`Unknown Sensor provided: ${sensor}`);
        }
        // Issue a new SensorBindingId (a UUID):
        const sensorBindingId = crypto.randomUUID() as SensorBindingId;
        this.sensorBindings.set(sensorBindingId, sensorBinding);
        return sensorBindingId
    }

    startSensor(
        sensorBindingId: SensorBindingId,
    ) {
        const sensorBinding = this.getSensorBinding(sensorBindingId);
        sensorBinding.arm()
    }

    destroySensor(sensorBindingId: SensorBindingId) {
        const sensorBinding = this.getSensorBinding(sensorBindingId);
        if (!sensorBinding) {
            return
        }
        sensorBinding.destroy();
        this.sensorBindings.delete(sensorBindingId);
    }
}
