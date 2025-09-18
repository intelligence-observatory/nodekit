import type {SpatialPoint} from "../common.ts";

interface BaseRegion<T extends string> {
    region_type: T;
}

export interface Rectangle extends BaseRegion<'Rectangle'> {
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialPoint
    h: SpatialPoint
}

export interface Ellipse extends BaseRegion<'Ellipse'> {
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialPoint
    h: SpatialPoint
}

export type Region = Rectangle | Ellipse;