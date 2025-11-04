import type {CardId, ColorHexString, NodeTimePointMsec, PlainString, PressableKey, SpatialSize} from "../common.ts";
import type {Region} from "../region";
import type {SliderNormalizedPosition} from "../../board-view/sensor-bindings/slider";


interface BaseSensor<T extends string> {
    sensor_type: T
    timeout_msec: NodeTimePointMsec | null;
}

export interface WaitSensor extends BaseSensor<"WaitSensor">{
    timeout_msec: NodeTimePointMsec // Must be specified
}

export interface ConfirmSensor extends BaseSensor<'ConfirmSensor'>{ // todo
    region: Region;
}


export interface SelectSensor extends BaseSensor<'SelectSensor'>{
    hover_color: ColorHexString;
    selected_color: ColorHexString;
    choices: Set<CardId>
} // Select 1 of N Cards; todo
export interface MultiSelectSensor extends BaseSensor<'MultiSelectSensor'>{} // Select k>1 of N Cards; todo

export interface ClickSensor extends BaseSensor<'ClickSensor'>{ // Click somewhere within a Region
    region: Region
}

export interface KeySensor extends BaseSensor<'KeySensor'>{
    keys: Set<PressableKey>
}

export interface FreeTextEntrySensor extends BaseSensor<'FreeTextEntrySensor'>{
    prompt: PlainString;
    font_size: SpatialSize;
    min_length: number;
    max_length: number | null;
    region: Region
}

export interface SliderSensor extends BaseSensor<'SliderSensor'>{
    num_bins: number;
    show_bin_markers: boolean;
    initial_bin_index: number;
    orientation: 'horizontal' | 'vertical';
    region: Region
}

export type Sensor = ClickSensor | KeySensor  | SliderSensor | FreeTextEntrySensor | WaitSensor | ConfirmSensor; // | SelectSensor
