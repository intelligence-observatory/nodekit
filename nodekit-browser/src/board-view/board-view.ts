import type {ColorHexString, PixelPoint, PixelSize} from "../types/values.ts";
import './board-view.css'
import {PointerStream} from "../input-streams/pointer-stream.ts";
import {KeyStream} from "../input-streams/key-stream.ts";
import {Clock} from "../clock.ts";
import type {Region} from "../types/region";


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
        return 1;
    }

    getBoardLocationPx(
        x: PixelPoint,
        y: PixelPoint,
        w: PixelSize,
        h: PixelSize,
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
        width: PixelSize,
        height: PixelSize,
    ) {
        // Returns the (width, height) of the given Board rectangle in pixels
        return {
            widthPx: this.getSizePx(width),
            heightPx: this.getSizePx(height),
        }
    }

    getSizePx(boardSize: PixelSize): number {
        // Returns the size of the given Board size in pixels
        return this.getUnitPx() * boardSize;
    }

    getBoardLocationFromPointerEvent(e: PointerEvent): {
        x: PixelPoint,
        y: PixelPoint,
    } {
        // Converts a MouseEvent's (clientX, clientY) to Board coordinates (x, y)
        let clickX = (e.clientX - this.boardLeftPx) / this.boardWidthPx - 0.5;
        let clickY = -((e.clientY - this.boardTopPx) / this.boardHeightPx - 0.5);

        // Standardize to integers:
        clickX = Math.round(clickX);
        clickY = Math.round(clickY)

        return {
            x: clickX as PixelPoint,
            y: clickY as PixelPoint
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
        clock: Clock,
    ) {
        this.root = document.createElement("div")
        this.root.className = 'board-view'

        // Set background color:
        this.root.style.backgroundColor = boardColor;

        // Set color of entire page:
        document.body.style.backgroundColor = boardColor;

        // Set streams
        this.clock = clock;
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

export function createRegionDiv(
    region: Region,
    boardCoords: BoardCoordinateSystem
): HTMLElement {
    // Create the Card's root element
    const root = document.createElement('div');
    root.classList.add('board-region');

    // Configure Card position and size:
    const {leftPx, topPx} = boardCoords.getBoardLocationPx(
        region.x,
        region.y,
        region.w,
        region.h
    )

    const {widthPx, heightPx} = boardCoords.getBoardRectanglePx(
        region.w,
        region.h
    );

    root.style.left = `${leftPx}px`;
    root.style.top = `${topPx}px`;
    root.style.width = `${widthPx}px`;
    root.style.height = `${heightPx}px`;

    switch (region.mask){
        case 'ellipse':
            root.style.borderRadius = '50%';
            break
        case 'rectangle':
            break
        default:
            const _exhaustive: never = region.mask
            console.warn(`Found unsupported Region.mask ${_exhaustive}. Region: ${JSON.stringify(region)}`)
            break
    }

    if (typeof region.z_index === 'number') {
        root.style.zIndex = region.z_index.toString()
    }
    return root
}