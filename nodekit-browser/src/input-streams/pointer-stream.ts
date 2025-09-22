import type {SpatialPoint} from "../types/common.ts";

export interface PointerSample {
    sampleType: 'move' | 'down' | 'up'
    x: SpatialPoint // In Board convention units
    y: SpatialPoint
    domTimestamp: DOMHighResTimeStamp
}

export class PointerStream {

    subscriptions: ((sample: PointerSample)=>void)[] = []

    constructor(
        rootElement: HTMLDivElement,
    ){

    }

    subscribe(
        callback: (sample: PointerSample)=>void
    ): {unsubscribe: ()=>void} {
        // Todo: return unsubscribe function
        this.subscriptions.push(callback);
    }
}