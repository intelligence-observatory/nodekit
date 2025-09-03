
export interface PixelArea {
    width_px: number; // Width in pixels
    height_px: number; // Height in pixels
}

export interface RuntimeMetrics {
    display_area: PixelArea
    viewport_area: PixelArea
    board_area: PixelArea
    user_agent: string // User agent string of the browser
}