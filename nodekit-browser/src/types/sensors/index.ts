import type {CardId, NodeTimePointMsec, PlainString, PressableKey, SensorId, SpatialSize} from "../common.ts";
import type {Region} from "../region";
import type {SliderBinIndex} from "../../board-view/sensor-bindings/slider";

interface BaseSensor<T extends string> {
    sensor_type: T
}

export interface WaitSensor extends BaseSensor<"WaitSensor">{
    duration_msec: NodeTimePointMsec // Must be specified
}

export interface SelectSensor extends BaseSensor<'SelectSensor'>{
    // Choose exactly 1 element from a finite set.
    choices: CardId[]
}

export interface ClickSensor extends BaseSensor<'ClickSensor'>{
    region: Region
}

export interface KeySensor extends BaseSensor<'KeySensor'>{
    keys: Set<PressableKey>
}

export interface SliderSensor extends BaseSensor<'SliderSensor'>{
    num_bins: number;
    show_bin_markers: boolean;
    initial_bin_index: SliderBinIndex;
    orientation: 'horizontal' | 'vertical';
    region: Region
    confirm_button: CardId, // Choices are locked after this; enabled only after min_selections are reached
}

export interface MultiSelectSensor extends BaseSensor<'MultiSelectSensor'>{
    // Select a subset of a to b elements from a finite set.
    choices: CardId[]
    min_selections: number;
    max_selections: number;
    confirm_button: CardId, // Choices are locked after this; enabled only after min_selections are reached
}


export interface FreeTextEntrySensor extends BaseSensor<'FreeTextEntrySensor'>{
    prompt: PlainString;
    font_size: SpatialSize;
    min_length: number;
    max_length: number | null;
    region: Region
}


// Combinator types
export interface ProductSensor extends BaseSensor<'ProductSensor'> {
    // When all children have yielded an Action, emits a Product<Action[]>
    children: Record<SensorId, Sensor>
}

export interface SumSensor extends BaseSensor<'SumSensor'> {
    // Emits the latest child Action as Tagged<Action>
    children: Record<SensorId, Sensor>
}


export type Sensor =
    | ClickSensor
    | KeySensor
    | SliderSensor
    | FreeTextEntrySensor
    | WaitSensor
    | SelectSensor
    | MultiSelectSensor
    | ProductSensor
    | SumSensor

