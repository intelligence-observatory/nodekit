export type SpatialSize = number & { __brand: 'SpatialSize' };
export type SpatialPoint = number & { __brand: 'SpatialPoint' };

export type NodeTimePointMsec = number & { __brand: 'NodeTimePointMsec' };
export type TimeElapsedMsec = number & { __brand: 'TimeElapsedMsec' };

export type MarkdownString = string & { __brand: 'MarkdownString'}
export type ColorHexString = string & { __brand: 'ColorHexString' };

export type PressableKey = string;

export type SHA256 = string & { __brand: 'SHA256' };

export type Mask = 'rectangle' | 'ellipse';

export type NodeId = string & { __brand: 'NodeId' };
export type SensorId = string & { __brand: 'SensorId' };
