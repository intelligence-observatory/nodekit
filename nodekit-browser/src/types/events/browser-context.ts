import type {BaseEvent} from "./index.ts";
import type {PixelSize} from "../common.ts";


interface RegionSizePx {
    width_px: PixelSize,
    height_px: PixelSize
}

export interface BrowserContextSampledEvent extends BaseEvent<'BrowserContextSampledEvent'> {
    user_agent: string,
    timestamp_client: string, // ISO8601
    device_pixel_ratio: number,
    display: RegionSizePx,
    viewport: RegionSizePx,
}