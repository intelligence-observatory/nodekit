import type {ColorHexString, SpatialPoint, SpatialSize} from "../types/common.ts";
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

    getBoardLocationFromPointerEvent(e: PointerEvent): {
        x: SpatialPoint,
        y: SpatialPoint,
    } {
        // Converts a MouseEvent's (clientX, clientY) to Board coordinates (x, y)
        let clickX = (e.clientX - this.boardLeftPx) / this.boardWidthPx - 0.5;
        let clickY = -((e.clientY - this.boardTopPx) / this.boardHeightPx - 0.5);

        // Standardize decimal places
        const precision = 10;
        clickX = parseFloat(clickX.toFixed(precision));
        clickY = parseFloat(clickY.toFixed(precision));

        return {
            x: clickX as SpatialPoint,
            y: clickY as SpatialPoint
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
        this.clock = new Clock();
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

/**
 * A view of a region on the Board.
 */
export abstract class RegionView {
    root: HTMLElement;
    boardCoords: BoardCoordinateSystem

    constructor(
        region: Region,
        boardCoords: BoardCoordinateSystem,
    ) {
        // Create the Card's root element
        this.root = document.createElement('div');
        this.root.classList.add('card');
        this.boardCoords = boardCoords

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

        this.root.style.left = `${leftPx}px`;
        this.root.style.top = `${topPx}px`;
        this.root.style.width = `${widthPx}px`;
        this.root.style.height = `${heightPx}px`;

        const borderRadiusPercent = Math.min(1, Math.max(0, region.roundness)) * 50;
        this.root.style.borderRadius = `${borderRadiusPercent}%`;
        if (typeof region.z_index === 'number') {
            this.root.style.zIndex = region.z_index.toString()
        }
    }
}


export function checkPointInRegion(
    x: SpatialPoint,
    y: SpatialPoint,
    region: Region,
): boolean {
    const left = region.x - region.w / 2;
    const right = region.x + region.w / 2;
    const bottom = region.y - region.h / 2;
    const top = region.y + region.h / 2;

    // Map roundness -> CSS % (0..50), then -> per-corner radii in px.
    const r = Math.min(1, Math.max(0, region.roundness)); // clamp
    const rx = (region.w / 2) * r; // horizontal corner radius (percent resolves against width)
    const ry = (region.h / 2) * r; // vertical corner radius (percent resolves against height)

    // Fast path: no rounding => plain axis-aligned rectangle
    if (rx === 0 || ry === 0) {
        return x >= left && x <= right && y >= bottom && y <= top;
    }

    // Inner rectangle after shaving off corner radii
    const innerLeft = left + rx;
    const innerRight = right - rx;
    const innerBottom = bottom + ry;
    const innerTop = top - ry;

    // If inside the central cross (vertical or horizontal bands), it's in.
    if ((x >= innerLeft && x <= innerRight && y >= bottom && y <= top) ||
        (y >= innerBottom && y <= innerTop && x >= left && x <= right)) {
        return true;
    }

    // Otherwise, test against the appropriate corner ellipse.
    // Clamp to inner rect to find which corner center to use.
    const qx = x < innerLeft ? innerLeft : (x > innerRight ? innerRight : x);
    const qy = y < innerBottom ? innerBottom : (y > innerTop ? innerTop : y);

    // Corner center (ellipse center) is (qx, qy). Measure offset.
    const dx = x - qx;
    const dy = y - qy;

    // Elliptical corner test: (dx/rx)^2 + (dy/ry)^2 <= 1
    return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
}