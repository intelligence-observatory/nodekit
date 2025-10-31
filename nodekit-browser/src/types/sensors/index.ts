import type {PressableKey, SpatialPoint, SpatialSize, NodeTimePointMsec, Mask, CardId, ColorHexString, PlainString, RegularExpressionString, MarkdownString} from "../common.ts";


interface BaseSensor<T extends string> {
    sensor_type: T
}

export interface WaitSensor extends BaseSensor<'WaitSensor'>{
    until_msec: NodeTimePointMsec
}


interface TemporallyBoundedSensor<T extends string> extends BaseSensor<T> {
    start_msec: NodeTimePointMsec
    end_msec: NodeTimePointMsec | null // If null, the window lasts until the Node ends
}

interface VisualSensorMixin {
    x: SpatialPoint
    y: SpatialPoint
    z_index: number | null;

    w: SpatialSize
    h: SpatialSize
}


export interface ClickSensor extends TemporallyBoundedSensor<'ClickSensor'>{
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialSize
    h: SpatialSize
    mask: Mask
}

export interface KeySensor extends TemporallyBoundedSensor<'KeySensor'> {
    keys: Set<PressableKey>
}

export interface FreeTextEntrySensor extends TemporallyBoundedSensor<'FreeTextEntrySensor'>, VisualSensorMixin{
    prompt: PlainString;
    font_size: SpatialSize;
    text_color: ColorHexString;
    background_color: ColorHexString;
    min_length: number;
    max_length: number | null;
    pattern: RegularExpressionString | null;
}

export interface SelectSensor extends TemporallyBoundedSensor<'SelectSensor'>{
    choices: readonly CardId[];
    min_selections: number;
    max_selections: number;

    // Visual appearance of the overlay
    hover_color: ColorHexString;
    selected_color: ColorHexString;
}

export interface SliderSensor extends TemporallyBoundedSensor<'SliderSensor'>, VisualSensorMixin{
    num_bins: number;
    show_bin_markers: boolean;
    initial_bin_index: number;
    orientation: 'horizontal' | 'vertical';
}

export interface SubmitSensor extends TemporallyBoundedSensor<'SubmitSensor'>, VisualSensorMixin {
    locked_text: MarkdownString;
    locked_color: ColorHexString;

    ready_text: MarkdownString;
    ready_color: ColorHexString;
}


export type Sensor = WaitSensor | ClickSensor | KeySensor | SubmitSensor | SelectSensor | SliderSensor | FreeTextEntrySensor;
