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

/**
 * A view of a region on the Board.
 */
export abstract class RegionView {
    root: HTMLElement;
    boardCoords: BoardCoordinateSystem

    private hoverable: boolean = false;

    private selectable: boolean = false;
    private selectionState: boolean = false;
    private subscriptions: ((selected:boolean) => void)[] = []

    constructor(
        region: Region,
        boardCoords: BoardCoordinateSystem,
    ) {
        // Create the Card's root element
        this.root = document.createElement('div');
        this.root.classList.add('board-region');
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

        switch (region.mask){
            case 'ellipse':
                this.root.style.borderRadius = '50%';
                break
            case 'rectangle':
                break
            default:
                const _exhaustive: never = region.mask
                console.warn(`Found unsupported Region.mask: ${JSON.stringify(_exhaustive)}`)
                break
        }

        if (typeof region.z_index === 'number') {
            this.root.style.zIndex = region.z_index.toString()
        }

        // Basic listeners
        this.root.addEventListener('pointerenter', () => {
            if (this.hoverable) {
                this.root.classList.add('hovered')
            }
        });

        this.root.addEventListener('pointerleave', () => {
            if (this.hoverable) {
                this.root.classList.remove('hovered')
            }
        });

        this.root.addEventListener('pointerdown', () => {
            if (!this.selectable) return;
            this.selectionState = !this.selectionState;

            if (this.selectionState) {
                this.root.classList.add('selected');
            } else {
                this.root.classList.remove('selected');
            }

            this.emit(this.selectionState);
        });
    }

    setHoverability(
        hoverable:boolean,
    ){
        this.hoverable = hoverable;
    }

    setSelectability(
        selectable:boolean,
    ){
        this.selectable = selectable;
    }

    subscribeSelections(callback: (selected:boolean)=>void){
        this.subscriptions.push(callback);
    }

    private emit(selected: boolean) {
        for (const fn of this.subscriptions) {
            try {
                fn(selected);
            } catch {}
        }
    }
}

export function checkPointInRegion(
    x: SpatialPoint,
    y: SpatialPoint,
    region: Region,
): boolean {
    switch (region.mask) {
        case 'rectangle':
            const left = region.x - region.w / 2;
            const right = region.x + region.w / 2;
            const top = region.y + region.h / 2;
            const bottom = region.y - region.h / 2;
            return (x >= left) &&
                (x <= right) &&
                (y >= bottom) &&
                (y <= top);
        case 'ellipse':
            const radius_x = region.w / 2;
            const radius_y = region.h / 2;
            const delta_x = x - region.x;
            const delta_y = y - region.y;

            return (
                (delta_x * delta_x) / (radius_x * radius_x) +
                (delta_y * delta_y) / (radius_y * radius_y) <=
                1
            );
        default:
            throw new Error(`Unknown mask: ${region.mask}`);
    }
}