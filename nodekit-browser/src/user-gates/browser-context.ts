import type {Clock} from "../clock.ts";
import type {PixelSize} from "../types/values.ts";
import type {BrowserContextSampledEvent} from "../types/events";

export function sampleBrowserContext(clock: Clock): BrowserContextSampledEvent {
    return {
        event_type: 'BrowserContextSampledEvent',
        t: clock.now(),
        user_agent: navigator.userAgent,
        timestamp_client: new Date().toISOString(),
        device_pixel_ratio: window.devicePixelRatio,
        display: {
            width_px: screen.width as PixelSize,
            height_px: screen.height as PixelSize,
        },
        viewport: {
            width_px: window.innerWidth as PixelSize,
            height_px: window.innerHeight as PixelSize,
        },
    }
}