import type {SpatialPoint} from "../common.ts";

interface BaseBoardRegion<T extends string> {
    region_type: T;
}

export interface Rectangle extends BaseBoardRegion<'Rectangle'> {
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialPoint
    h: SpatialPoint
}

export interface Ellipse extends BaseBoardRegion<'Ellipse'> {
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialPoint
    h: SpatialPoint
}

export type BoardRegion = Rectangle | Ellipse;