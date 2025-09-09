import type {BrowserContext} from "../types/events";

export function getBrowserContext(): BrowserContext {
    return {
        user_agent: navigator.userAgent,

        display_width_px: screen.width,
        display_height_px: screen.height,

        viewport_width_px: window.innerWidth,
        viewport_height_px: window.innerHeight,
    }
}