import './slider-card-view.css'
import {CardView} from "../../card-views/card-view.ts";
import type {SliderSensor} from "../../../types/sensors";
import type {BoardView} from "../../board-view.ts";
import type {Roundness} from "../../../types/common.ts";
import type {SliderState} from "../../../types/actions";
import {SensorBinding} from "../index.ts";
import type {Region} from "../../../types/region";


// Slider:
export type SliderBinIndex = number // 0 to num_bins - 1
export type SliderNormalizedPosition = number // 0 to 1 (left to right, and bottom to top)

export type SliderSample = {
    sliderNormalizedPosition: SliderNormalizedPosition,
    binIndex: SliderBinIndex,
    domTimestamp: DOMHighResTimeStamp,
}

type SliderSubscriber = (sample: SliderSample) => void;


export interface SliderCard {
    num_bins: number;
    show_bin_markers: boolean;
    initial_bin_index: number;
    orientation: 'horizontal' | 'vertical';
    region: Region
}


export class SliderCardView extends CardView<SliderCard> {
    sliderContainer!: HTMLDivElement;
    sliderTrack!: HTMLDivElement;
    sliderThumb!: HTMLDivElement;

    private pendingThumbPosition: number | null = null;
    private rafId: number | null = null;
    private frameRequested: boolean = false;

    private currentBinIndex: SliderBinIndex | null = null;
    private binIndexToProportion!: (binIndex: SliderBinIndex) => number;
    private proportionToNearestBin!: (proportion: number) => SliderBinIndex;
    private subscribers: Set<SliderSubscriber> = new Set();
    private isDraggingThumb: boolean = false;

    async prepare() {

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
        if (this.card.orientation === 'horizontal') {
            this.sliderTrack.classList.add('slider-card__track--horizontal');
            this.sliderThumb.classList.add('slider-card__thumb--horizontal');
        } else {
            this.sliderTrack.classList.add('slider-card__track--vertical');
            this.sliderThumb.classList.add('slider-card__thumb--vertical');
        }

        this.root.appendChild(this.sliderContainer);

        // Calculate bin index to proportion function:
        this.binIndexToProportion = (binIndex: SliderBinIndex): number => {
            if (this.card.num_bins <= 1) return 0;
            return binIndex / (this.card.num_bins - 1);
        }

        // Calculate snap function:
        this.proportionToNearestBin = (proportion: number): SliderBinIndex => {
            if (this.card.num_bins <= 1) return 0;
            const exactBin = proportion * (this.card.num_bins - 1);
            return Math.round(exactBin);
        }

        // Draw ticks if needed:
        this.renderTicks();

        // Always initialize the thumb to the exact middle, even if num_bins is even:
        let initial = this.binIndexToProportion(this.card.initial_bin_index)
        if (isNaN(initial) || !isFinite(initial)) {
            initial = 0.5 // fallback
        }

        this.scheduleThumbMove(initial)

        // Add event listener for pointer down on the track:
        this.sliderTrack?.addEventListener('pointerdown', this.onClickTrack);

        // Add event listener for pointer down on the thumb:
        this.sliderThumb?.addEventListener('pointerdown', this.onPointerDownThumb);
        // Add event listener for pointer move and up on the document:
        document.addEventListener('pointermove', this.onPointerMoveDocument);

        // Add event listener for pointer up on the document:
        document.addEventListener('pointerup', (e) => {
            if (this.isDraggingThumb) {
                e.preventDefault();
                this.isDraggingThumb = false;

                // Remove CSS class to indicate
                this.sliderThumb.classList.remove('slider-card__thumb--active');

                // Release pointer capture:
                (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            }
        });
    }

    private renderTicks() {
        // Draw tick marks on the track if show_bin_markers is true
        if (!this.card.show_bin_markers) return;
        if (!this.sliderTrack) return;
        this.sliderTrack.querySelectorAll('.slider-card__track-tick').forEach(n => n.remove());

        const bins = this.card.num_bins;
        const isHorizontal = this.card.orientation === 'horizontal';

        // create all ticks in a fragment (fewer reflows)
        const frag = document.createDocumentFragment();

        for (let i = 0; i < bins; i++) {
            // SKip first and last ticks (they are the ends of the track)
            if (i === 0 || i === bins - 1) continue;

            // Calculate position:
            const pct = (i / (bins - 1)) * 100;

            const tick = document.createElement('div');
            tick.classList.add('slider-card__track-tick');

            // common: don’t block pointer events
            tick.style.pointerEvents = 'none';

            // Style
            const tickExtent = '75%'; // The length of the tick perpendicular to the track

            if (isHorizontal) {
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

    private onPointerDownThumb = (e: PointerEvent) => {
        e.preventDefault();
        this.isDraggingThumb = true;
        // Add CSS class to indicate dragging:
        this.sliderThumb.classList.add('slider-card__thumb--active');

        // Capture pointer to continue receiving events outside the thumb:
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    private onPointerMoveDocument = (e: PointerEvent) => {
        if (!this.isDraggingThumb) return;
        e.preventDefault();
        if (!this.sliderTrack) return;

        const rect = this.sliderTrack.getBoundingClientRect();
        let proportion: number;
        if (this.card.orientation === 'horizontal') {
            const x = e.clientX - rect.left;
            proportion = x / rect.width;
        } else {
            const y = e.clientY - rect.top;
            proportion = 1 - (y / rect.height); // Invert for vertical
        }
        proportion = Math.max(0, Math.min(1, proportion)); // Clamp between 0 and 1

        // Snap to nearest bin:
        const nearestBin = this.proportionToNearestBin(proportion);
        this.emitSliderChange(nearestBin);
        const snappedProportion = this.binIndexToProportion(nearestBin);

        this.scheduleThumbMove(snappedProportion);
    }

    private onClickTrack = (e: PointerEvent) => {
        e.preventDefault();
        if (!this.sliderTrack) return;

        const rect = this.sliderTrack.getBoundingClientRect();
        let proportion: number;
        if (this.card.orientation === 'horizontal') {
            const x = e.clientX - rect.left;
            proportion = x / rect.width;
        } else {
            const y = e.clientY - rect.top;
            proportion = 1 - (y / rect.height); // Invert for vertical
        }
        proportion = Math.max(0, Math.min(1, proportion)); // Clamp between 0 and 1

        // Snap to nearest bin:
        const nearestBin = this.proportionToNearestBin(proportion);
        this.emitSliderChange(nearestBin);
        const snappedProportion = this.binIndexToProportion(nearestBin);

        this.scheduleThumbMove(snappedProportion);

        // If we were dragging the thumb, stop dragging:
        if (this.isDraggingThumb) {
            this.isDraggingThumb = false;
            // Release pointer capture:
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);

            // Remove CSS class to indicate
            this.sliderThumb.classList.remove('slider-card__thumb--active');
        }
        // Otherwise, start a drag operation:
        else {
            this.isDraggingThumb = true;
            // Add CSS class to indicate
            this.sliderThumb.classList.add('slider-card__thumb--active');
            // Capture pointer to continue receiving events outside the thumb:
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }
    }

    private scheduleThumbMove(proportion: number) {
        // Requests that the thumb be moved to the given proportion (0 to 1) on the next animation frame.
        // Overrides any previously requested move.
        this.pendingThumbPosition = Math.max(0, Math.min(1, proportion)); // Clamp between 0 and 1

        if (!this.frameRequested) {
            this.frameRequested = true;
            this.rafId = requestAnimationFrame(() => {
                this.frameRequested = false;
                this.flushThumbUpdate();
            });
        }
    }

    private flushThumbUpdate() {
        if (this.pendingThumbPosition == null) {
            return
        }

        const thumbRect = this.sliderThumb.getBoundingClientRect();
        const sliderRect = this.sliderContainer.getBoundingClientRect();

        if (this.card.orientation === 'horizontal') {
            const left = this.pendingThumbPosition * (sliderRect.width - thumbRect.width);
            this.sliderThumb.style.left = `${left}px`;
        } else {
            // Reverse, as 100% is at the top for vertical:
            const top = sliderRect.height - thumbRect.height - this.pendingThumbPosition * (sliderRect.height - thumbRect.height);
            this.sliderThumb.style.top = `${top}px`;
        }

        this.pendingThumbPosition = null;
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
        this.sliderTrack?.removeEventListener('pointerdown', this.onClickTrack);
    }

    private emitSliderChange(binIndex: SliderBinIndex) {
        // Only emit if changed
        if (this.currentBinIndex === binIndex) return;
        this.currentBinIndex = binIndex;
        // Create sample
        const sample: SliderSample = {
            sliderNormalizedPosition: binIndex / (this.card.num_bins - 1),
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

    getCurrentNormalizedPosition(): SliderNormalizedPosition {
        if (this.currentBinIndex === null) {
            return this.binIndexToProportion(this.card.initial_bin_index);
        }
        return this.binIndexToProportion(this.currentBinIndex);
    }

    getCurrentBinIndex(): SliderBinIndex {
        if (this.currentBinIndex === null) {
            return this.card.initial_bin_index;
        }
        return this.currentBinIndex;
    }
}

export class SliderSensorBinding extends SensorBinding {
    prepare(
        sensor: SliderSensor,
        boardView: BoardView
    ) {
        // Wire in old SliderCard
        const sliderCard: SliderCard = {
            num_bins: sensor.num_bins,
            show_bin_markers: sensor.show_bin_markers,
            initial_bin_index: sensor.initial_bin_index,
            orientation: sensor.orientation,
            region: {
                x: sensor.x,
                y: sensor.y,
                w: sensor.w,
                h: sensor.h,
                z_index: sensor.z_index,
                roundness: 0 as Roundness,
            }
        }
        const sliderCardView = new SliderCardView(
            sliderCard,
            boardView.getCoordinateSystem()
        )

        sliderCardView.prepare()
        if (typeof sliderCard.region.z_index === 'number') {
            sliderCardView.root.style.zIndex = sliderCard.region.z_index.toString()
        }

        // Bind
        boardView.root.appendChild(sliderCardView.root)

        // Subscribe
        const sliderChangedCallback = (sliderSample: SliderSample): void => {
            const sliderValue: SliderState = {
                slider_normalized_position: sliderSample.sliderNormalizedPosition,
                slider_bin_index: sliderSample.binIndex
            }
            this.emit(sliderValue)
        }

        sliderCardView.subscribeToSlider(sliderChangedCallback)
    }
}