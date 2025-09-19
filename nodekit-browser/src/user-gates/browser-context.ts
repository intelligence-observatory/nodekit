export interface BrowserContext {
    userAgent: string,

    viewportWidthPx: number,
    viewportHeightPx: number,

    displayWidthPx: number,
    displayHeightPx: number
}

export function getBrowserContext(): BrowserContext {
    return {
        userAgent: navigator.userAgent,

        viewportWidthPx: window.innerWidth,
        viewportHeightPx: window.innerHeight,

        displayWidthPx: screen.width,
        displayHeightPx: screen.height,
    }
}