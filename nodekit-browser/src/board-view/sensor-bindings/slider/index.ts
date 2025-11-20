import './slider.css'
import type {SliderSensor} from "../../../types/sensors";
import {BoardCoordinateSystem, type BoardView, RegionView} from "../../board-view.ts";
import type {SliderAction} from "../../../types/actions";
import {SensorBinding} from "../index.ts";


export type SliderBinIndex = number & { __brand: 'SliderBinIndex' };// 0 to num_bins - 1
export type SliderNormalizedPosition = number & { __brand: 'SliderNormalizedPosition' };// 0 to 1 (left to right, and bottom to top)

export type SliderSample = {
    sliderNormalizedPosition: SliderNormalizedPosition,
    binIndex: SliderBinIndex,
    domTimestamp: DOMHighResTimeStamp,
}

type SliderSubscriber = (sample: SliderSample) => void;

/**
 *
 */
export class SliderSensorBinding extends SensorBinding<SliderSensor> {
    prepare(
        boardView: BoardView
    ) {
        const sliderCardView = new SliderSensorView(
            this.sensor,
            boardView.getCoordinateSystem()
        )

        // Bind
        boardView.root.appendChild(sliderCardView.root)

        // Subscribe
        const sliderChangedCallback = (sliderSample: SliderSample): void => {
            const sliderValue: SliderAction = {
                t: boardView.clock.now(),
                action_type: 'SliderAction',
                bin_index: sliderSample.binIndex
            }
            this.emit(sliderValue)
        }

        sliderCardView.subscribeToSlider(sliderChangedCallback)
    }
}

/**
 *
 */
export class SliderSensorView extends RegionView {
    sliderContainer: HTMLDivElement;
    sliderTrack: HTMLDivElement;
    sliderThumb: HTMLDivElement;

    private sensor: SliderSensor
    private pendingThumbPosition: SliderNormalizedPosition | null = null;
    private rafId: number | null = null;
    private frameRequested: boolean = false;

    private currentBinIndex: SliderBinIndex | null = null;
    private binIndexToProportion: (binIndex: SliderBinIndex) => number;
    private subscribers: Set<SliderSubscriber> = new Set();
    private isDraggingThumb: boolean = false;

    constructor(
        sensor: SliderSensor,
        boardCoords: BoardCoordinateSystem,
    ){
        super(sensor.region, boardCoords);
        this.sensor=sensor;

        // Make container
        this.sliderContainer = document.createElement('div');
        this.sliderContainer.classList.add('slider-card');

        // Make track:
        this.sliderTrack = document.createElement('div');
        this.sliderTrack.classList.add('slider-card__track');
        this.sliderContainer.appendChild(this.sliderTrack);

        // Make thumb:
        this.sliderThumb = document.createElement('div');
        this.sliderThumb.classList.add('slider-card__thumb');
        this.sliderContainer.appendChild(this.sliderThumb);

        // Set orientation:
        if (sensor.orientation === 'horizontal') {
            this.sliderTrack.classList.add('slider-card__track--horizontal');
            this.sliderThumb.classList.add('slider-card__thumb--horizontal');
        } else {
            this.sliderTrack.classList.add('slider-card__track--vertical');
            this.sliderThumb.classList.add('slider-card__thumb--vertical');
        }

        this.root.appendChild(this.sliderContainer);

        // Calculate bin index to proportion function:
        this.binIndexToProportion = (binIndex: SliderBinIndex): number => {
            if (sensor.num_bins <= 1) return 0;
            return binIndex / (sensor.num_bins - 1);
        }

        // Draw ticks if needed:
        this.renderTicks();
        this.setThumbVisualState('uncommitted')
        this.scheduleThumbMove(sensor.initial_bin_index)

        // Add event listeners:
        this.sliderTrack.addEventListener('pointerdown', this.onClickTrack);
        this.sliderThumb.addEventListener('pointerdown', this.onPointerDownThumb);
        document.addEventListener('pointermove', this.onPointerMoveDocument);
        document.addEventListener('pointerup', this.onPointerUpDocument);
    }

    private renderTicks() {
        const sensor = this.sensor;
        if (!sensor.show_bin_markers) return;

        // Remove existing ticks
        this.sliderTrack.querySelectorAll('.slider-card__track-tick').forEach(n => n.remove());

        const num_bins = sensor.num_bins;

        // create all ticks in a fragment (fewer reflows)
        const frag = document.createDocumentFragment();

        // The ticks will span w_track - w_thumb, starting at w_thumb/2.
        const horizontal = sensor.orientation === 'horizontal';
        const trackLengthPixels = Math.max(1, horizontal? this.boardCoords.getSizePx(sensor.region.w) : this.boardCoords.getSizePx(sensor.region.h));

        // Thumb extent along the axis (px). Fallback to 0 if unknown.
        const thumbExtentPixels = 8;
        const startOffsetPixels = Math.max(0, thumbExtentPixels / 2);
        const innerLengthPixels = Math.max(0, trackLengthPixels - thumbExtentPixels);


        for (let i = 0; i < num_bins; i++) {
            // Skip first and last ticks (they are the ends of the track)
            if (i === 0 || i === num_bins - 1) continue;

            // Calculate position:
            const positionPixels = startOffsetPixels + (i * innerLengthPixels / (num_bins - 1))
            //const pct = (i / (num_bins - 1)) * 100;
            const pct = (positionPixels / trackLengthPixels) * 100
            const tick = document.createElement('div');
            tick.classList.add('slider-card__track-tick');

            // Ticks should not block pointer events:
            tick.style.pointerEvents = 'none';

            // Style
            const tickExtent = '75%'; // The length of the tick perpendicular to the track

            if (sensor.orientation === 'horizontal') {
                // vertical hairline centered on the track
                tick.style.width = '1px';           // hairline; adjust if you want 0.5px on WebKit
                tick.style.height = tickExtent;         // match track thickness
                tick.style.left = `${pct}%`;
                tick.style.top = '50%';
                tick.style.transform = 'translate(-50%, -50%)';
            } else {
                // horizontal hairline centered on the track
                tick.style.width = tickExtent;
                tick.style.height = '1px';
                tick.style.top = `${pct}%`;
                tick.style.left = '50%';
                tick.style.transform = 'translate(-50%, -50%)';
            }

            frag.appendChild(tick);
        }
        this.sliderTrack.appendChild(frag);
    }

    // Rendering functions
    private setThumbVisualState(
        thumbState: 'dragging' | 'committed' | 'uncommitted',
    ){
        const activeCssClassName = 'slider-card__thumb--active'
        const uncommittedCssClassName = 'slider-card__thumb--uncommitted'
        switch(thumbState){
            case 'dragging':
                this.sliderThumb.classList.add(activeCssClassName);
                this.sliderThumb.classList.remove(uncommittedCssClassName);
                return
            case 'committed':
                this.sliderThumb.classList.remove(activeCssClassName);
                this.sliderThumb.classList.remove(uncommittedCssClassName);
                return
            case 'uncommitted':
                this.sliderThumb.classList.remove(activeCssClassName);
                this.sliderThumb.classList.add(uncommittedCssClassName);
                return
            default:
                return
        }
    }

    private scheduleThumbMove(binIndex: SliderBinIndex) {
        // Requests that the thumb be moved to the given proportion (0 to 1) on the next animation frame.
        // Overrides any previously requested move.
        const proportion = this.binIndexToProportion(binIndex);
        this.pendingThumbPosition = Math.max(0, Math.min(1, proportion)) as SliderNormalizedPosition; // Clamp between 0 and 1

        if (!this.frameRequested) {
            this.frameRequested = true;
            this.rafId = requestAnimationFrame(() => {
                this.frameRequested = false;
                this.flushThumbVisualUpdate();
            });
        }
    }

    private flushThumbVisualUpdate() {
        if (this.pendingThumbPosition == null) {
            return
        }

        const thumbRect = this.sliderThumb.getBoundingClientRect();
        const sliderRect = this.sliderContainer.getBoundingClientRect();

        if (this.sensor.orientation === 'horizontal') {
            const left = this.pendingThumbPosition * (sliderRect.width - thumbRect.width);
            this.sliderThumb.style.left = `${left}px`;
        } else {
            const top = sliderRect.height - thumbRect.height - this.pendingThumbPosition * (sliderRect.height - thumbRect.height);
            this.sliderThumb.style.top = `${top}px`;
        }

        this.pendingThumbPosition = null;
    }

    private calculateNearestBin(e: PointerEvent): SliderBinIndex{
        // Short circuit
        if (this.sensor.num_bins <= 1) return 0 as SliderBinIndex;

        const rect = this.sliderTrack.getBoundingClientRect();
        let proportion: number;
        switch(this.sensor.orientation){
            case 'horizontal':
                const x = e.clientX - rect.left;
                proportion = x / rect.width;
                break
            case 'vertical':
                const y = e.clientY - rect.top;
                proportion = 1 - (y / rect.height); // Invert for vertical
                break
            default:
                const _exhaustive: never = this.sensor.orientation;
                throw new Error(`Unsupported SliderSensor.orientation found ${JSON.stringify(_exhaustive)}`)
        }

        proportion = Math.max(0, Math.min(1, proportion)); // Clamp between 0 and 1

        const exactBin = proportion * (this.sensor.num_bins - 1);
        return Math.round(exactBin) as SliderBinIndex;
    }

    private onPointerDownThumb = (e: PointerEvent) => {
        e.preventDefault();
        this.isDraggingThumb = true;
        this.setThumbVisualState('dragging');

        // Capture pointer to continue receiving events outside the thumb:
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    private onPointerUpDocument = (e:PointerEvent) => {
        if (this.isDraggingThumb) {
            e.preventDefault();
            this.isDraggingThumb = false;

            // Remove CSS class to indicate
            const nearestBin=this.calculateNearestBin(e);
            this.currentBinIndex = nearestBin;
            this.scheduleThumbMove(nearestBin);
            this.setThumbVisualState('committed');

            // Release pointer capture:
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);

            // Emit slider value on pointer up:
            this.emitSliderValue();
        }
    }
    private onPointerMoveDocument = (e: PointerEvent) => {
        if (!this.isDraggingThumb) return;
        e.preventDefault();

        const nearestBin=this.calculateNearestBin(e);
        this.currentBinIndex = nearestBin;
        this.scheduleThumbMove(nearestBin);
    }

    private onClickTrack = (e: PointerEvent) => {
        e.preventDefault();

        // Snap to nearest bin:
        const nearestBin = this.calculateNearestBin(e);
        this.currentBinIndex = nearestBin;
        this.scheduleThumbMove(nearestBin);

        // If the thumb was being dragged, stop dragging:
        if (this.isDraggingThumb) {
            this.isDraggingThumb = false;
            // Release pointer capture:
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);

            // Remove CSS class to indicate
            this.setThumbVisualState('committed')
        }
        // Otherwise, start a drag operation:
        else {
            this.isDraggingThumb = true;
            // Add CSS class to indicate
            this.setThumbVisualState('dragging');
            // Capture pointer to continue receiving events outside the thumb:
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }
    }

    onDestroy() {
        // Cancel any pending animation frame
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
            this.frameRequested = false;
            this.pendingThumbPosition = null;
        }
        // Remove event listeners
        this.sliderTrack.removeEventListener('pointerdown', this.onClickTrack);
    }

    private emitSliderValue() {
        // Only emit if not null
        if (this.currentBinIndex==null) return;
        const binIndex = this.currentBinIndex ;
        // Create sample
        const sample: SliderSample = {
            sliderNormalizedPosition: binIndex / (this.sensor.num_bins - 1) as SliderNormalizedPosition,
            binIndex: binIndex,
            domTimestamp: performance.now(),
        }

        // Emit to all subscribers
        for (let callback of this.subscribers) {
            callback(sample);
        }
    }

    public subscribeToSlider(callback: SliderSubscriber) {
        // Add to subscribers
        this.subscribers.add(callback);
    }
}
