declare type Action = ClickAction | DoneAction | TimeoutAction | KeyPressAction | KeyHoldsAction;

declare interface BaseAction<T> {
    sensor_id: SensorId;
    action_type: string;
    action_value: T;
    timestamp_action: ISO8601_2;
}

declare interface BaseAssetLink<MT = string> {
    mime_type: MT;
    sha256: string;
    asset_url: string;
}

declare interface BaseBonusRule<T extends string, P> {
    bonus_rule_type: T;
    bonus_rule_parameters: P;
}

declare interface BaseCard<T extends string, P> {
    card_id: CardId;
    card_type: T;
    card_parameters: P;
    card_shape: BoardRectangle;
    card_location: BoardLocation;
    card_timespan: Timespan;
}

declare interface BaseEffect<T extends string, P> {
    effect_type: T;
    effect_parameters: P;
    effect_timespan: Timespan;
}

declare type BaseEvent<T extends string, P> = {
    event_id: UUID;
    event_type: T;
    event_payload: P;
    event_timestamp: ISO8601;
};

declare interface BaseReinforcerMap<T extends string, P> {
    reinforcer_map_type: T;
    reinforcer_map_parameters: P;
    sensor_id: SensorId;
}

declare interface BaseSensor<T extends string, P> {
    sensor_id: SensorId;
    sensor_type: T;
    sensor_parameters: P;
    sensor_timespan: Timespan;
    card_id: CardId | null;
}

declare interface Board {
    board_width_px: number;
    board_height_px: number;
}

declare interface BoardLocation {
    x: SpatialPoint;
    y: SpatialPoint;
}

declare interface BoardRectangle {
    width: SpatialSize;
    height: SpatialSize;
}

declare type BonusDisclosureEvent = BaseEvent<'BonusDisclosureEvent', {
    bonus_amount_usd: MonetaryAmountUsd;
}>;

declare type BonusRule = ConstantBonusRule;

declare type Card = FixationPointCard | ImageCard | TextCard | MarkdownPagesCard | VideoCard;

declare type CardId = string & {
    __brand: 'CardId';
};

declare interface ClickAction extends BaseAction<ClickActionValue> {
    action_type: "ClickAction";
}

declare interface ClickActionValue {
    click_x: number;
    click_y: number;
}

declare interface ClickSensor extends BaseSensor<'ClickSensor', NullParameters> {
    card_id: CardId;
}

declare type ColorHexString = string & {
    __brand: 'ColorHexString';
};

declare interface ConstantBonusRule extends BaseBonusRule<"ConstantBonusRule", ConstantBonusRuleParameters> {
}

declare interface ConstantBonusRuleParameters {
    sensor_id: SensorId;
    bonus_amount_usd: MonetaryAmountUsd;
}

declare interface ConstantReinforcerMap extends BaseReinforcerMap<'ConstantReinforcerMap', ConstantReinforcerMapParameters> {
}

declare interface ConstantReinforcerMapParameters {
    reinforcer: Reinforcer;
}

declare interface DoneAction extends BaseAction<NullValue> {
    action_type: "DoneAction";
}

declare interface DoneSensor extends BaseSensor<'DoneSensor', NullParameters> {
    card_id: CardId;
}

declare type Effect = HidePointerEffect;

declare type EndEvent = BaseEvent<'EndEvent', {}>;

declare type Event_2 = StartEvent | EndEvent | NodeResultEvent | LeaveEvent | ReturnEvent | BonusDisclosureEvent;

declare interface FixationPointCard extends BaseCard<'FixationPointCard', NullParameters> {
}

declare interface HidePointerEffect extends BaseEffect<'HidePointerEffect', NullParameters> {
}

declare interface ImageCard extends BaseCard<'ImageCard', ImageCardParameters> {
}

declare interface ImageCardParameters {
    image_link: ImageLink;
}

declare interface ImageLink extends BaseAssetLink<"image/png"> {
}

declare type ISO8601 = string & {
    __brand: 'ISO8601';
};

declare type ISO8601_2 = string & {
    __brand: 'ISO8601';
};

declare interface KeyHold {
    key: PressableKey;
    timestamp_start: ISO8601_2 | null;
    timestamp_end: ISO8601_2 | null;
}

declare interface KeyHoldsAction extends BaseAction<KeyHoldsActionValue> {
    action_type: "KeyHoldsAction";
}

declare interface KeyHoldsActionValue {
    key_holds: KeyHold[];
}

declare interface KeyHoldsSensor extends BaseSensor<'KeyHoldsSensor', KeyHoldsSensorParameters> {
    card_id: null;
}

declare interface KeyHoldsSensorParameters {
    keys: Set<PressableKey>;
}

declare interface KeyPressAction extends BaseAction<KeyPressActionValue> {
    action_type: "KeyPressAction";
}

declare interface KeyPressActionValue {
    key: PressableKey;
}

declare interface KeyPressSensor extends BaseSensor<'KeyPressSensor', KeyPressSensorParameters> {
    card_id: null;
}

declare interface KeyPressSensorParameters {
    keys: Set<PressableKey>;
}

declare type LeaveEvent = BaseEvent<'LeaveEvent', {}>;

declare interface MarkdownPagesCard extends BaseCard<'MarkdownPagesCard', MarkdownPagesCardParameters> {
}

declare interface MarkdownPagesCardParameters {
    pages: TextContent[];
}

declare type MarkdownString = string & {
    __brand: 'MarkdownString';
};

declare type MonetaryAmountUsd = string & {
    __brand: 'MonetaryAmountUsd';
};

declare interface Node_2 {
    node_id: NodeId;
    board: Board;
    cards: Card[];
    sensors: Sensor[];
    reinforcer_maps: ReinforcerMap[];
    effects: Effect[];
}

declare interface NodeGraph {
    nodes: Node_2[];
    bonus_rules: BonusRule[];
}

declare type NodeId = string & {
    __brand: 'NodeId';
};

declare type NodeResult = {
    node_id: NodeId;
    timestamp_start: ISO8601;
    timestamp_end: ISO8601;
    node_execution_index: number;
    action: Action;
    runtime_metrics: RuntimeMetrics;
};

declare type NodeResultEvent = BaseEvent<'NodeResultEvent', NodeResult>;

declare interface NullParameters {
}

declare interface NullReinforcerMap extends BaseReinforcerMap<'NullReinforcerMap', NullParameters> {
}

declare interface NullValue {
}

export declare type OnEventCallback = (event: Event_2) => void;

declare interface PixelArea {
    width_px: number;
    height_px: number;
}

export declare function play(nodeGraph: NodeGraph, onEventCallback?: OnEventCallback | null, previousEvents?: Event_2[]): Promise<Event_2[]>;

declare type PressableKey = "Enter" | " " | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

declare interface Reinforcer {
    reinforcer_cards: Card[];
}

declare type ReinforcerMap = ConstantReinforcerMap | NullReinforcerMap;

declare type ReturnEvent = BaseEvent<'ReturnEvent', {}>;

declare interface RuntimeMetrics {
    display_area: PixelArea;
    viewport_area: PixelArea;
    board_area: PixelArea;
    user_agent: string;
}

declare type Sensor = TimeoutSensor | DoneSensor | ClickSensor | KeyPressSensor | KeyHoldsSensor;

declare type SensorId = string & {
    __brand: 'SensorId';
};

declare type SpatialPoint = number & {
    __brand: 'SpatialPoint';
};

declare type SpatialSize = number & {
    __brand: 'SpatialSize';
};

declare type StartEvent = BaseEvent<'StartEvent', {}>;

declare interface TextCard extends BaseCard<'TextCard', TextCardParameters> {
}

declare interface TextCardParameters {
    content: TextContent;
    background_color: ColorHexString;
}

declare interface TextContent {
    text: MarkdownString;
    text_color: ColorHexString;
    font_size: SpatialSize;
    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
}

declare type TimeDurationMsec = number & {
    __brand: 'TimeDurationMsec';
};

declare interface TimeoutAction extends BaseAction<NullValue> {
    action_type: "TimeoutAction";
}

declare interface TimeoutSensor extends BaseSensor<'TimeoutSensor', TimeoutSensorParameters> {
    card_id: null;
}

declare interface TimeoutSensorParameters {
    timeout_msec: TimeDurationMsec;
}

declare type TimePointMsec = number & {
    __brand: 'TimePointMsec';
};

declare interface Timespan {
    start_time_msec: TimePointMsec;
    end_time_msec: TimePointMsec | null;
}

declare type UUID = string & {
    __brand: 'UUID';
};

declare interface VideoCard extends BaseCard<'VideoCard', VideoCardParameters> {
}

declare interface VideoCardParameters {
    video_link: VideoLink;
}

declare interface VideoLink extends BaseAssetLink<"video/mp4"> {
}

export { }
