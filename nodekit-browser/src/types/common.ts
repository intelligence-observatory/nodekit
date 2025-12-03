// Spatial
export type SpatialSize = number & { __brand: 'SpatialSize' };
export type SpatialPoint = number & { __brand: 'SpatialPoint' };
export type Mask = 'ellipse' | 'rectangle' & { __brand: 'Mask' };
export type PixelSize = number & {__brand: 'PixelSize'};

// Time
export type TimeElapsedMsec = number & { __brand: 'TimeElapsedMsec' };
export type TimeDurationMsec = number & { __brand: 'TimeDurationMsec' };

// Text
export type MarkdownString = string & { __brand: 'MarkdownString'}
export type ColorHexString = string & { __brand: 'ColorHexString' };

// Key
export type PressableKey = string;

// Assets
export type SHA256 = string & { __brand: 'SHA256' };

// Identifiers
export type NodeId = string & { __brand: 'NodeId' };
export type RegisterId = string & { __brand: 'RegisterId' };
