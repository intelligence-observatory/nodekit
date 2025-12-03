import type {PressableKey, SpatialSize, TimeDurationMsec} from "../value.ts";
import type {Region} from "../region";
import type {SliderBinIndex} from "../../board-view/sensor-bindings/slider";
import type {Card} from "../cards";

interface BaseSensor<T extends string> {
    sensor_type: T
}

// Leaf Sensors
export interface WaitSensor extends BaseSensor<"WaitSensor">{
    duration_msec: TimeDurationMsec
}
export interface ClickSensor extends BaseSensor<'ClickSensor'>{
    region: Region
}

export interface KeySensor extends BaseSensor<'KeySensor'>{
    keys: Set<PressableKey>
}

export interface SelectSensor extends BaseSensor<'SelectSensor'>{
    // Choose exactly 1 element from a finite set.
    choices: Record<string, Card>
}

export interface MultiSelectSensor extends BaseSensor<'MultiSelectSensor'>{
    // Select a subset of a to b elements from a finite set.
    choices: Record<string, Card>
    min_selections: number;
    max_selections: number | null;
    confirm_button: Card, // Choices are locked after this; enabled only after min_selections are reached
}

export interface SliderSensor extends BaseSensor<'SliderSensor'>{
    num_bins: number;
    show_bin_markers: boolean;
    initial_bin_index: SliderBinIndex;
    orientation: 'horizontal' | 'vertical';
    region: Region
}

export interface FreeTextEntrySensor extends BaseSensor<'FreeTextEntrySensor'>{
    prompt: string;
    font_size: SpatialSize;
    min_length: number;
    max_length: number | null;
    region: Region
}

export interface ProductSensor extends BaseSensor<'ProductSensor'> {
    // Once all children's last emissions are a valid Action, emit a Product<Action[]>
    children: Record<string, Sensor>
}

export interface SumSensor extends BaseSensor<'SumSensor'> {
    // Emits the first valid child Action as a Tagged<Action>
    children: Record<string, Sensor>
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

