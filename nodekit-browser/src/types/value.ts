// Base Values
export type Boolean = Readonly<boolean>
export type Integer = Readonly<number>
export type Float = Readonly<number>
export type String = Readonly<string>

// Containers
export interface Dict {
    readonly [key: String]: Value
}

export type List = Value[];
// DU
export type LeafValue =
    | Boolean
    | Integer
    | Float
    | String

export type Value =
    | LeafValue
    | List
    | Dict;


// Spatial
export type SpatialSize = Float & { __brand: 'SpatialSize' };
export type SpatialPoint = Float & { __brand: 'SpatialPoint' };
export type Mask = 'ellipse' | 'rectangle' & { __brand: 'Mask' };
export type PixelSize = Integer & {__brand: 'PixelSize'};

// Time
export type TimeElapsedMsec = Integer & { __brand: 'TimeElapsedMsec' };
export type TimeDurationMsec = Integer & { __brand: 'TimeDurationMsec' };

// Text
export type MarkdownString = String & { __brand: 'MarkdownString'}
export type ColorHexString = String & { __brand: 'ColorHexString' };

// Key
export type PressableKey = String;

// Assets
export type SHA256 = String & { __brand: 'SHA256' };

// Identifiers
export type NodeId = String & { __brand: 'NodeId' };
export type RegisterId = String & { __brand: 'RegisterId' };
