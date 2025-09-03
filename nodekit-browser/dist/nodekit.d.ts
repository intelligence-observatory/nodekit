declare type Action = ClickAction | DoneAction | TimeoutAction | KeyPressAction;

declare interface BaseAction<T> {
    sensor_id: SensorId;
    action_type: string;
    action_value: T;
    reaction_time_msec: TimePointMsec;
}

declare interface BaseAssetLink<MT = string> {
    mime_type: MT;
    sha256: string;
    asset_url: string;
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

declare interface MarkdownPagesCard extends BaseCard<'MarkdownPagesCard', MarkdownPagesCardParameters> {
}

declare interface MarkdownPagesCardParameters {
    pages: TextContent[];
}

declare type MarkdownString = string & {
    __brand: 'MarkdownString';
};

declare interface NodeMeasurements {
    timestamp_node_started: ISO8601;
    timestamp_node_completed: ISO8601;
    action: Action;
    runtime_metrics: RuntimeMetrics;
}

declare interface NodeParameters {
    board: Board;
    cards: Card[];
    sensors: Sensor[];
    reinforcer_maps: ReinforcerMap[];
    effects: Effect[];
}

export declare class NodePlayer {
    private boardViewsUI;
    private shellUI;
    private nodePlays;
    constructor();
    prepare(nodeParameters: NodeParameters): Promise<NodePlayId>;
    play(nodePlayId: NodePlayId): Promise<NodeMeasurements>;
    setProgressBar(percent: number): void;
    showConnectingOverlay(startDelayMsec?: number): void;
    hideConnectingOverlay(): void;
    showConsoleMessageOverlay(banner: string, message: any): void;
    hideConsoleMessageOverlay(): void;
    playEndScreen(message?: string, endScreenTimeoutMsec?: number): Promise<void>;
    private showErrorMessageOverlay;
}

declare type NodePlayId = string & {
    __brand: 'NodePlayId';
};

declare interface NullParameters {
}

declare interface NullReinforcerMap extends BaseReinforcerMap<'NullReinforcerMap', NullParameters> {
}

declare interface NullValue {
}

declare interface PixelArea {
    width_px: number;
    height_px: number;
}

export declare function play(): void;

declare type PressableKey = "Enter" | " " | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

declare interface Reinforcer {
    reinforcer_cards: Card[];
}

declare type ReinforcerMap = ConstantReinforcerMap | NullReinforcerMap;

declare interface RuntimeMetrics {
    display_area: PixelArea;
    viewport_area: PixelArea;
    board_area: PixelArea;
    user_agent: string;
}

declare type Sensor = TimeoutSensor | DoneSensor | ClickSensor | KeyPressSensor;

declare type SensorId = string & {
    __brand: 'SensorId';
};

declare type SpatialPoint = number & {
    __brand: 'SpatialPoint';
};

declare type SpatialSize = number & {
    __brand: 'SpatialSize';
};

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

declare interface VideoCard extends BaseCard<'VideoCard', VideoCardParameters> {
}

declare interface VideoCardParameters {
    video_link: VideoLink;
    play_audio: boolean;
}

declare interface VideoLink extends BaseAssetLink<"video/mp4"> {
}

export { }
