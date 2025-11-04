import type {SpatialPoint, SpatialSize, Mask} from "../common.ts";

export interface Region {
    x: SpatialPoint;
    y: SpatialPoint;
    z_index: number | null;
    w: SpatialSize;
    h: SpatialSize;
    mask: Mask
}