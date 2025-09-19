import type {SpatialPoint} from "../common.ts";
import type {Shape} from "../common.ts";

interface BaseRegion<T extends string> {
    region_type: T;
}

export interface ShapeRegion extends BaseRegion<'ShapeRegion'> {
    shape: Shape
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialPoint
    h: SpatialPoint
}

export type Region = ShapeRegion;