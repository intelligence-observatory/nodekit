export type UUID = string & { __brand: 'UUID' };
export type SpatialSize = number & { __brand: 'SpatialSize' };
export type SpatialPoint = number & { __brand: 'SpatialPoint' };

export type NodeTimePointMsec = number & { __brand: 'NodeTimePointMsec' };
export type TimeElapsedMsec = number & { __brand: 'TimeElapsedMsec' };

export type MarkdownString = string & { __brand: 'MarkdownString'}
export type ColorHexString = string & { __brand: 'ColorHexString' };

export type PressableKey = "Enter" | " " | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type SHA256 = string & { __brand: 'SHA256' };

export type Mask = 'rectangle' | 'ellipse';
export type NodeIndex = number & { __brand: "NodeIndex" };
export type SensorIndex = number & { __brand: "SensorIndex" };