import type {CardId, NodeTimePointMsec, PlainString, PressableKey, SpatialSize} from "../common.ts";
import type {Region} from "../region";
import type {SliderBinIndex} from "../../board-view/sensor-bindings/slider";


interface BaseSensor<T extends string> {
    sensor_type: T
}

export interface WaitSensor extends BaseSensor<"WaitSensor">{
    timeout_msec: NodeTimePointMsec // Must be specified
}

export interface SelectSensor extends BaseSensor<'SelectSensor'>{
    choices: CardId[]
}

export interface MultiSelectSensor extends BaseSensor<'MultiSelectSensor'>{
    choices: CardId[]
    min_selections: number;
    max_selections: number | null;
}

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
    initial_bin_index: SliderBinIndex;
    orientation: 'horizontal' | 'vertical';
    region: Region
}

export type Sensor =
    | ClickSensor
    | KeySensor
    | SliderSensor
    | FreeTextEntrySensor
    | WaitSensor
    | SelectSensor
    | MultiSelectSensor
