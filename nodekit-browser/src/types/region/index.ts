import type {SpatialPoint, SpatialSize, Mask} from "../value.ts";

export interface Region {
    x: SpatialPoint;
    y: SpatialPoint;
    w: SpatialSize;
    h: SpatialSize;
    z_index: number | null;
    mask: Mask
}