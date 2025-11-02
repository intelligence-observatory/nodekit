import type {Mask, SpatialPoint, SpatialSize} from "../common.ts";

export interface Region {
    x: SpatialPoint;
    y: SpatialPoint;
    w: SpatialSize;
    h: SpatialSize;
    mask: Mask
}