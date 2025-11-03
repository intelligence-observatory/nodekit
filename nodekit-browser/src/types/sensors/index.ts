import type {ColorHexString, NodeTimePointMsec, PlainString, PressableKey, SpatialSize} from "../common.ts";
import type {Region} from "../region";


interface BaseSensor<T extends string> {
    sensor_type: T
}

export interface WaitSensor extends BaseSensor<"WaitSensor">{ // todo
    until_msec: NodeTimePointMsec // Must be specified
}

export interface ConfirmSensor extends BaseSensor<'ConfirmSensor'>{ // todo
    region: Region;
    disabled_text: PlainString;
    disabled_color: ColorHexString;
    enabled_text: PlainString;
    enabled_color: ColorHexString;
    font_size: SpatialSize;
}

interface TimeoutMixin{
    timeout_msec: NodeTimePointMsec | null; // Defines when, if ever, the Sensor will resolve to a Timeout value
}

export interface SelectSensor extends BaseSensor<'SelectSensor'>,TimeoutMixin{} // Select 1 of N Cards; todo
export interface MultiSelectSensor extends BaseSensor<'MultiSelectSensor'>,TimeoutMixin{} // Select k>1 of N Cards; todo

export interface ClickSensor extends BaseSensor<'ClickSensor'>,TimeoutMixin{ // Click somewhere within a Region
    region: Region
}

export interface KeySensor extends BaseSensor<'KeySensor'>,TimeoutMixin{
    keys: Set<PressableKey>
}

export interface FreeTextEntrySensor extends BaseSensor<'FreeTextEntrySensor'>,TimeoutMixin{
    prompt: PlainString;
    font_size: SpatialSize;
    text_color: ColorHexString;
    background_color: ColorHexString;
    min_length: number;
    max_length: number | null;
    region: Region
}

export interface SliderSensor extends BaseSensor<'SliderSensor'>,TimeoutMixin{
    num_bins: number;
    show_bin_markers: boolean;
    initial_bin_index: number;
    orientation: 'horizontal' | 'vertical';
    region: Region
}

export type Sensor = ClickSensor | KeySensor  | SliderSensor | FreeTextEntrySensor | WaitSensor; // | SelectSensor
