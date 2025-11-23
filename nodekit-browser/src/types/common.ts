export type SpatialSize = number & { __brand: 'SpatialSize' };
export type SpatialPoint = number & { __brand: 'SpatialPoint' };

export type PixelSize = number & {__brand: 'PixelSize'};

export type NodeTimePointMsec = number & { __brand: 'NodeTimePointMsec' };
export type TimeElapsedMsec = number & { __brand: 'TimeElapsedMsec' };

export type PlainString = string & { __brand: 'PlainString' };
export type MarkdownString = string & { __brand: 'MarkdownString'}
export type ColorHexString = string & { __brand: 'ColorHexString' };

export type PressableKey = string;

export type SHA256 = string & { __brand: 'SHA256' };


export type NodeId = string & { __brand: 'NodeId' };
export type SensorId = string & { __brand: 'SensorId' };
export type RegisterId = string & { __brand: 'RegisterId' };
export type CardId = string & { __brand: 'CardId' };


export type Mask = 'ellipse' | 'rectangle' & { __brand: 'Mask' };