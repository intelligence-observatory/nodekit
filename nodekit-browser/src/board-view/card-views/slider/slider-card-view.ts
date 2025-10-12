import './slider-card-view.css'
import {CardView} from "../card-view.ts";
import type {SliderCard} from "../../../types/cards";

export class SliderCardView2 extends CardView<SliderCard> {
    sliderElement: HTMLInputElement | undefined;

    async prepare() {
        // Add a slider element to the root
        this.sliderElement = document.createElement('input');
        this.sliderElement.type = 'range';
        this.sliderElement.classList.add('slider-card');

        // Set the number of bins:
        this.sliderElement.min = '1';
        this.sliderElement.step = '1';
        this.sliderElement.max = (this.card.num_bins).toString();

        // Set orientation:
        if (this.card.orientation === 'horizontal')
            this.sliderElement.classList.add('slider-card--horizontal');
        else {
            this.sliderElement.classList.add('slider-card--vertical');
        }

        // Set initial value to middle bin
        const middleBin = (this.card.num_bins / 2);
        this.sliderElement.value = middleBin.toString();

        // Mount
        this.root.appendChild(this.sliderElement);
    }

    onStart() {
        // Set the card to interactive
        this.setInteractivity(true);
    }
}


// Slider:
type BinIndex = number // 0 to num_bins - 1
type BinSubscriber = (binIndex: BinIndex) => void;

export class SliderCardView extends CardView<SliderCard> {
    sliderContainer!: HTMLDivElement;
    sliderTrack!: HTMLDivElement;
    sliderThumb!: HTMLDivElement;

    private pendingThumbPosition: number | null = null;
    private rafId: number | null = null;
    private frameRequested: boolean = false;

    private currentBinIndex: BinIndex | null = null;
    private binIndexToProportion!: (binIndex: BinIndex) => number;
    private proportionToNearestBin!: (proportion: number) => BinIndex;
    private binChangeSubscribers: Set<BinSubscriber> = new Set();
    private isDraggingThumb: boolean = false;

    async prepare() {

        // Make container
        this.sliderContainer = document.createElement('div');
        this.sliderContainer.classList.add('slider-card');

        // Make track:
        this.sliderTrack = document.createElement('div');
        this.sliderTrack.classList.add('slider-card__track');
        this.sliderContainer.appendChild(this.sliderTrack);
        this.sliderTrack.style.backgroundColor = this.card.track_color;

        // Make thumb:
        this.sliderThumb = document.createElement('div');
        this.sliderThumb.classList.add('slider-card__thumb');
        this.sliderContainer.appendChild(this.sliderThumb);
        this.sliderThumb.style.backgroundColor = this.card.thumb_color;

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
        this.binIndexToProportion = (binIndex: BinIndex): number => {
            if (this.card.num_bins <= 1) return 0;
            return binIndex / (this.card.num_bins - 1);
        }

        // Calculate snap function:
        this.proportionToNearestBin = (proportion: number): BinIndex => {
            if (this.card.num_bins <= 1) return 0;
            const exactBin = proportion * (this.card.num_bins - 1);
            return Math.round(exactBin);
        }

        // Always initialize the thumb to the exact middle, even if num_bins is even:
        this.scheduleThumbMove(0.5)

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
        this.emitBinChange(nearestBin);
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
        this.emitBinChange(nearestBin);
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
            const top = sliderRect.height - thumbRect.height - this.pendingThumbPosition * (sliderRect.height - thumbRect.height);;
            this.sliderThumb.style.top = `${top}px`;
        }

        this.pendingThumbPosition = null;
    }


    onStart() {
        // Set the card to interactive
        this.setInteractivity(true);
    }

    onStop() {

        // Set the card to non-interactive
        this.setInteractivity(false);
        // Cancel any pending animation frame
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
            this.frameRequested = false;
            this.pendingThumbPosition = null;
        }
    }

    onDestroy() {
        super.onDestroy();

        // Remove event listeners
        this.sliderTrack?.removeEventListener('pointerdown', this.onClickTrack);
    }

    private emitBinChange(binIndex: BinIndex) {
        // Only emit if changed
        if (this.currentBinIndex === binIndex) return;
        this.currentBinIndex = binIndex;
        console.log(binIndex)
        // Emit to all subscribers
        for (let callback of this.binChangeSubscribers) {
            callback(binIndex);
        }
    }

    public subscribeToBinChanges(callback: BinSubscriber) {
        // Add to subscribers
        this.binChangeSubscribers.add(callback);
    }
}