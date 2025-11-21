import type {CardId, PressableKey, SensorId, SpatialPoint, TimeElapsedMsec} from "../common.ts";
import type {SliderBinIndex} from "../../board-view/sensor-bindings/slider";

export interface BaseAction<T extends string> {
    action_type: T
    t: TimeElapsedMsec, // When the Sensor was set to this SensorValue
}

export interface UnresolvedSensorValue{
    // Value of an unresolved Sensor
    action_type: 'UnresolvedSensorValue'
}

export interface ClickAction extends BaseAction<"ClickAction"> {
    x: SpatialPoint;
    y: SpatialPoint;
}

export interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}

export interface SliderAction extends BaseAction<"SliderAction"> {
    bin_index: SliderBinIndex
}
export interface FreeTextEntryAction extends BaseAction<"FreeTextEntryAction"> {
    text: string
}

export interface WaitAction extends BaseAction<"WaitAction">{}

export interface SelectAction extends BaseAction<"SelectAction">{
    selection: CardId
}

export interface MultiSelectAction extends BaseAction<"MultiSelectAction">{
    selections: CardId[]
}

export interface JointAction extends BaseAction<'JointAction'> {
    children: Record<SensorId, Action>
}

export interface RaceAction extends BaseAction<'RaceAction'>{
    winner: SensorId
    action: Action
}

export interface SequentialAction extends BaseAction<'SequentialAction'>{
    sequence: Action[]
}

// Union
export type Action =
    | ClickAction
    | KeyAction
    | SliderAction
    | FreeTextEntryAction
    | WaitAction
    | SelectAction
    | MultiSelectAction
    | JointAction
    | RaceAction
    | SequentialAction

export type Maybe<T> = T | UnresolvedSensorValue;
export type SensorValuesMap = Record<SensorId, Maybe<Action>>
