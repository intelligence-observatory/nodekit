// Base Values
export type Boolean = Readonly<boolean>
export type Integer = Readonly<number>
export type Float = Readonly<number>
export type String = Readonly<string>
export type Null = null

// Containers
export interface Dict {
    readonly [key: String]: Value
}

export type List = Value[];

export type LeafValue =
    | Boolean
    | Integer
    | Float
    | String
    | Null;

export type Value =
    | LeafValue
    | List
    | Dict;


// Spatial
export type PixelSize = Integer & { __brand: 'PixelSize' };
export type PixelPoint = Float & { __brand: 'PixelPoint' };
export type Mask = 'ellipse' | 'rectangle' & { __brand: 'Mask' };

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
export type NodeAddress = NodeId[]
export type RegisterId = String & { __brand: 'RegisterId' };
