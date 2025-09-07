export type UUID = string & { __brand: 'UUID' };
export type ISO8601 = string & { __brand: 'ISO8601' };
export type SpatialSize = number & { __brand: 'SpatialSize' };
export type SpatialPoint = number & { __brand: 'SpatialPoint' };
export type TimePointMsec = number & { __brand: 'TimePointMsec' };
export type TimeDurationMsec = number & { __brand: 'TimeDurationMsec' };
export type MarkdownString = string & { __brand: 'MarkdownString'}
export type ColorHexString = string & { __brand: 'ColorHexString' };

export type MonetaryAmountUsd = string & { __brand: 'MonetaryAmountUsd' };
export type PayableMonetaryAmountUsd = string & { __brand: 'PayableMonetaryAmountUsd' };

export type CardId = string & { __brand: 'CardId' };
export type SensorId = string & { __brand: 'SensorId' };
export type NodePlayId = string & { __brand: 'NodePlayId' };

export interface TextContent {
    text: MarkdownString;
    text_color: ColorHexString;

    font_size: SpatialSize; // The height of the em-box, in Board units

    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
}


export interface BoardRectangle {
    width: SpatialSize;
    height: SpatialSize;
}

export interface BoardLocation {
    x: SpatialPoint; // positive x is "right"
    y: SpatialPoint; // positive y is "up"
}

export interface Timespan {
    start_time_msec: TimePointMsec;
    end_time_msec: TimePointMsec | null; // null if the timespan is open-ended
}


export type PressableKey = "Enter" | " " | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export interface NullParameters {
}

export interface NullValue {
}