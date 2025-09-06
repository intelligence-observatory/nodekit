import type {AssetManager} from "../asset-manager/asset-manager.ts";
import type {Board} from "../types/board.ts";
import type {PixelArea} from "../types/runtime-metrics.ts";
import type {Card} from "../types/cards/cards.ts";
import type {BoardLocation, BoardRectangle, CardId, SensorId, SpatialSize} from "../types/fields.ts";
import type {Sensor} from "../types/sensors/sensors.ts";
import type {Action} from "../types/sensors/actions/actions.ts";
import './board-view.css'
import type {CardView, ClickableCardView, DoneableCardView} from "./card-views/card-view.ts";
import {
    assertClickable,
    assertDoneable,
    ClickSensorBinding,
    DoneSensorBinding,
    KeyPressSensorBinding,
    type SensorBinding,
    TimeoutSensorBinding
} from "./sensor-bindings/sensor-binding.ts";
import {FixationPointCardView} from "./card-views/fixation-point/fixation-point-card-view.ts";
import {MarkdownPagesCardView} from "./card-views/markdown-pages/markdown-pages-card-view.ts";
import {ImageCardView} from "./card-views/image/image-card.ts";
import {TextCardView} from "./card-views/text/text-card-view.ts";
import {VideoCardView} from "./card-views/video/video-card.ts";

export class BoardCoordinateSystem {
    public boardWidthPx: number; // Width of the board in pixels
    public boardHeightPx: number; // Height of the board in pixels

    constructor(
        boardWidthPx: number,
        boardHeightPx: number,
    ) {
        // Initialize the board coordinate system with the given width and height in pixels
        this.boardWidthPx = boardWidthPx;
        this.boardHeightPx = boardHeightPx;
    }

    getUnitPx(): number {
        // Returns the size of one board unit in pixels
        return Math.min(this.boardWidthPx, this.boardHeightPx);
    }

    getBoardLocationPx(
        location: BoardLocation,
        rectangle: BoardRectangle,
    ) {
        // Returns the (left, top) coordinates of the given Board rectangle of size boardRectangle, with centroid located at boardLocation
        const unit = this.getUnitPx();
        const widthBoard = this.boardWidthPx / unit;
        const heightBoard = this.boardHeightPx / unit;
        const leftPx = unit * (location.x - rectangle.width / 2 + widthBoard / 2);
        const topPx = unit * (-location.y - rectangle.height / 2 + heightBoard / 2);

        return {
            leftPx: leftPx,
            topPx: topPx,
        }
    }

    getBoardRectanglePx(
        boardRectangle: BoardRectangle,
    ) {
        // Returns the (width, height) of the given Board rectangle in pixels
        return {
            widthPx: this.getSizePx(boardRectangle.width),
            heightPx: this.getSizePx(boardRectangle.height),
        }
    }

    getSizePx(boardSize: SpatialSize): number {
        // Returns the size of the given Board size in pixels
        return this.getUnitPx() * boardSize;
    }
}

export class BoardView {
    root: HTMLDivElement
    assetManager: AssetManager;

    cardViews: Map<CardId, CardView> = new Map(); // Map of card ID to CardView
    sensorBindings: Map<SensorId, SensorBinding> = new Map(); // Map of sensor ID to SensorBinding

    constructor(
        boardId: string,
        board: Board,
        assetManager: AssetManager,
    ) {
        this.root = document.createElement("div")
        this.root.className = 'board-view'
        this.root.id = `${boardId}`;
        this.root.style.width = board.board_width_px + 'px';
        this.root.style.height = board.board_height_px + 'px';
        this.assetManager = assetManager;

        // Clear and set
        this.reset()

        // Keep state off
        this.setState(false, false);
    }

    getCoordinateSystem(): BoardCoordinateSystem {
        const {width, height} = this.root.getBoundingClientRect();
        return new BoardCoordinateSystem(width, height);
    }

    reset() {
        // Perform unload operations for each card.
        this.cardViews.forEach(card => {
            card.unload();
        })
        // Removes all child elements on the boardDiv
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
    }

    setState(
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

    getArea(): PixelArea {
        return {
            width_px: this.root.offsetWidth,
            height_px: this.root.offsetHeight
        }
    }

    // Cards
    async placeCardHidden(card: Card) {
        const cardView = await placeCardHiddenDispatch(
            card,
            this,
        );

        // Register:
        this.cardViews.set(card.card_id, cardView);
    }

    public getCardView(cardId: CardId): CardView {
        const cardView = this.cardViews.get(cardId);
        if (!cardView) {
            throw new Error(`CardView with ID ${cardId} not found.`);
        }
        return cardView;
    }

    showCard(cardId: CardId) {
        const cardView = this.getCardView(cardId);
        cardView.setVisibility(true);
        cardView.start();
    }

    hideCard(cardId: CardId) {
        const cardView = this.getCardView(cardId);
        cardView.setVisibility(false);
    }

    // Sensors
    placeSensorUnarmed(
        sensor: Sensor,
        onSensorFired: (action: Action) => void,
    ) {
        const sensorBinding = placeSensorUnarmedDispatch(sensor, onSensorFired, this);
        // Attach the sensor binding to the board view
        this.sensorBindings.set(sensor.sensor_id, sensorBinding);
    }

    private getSensorBinding(sensorId: SensorId): SensorBinding {
        const sensorBinding = this.sensorBindings.get(sensorId);
        if (!sensorBinding) {
            throw new Error(`SensorBinding with ID ${sensorId} not found.`);
        }
        return sensorBinding;
    }

    armSensor(
        sensorId: SensorId,
    ) {
        const sensorBinding = this.getSensorBinding(sensorId);
        sensorBinding.arm()
    }

    disarmSensor(sensorId: SensorId) {
        const sensorBinding = this.getSensorBinding(sensorId);
        sensorBinding.disarm();
    }
}

// Dynamic dispatch:
export function placeSensorUnarmedDispatch(
    sensor: Sensor,
    onSensorFired: (action: Action) => void,
    boardView: BoardView,
): SensorBinding {

    // Dynamic dispatch for binding sensors to their targets
    const cardId = sensor.card_id;
    if (!cardId) {
        // This is a Board Sensor.

        if (sensor.sensor_type === 'TimeoutSensor') {
            return new TimeoutSensorBinding(
                sensor.sensor_id,
                onSensorFired,
                sensor.sensor_parameters.timeout_msec,
            );
        }
        else if (sensor.sensor_type === 'KeyPressSensor') {
            if (sensor.sensor_timespan.end_time_msec !== null) {
                throw new Error(`${sensor.sensor_type} must not have a defined end_time_msec`);
            }
            return new KeyPressSensorBinding(
                sensor.sensor_id,
                onSensorFired,
                sensor.sensor_parameters.keys,
            );
        }
        else {
            throw new Error(`${sensor.sensor_type} can't be bound to the board.`);
        }
    }

    // Sensor binds to a Card:
    const cardView = boardView.getCardView(cardId);

    switch (sensor.sensor_type) {
        case "ClickSensor":
            assertClickable(cardView); // Defensive runtime check
            return new ClickSensorBinding(
                sensor.sensor_id,
                onSensorFired,
                cardView as ClickableCardView,
                boardView,
            )
        case 'DoneSensor':
            assertDoneable(cardView); // Defensive runtime check

            return new DoneSensorBinding(
                sensor.sensor_id,
                onSensorFired,
                cardView as DoneableCardView,
            )
        default:
            const _never: never = sensor;
            throw new Error(`Unknown sensor type: ${_never}`);
    }
}


export async function placeCardHiddenDispatch(
    card: Card,
    boardView: BoardView,
): Promise<CardView> {
    // Dynamic dispatch
    let cardView: CardView | null = null;
    switch (card.card_type) {
        case "FixationPointCard":
            cardView = new FixationPointCardView(
                card, boardView
            )
            break
        case "MarkdownPagesCard":
            cardView = new MarkdownPagesCardView(
                card, boardView
            )
            break
        case "ImageCard":
            cardView = new ImageCardView(
                card,
                boardView,
            )
            break
        case "VideoCard":
            cardView = new VideoCardView(
                card,
                boardView
            );
            break
        case "TextCard":
            cardView = new TextCardView(
                card, boardView
            )
            break
        default:
            throw new Error(`Unsupported Card type: ${card}`);
    }

    await cardView.load();
    return cardView;
}