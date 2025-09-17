export interface BrowserContext {
    user_agent: string,
    viewport_width_px: number,
    viewport_height_px: number,
    display_width_px: number,
    display_height_px: number
}

export function getBrowserContext(): BrowserContext {
    return {
        user_agent: navigator.userAgent,

        display_width_px: screen.width,
        display_height_px: screen.height,

        viewport_width_px: window.innerWidth,
        viewport_height_px: window.innerHeight,
    }
}