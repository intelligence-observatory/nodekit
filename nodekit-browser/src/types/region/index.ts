import type {SpatialPoint, SpatialSize, Mask} from "../values.ts";

export interface Region {
    x: SpatialPoint;
    y: SpatialPoint;
    w: SpatialSize;
    h: SpatialSize;
    z_index: number | null;
    mask: Mask
}