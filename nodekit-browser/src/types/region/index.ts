import type {PixelPoint, PixelSize, Mask} from "../values.ts";

export interface Region {
    x: PixelPoint;
    y: PixelPoint;
    w: PixelSize;
    h: PixelSize;
    z_index: number | null;
    mask: Mask
}