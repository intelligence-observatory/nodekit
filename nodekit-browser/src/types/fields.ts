export type UUID = string & { __brand: 'UUID' };
export type ISO8601 = string & { __brand: 'ISO8601' };
export type SpatialSize = number & { __brand: 'SpatialSize' };
export type SpatialPoint = number & { __brand: 'SpatialPoint' };
export type TimePointMsec = number & { __brand: 'TimePointMsec' };
export type TimeDurationMsec = number & { __brand: 'TimeDurationMsec' };
export type MarkdownString = string & { __brand: 'MarkdownString'}
export type ColorHexString = string & { __brand: 'ColorHexString' };

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


/*
Utility functions:
 */
export function dateToISO8601(date: Date): ISO8601 {
    /**
     * Converts a native JS Date into an ISO8601-compliant string (e.g. "2024-05-27T17:52:00.123Z").
     */

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid Date object: ${date}`);
    }

    return date.toISOString() as ISO8601;
}

export type PressableKey = "Enter" | " " | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export interface KeyHoldSubAction {
    key: PressableKey,
    // If true, the key was pressed after the sensor was armed.
    pressed_after_armed: boolean;
    // The time delta from the sensor's start time at which the key was pressed.
    // If `!started_after_arm`, this is 0.
    tstart_msec: number;
    // The time delta from the sensor's end time at which the key was released.
    // This is null if the key wasn't released.
    tend_msec: number | null;
}