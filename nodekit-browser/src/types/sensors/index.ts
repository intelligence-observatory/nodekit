import type {CardId, ColorHexString, PlainString, PressableKey, RegularExpressionString, SpatialPoint, SpatialSize} from "../common.ts";
import type {Region} from "../region";


interface BaseSensor<T extends string> {
    sensor_type: T
}


interface VisualSensorMixin {
    x: SpatialPoint
    y: SpatialPoint
    z_index: number | null;
    w: SpatialSize
    h: SpatialSize
}


export interface ClickSensor extends BaseSensor<'ClickSensor'>{
    region: Region
}

export interface KeySensor extends BaseSensor<'KeySensor'> {
    keys: Set<PressableKey>
}

export interface FreeTextEntrySensor extends BaseSensor<'FreeTextEntrySensor'>, VisualSensorMixin{
    prompt: PlainString;
    font_size: SpatialSize;
    text_color: ColorHexString;
    background_color: ColorHexString;
    min_length: number;
    max_length: number | null;
    pattern: RegularExpressionString | null;
}

export interface SelectSensor extends BaseSensor<'SelectSensor'>{
    choices: readonly CardId[];
    min_selections: number;
    max_selections: number;

    // Visual appearance of the overlay
    hover_color: ColorHexString;
    selected_color: ColorHexString;
}

export interface SliderSensor extends BaseSensor<'SliderSensor'>, VisualSensorMixin{
    num_bins: number;
    show_bin_markers: boolean;
    initial_bin_index: number;
    orientation: 'horizontal' | 'vertical';
}

export type Sensor = ClickSensor | KeySensor  | SliderSensor | FreeTextEntrySensor; // | SelectSensor
