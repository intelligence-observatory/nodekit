import type {SpatialPoint, TimeElapsedMsec} from "../types/common.ts";
import {BoardCoordinateSystem} from "../board-view/board-view.ts";
import type {Clock} from "../clock.ts";

type PointerSampleType = 'move' | 'down' | 'up';

export interface PointerSample {
    sampleType: PointerSampleType
    x: SpatialPoint // In Board convention units
    y: SpatialPoint
    t: TimeElapsedMsec
}

export class PointerStream {
    private target: HTMLDivElement;
    private boardCoordinateSystem: BoardCoordinateSystem
    private clock: Clock
    subscriptions: ((sample: PointerSample) => void)[] = []

    constructor(
        target: HTMLDivElement,
        clock: Clock,
    ) {
        this.target = target;
        this.clock = clock;

        // Set up coordinate system:
        this.boardCoordinateSystem = this.getCoordinateSystem();
        const updateCoordinateSystem = () => {
            this.boardCoordinateSystem = this.getCoordinateSystem();
        }
        window.addEventListener('resize', updateCoordinateSystem); // Update on resize
        let firstCall = false;

        // Attach event listener:
        let lastMoveFlush: DOMHighResTimeStamp = 0; // Last time we flushed move events
        const moveEventMaxSamplingHz = 30; // Sample move events at most this often

        // PointerEvent handler:
        const handlePointerEvent = (event: PointerEvent) => {
            // Short circuit if clock has not started
            if (!this.clock.checkStarted()) {
                return;
            }

            // Update coordinate system on first call:
            if (!firstCall) {
                this.boardCoordinateSystem = this.getCoordinateSystem();
                firstCall = true;
            }

            // Short circuit unless it's a move or a left-click down/up:
            let sampleType: PointerSampleType;
            switch (event.type) {
                case 'pointermove':
                    // If enough time hasn't elapsed since the last move flush, skip this event:
                    if (event.timeStamp - lastMoveFlush < 1000 / moveEventMaxSamplingHz) {
                        return;
                    }
                    sampleType = 'move';
                    lastMoveFlush = event.timeStamp;
                    break;
                case 'pointerdown':
                    if (event.button !== 0) { // Left button only
                        return;
                    }
                    sampleType = 'down';
                    break;
                case 'pointerup':
                    if (event.button !== 0) { // Left button only
                        return;
                    }
                    sampleType = 'up';
                    break;
                default:
                    return;
            }

            // Convert to Board Coordinates:
            const {x, y} = this.boardCoordinateSystem.getBoardLocationFromPointerEvent(event);

            // Emit to subscribers:
            const sample: PointerSample = {
                sampleType: sampleType,
                x: x,
                y: y,
                t: clock.now(),
            }
            this.subscriptions.forEach(cb => cb(sample));
        };

        // Attach to pointer events:
        this.target.addEventListener('pointermove', handlePointerEvent);
        this.target.addEventListener('pointerdown', handlePointerEvent);
        this.target.addEventListener('pointerup', handlePointerEvent);
    }

    private getCoordinateSystem(): BoardCoordinateSystem {
        return new BoardCoordinateSystem(this.target);
    }

    subscribe(
        callback: (sample: PointerSample) => void
    ): () => void {
        this.subscriptions.push(callback);
        return (() => {
                this.subscriptions = this.subscriptions.filter(cb => cb !== callback);
            }
        )
    }
}