declare type Action = ClickAction | TimeoutAction | KeyAction;

declare type AssetIdentifier = ImageIdentifier | VideoIdentifier;

declare interface AssetUrl {
    identifier: AssetIdentifier;
    url: string;
}

declare interface BaseAction<T extends string> {
    sensor_id: SensorId;
    action_type: T;
    timestamp_action: ISO8601;
}

declare interface BaseAssetIdentifier<MT extends string> {
    sha256: SHA256;
    mime_type: MT;
}

declare interface BaseCard<T extends string> {
    card_id: CardId;
    card_type: T;
    x: SpatialPoint;
    y: SpatialPoint;
    w: SpatialSize;
    h: SpatialSize;
    t_start: TimePointMsec;
    t_end: TimePointMsec | null;
}

declare interface BaseEffect<T extends string> {
    effect_type: T;
    t_start: TimePointMsec;
    t_end: TimePointMsec | null;
}

declare type BaseEvent<T extends string, P> = {
    event_id: UUID;
    timestamp_event: ISO8601;
    event_type: T;
    event_payload: P;
    nodekit_version: string;
};

declare interface BaseRegion<T extends string> {
    region_type: T;
}

declare interface BaseSensor<T extends string> {
    sensor_id: SensorId;
    sensor_type: T;
    t_start: TimePointMsec;
}

declare interface Board {
    board_width_px: number;
    board_height_px: number;
    background_color: ColorHexString;
}

declare type BonusDisclosureEvent = BaseEvent<'BonusDisclosureEvent', {
    bonus_amount_usd: MonetaryAmountUsd;
}>;

declare interface BrowserContext {
    user_agent: string;
    viewport_width_px: number;
    viewport_height_px: number;
    display_width_px: number;
    display_height_px: number;
}

declare type BrowserContextEvent = BaseEvent<'BrowserContextEvent', BrowserContext>;

declare type Card = ImageCard | TextCard | VideoCard | ShapeCard;

declare type CardId = string & {
    __brand: 'CardId';
};

declare interface ClickAction extends BaseAction<"ClickAction"> {
    click_x: SpatialPoint;
    click_y: SpatialPoint;
}

declare interface ClickSensor extends BaseSensor<'ClickSensor'> {
    region: Region;
}

declare type ColorHexString = string & {
    __brand: 'ColorHexString';
};

declare type Effect = HidePointerEffect;

declare type EndEvent = BaseEvent<'EndEvent', {}>;

declare type Event_2 = StartEvent | EndEvent | NodeResultEvent | LeaveEvent | ReturnEvent | BonusDisclosureEvent | BrowserContextEvent;

declare interface HidePointerEffect extends BaseEffect<'HidePointerEffect'> {
    t_end: TimePointMsec;
}

declare interface ImageCard extends BaseCard<'ImageCard'> {
    image: ImageIdentifier;
}

declare interface ImageIdentifier extends BaseAssetIdentifier<"image/png"> {
}

declare type ISO8601 = string & {
    __brand: 'ISO8601';
};

declare interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}

declare interface KeySensor extends BaseSensor<'KeySensor'> {
    key: PressableKey;
}

declare type LeaveEvent = BaseEvent<'LeaveEvent', {}>;

declare type MarkdownString = string & {
    __brand: 'MarkdownString';
};

declare type MonetaryAmountUsd = string & {
    __brand: 'MonetaryAmountUsd';
};

declare interface Node_2 {
    node_id: NodeId;
    cards: Card[];
    sensors: Sensor[];
    outcomes: Outcome[];
    effects: Effect[];
    board: Board;
}

declare type NodeId = string & {
    __brand: 'NodeId';
};

declare type NodeResultEvent = BaseEvent<'NodeResultEvent', {
    node_id: NodeId;
    timestamp_node_start: ISO8601;
    timestamp_node_end: ISO8601;
    action: Action;
}>;

export declare type OnEventCallback = (event: Event_2) => void;

declare interface Outcome {
    sensor_id: SensorId;
    cards: Card[];
    bonus_amount_usd: MonetaryAmountUsd;
}

export declare function play(timeline: Timeline, assetUrls: AssetUrl[], onEventCallback?: OnEventCallback | null, previousEvents?: Event_2[]): Promise<Event_2[]>;

declare type PressableKey = "Enter" | " " | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

declare type Region = ShapeRegion;

declare type ReturnEvent = BaseEvent<'ReturnEvent', {}>;

declare type Sensor = TimeoutSensor | ClickSensor | KeySensor;

declare type SensorId = string & {
    __brand: 'SensorId';
};

declare type SHA256 = string & {
    __brand: 'SHA256';
};

declare type Shape = 'rectangle' | 'ellipse';

declare interface ShapeCard extends BaseCard<'ShapeCard'> {
    shape: Shape;
    color: ColorHexString;
}

declare interface ShapeRegion extends BaseRegion<'ShapeRegion'> {
    shape: Shape;
    x: SpatialPoint;
    y: SpatialPoint;
    w: SpatialPoint;
    h: SpatialPoint;
}

declare type SpatialPoint = number & {
    __brand: 'SpatialPoint';
};

declare type SpatialSize = number & {
    __brand: 'SpatialSize';
};

declare type StartEvent = BaseEvent<'StartEvent', {}>;

declare interface TextCard extends BaseCard<'TextCard'> {
    text: MarkdownString;
    font_size: SpatialSize;
    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
    text_color: ColorHexString;
    background_color: ColorHexString;
}

declare interface Timeline {
    nodes: Node_2[];
    asset_urls: AssetUrl[];
    nodekit_version: string;
}

declare interface TimeoutAction extends BaseAction<"TimeoutAction"> {
}

declare interface TimeoutSensor extends BaseSensor<'TimeoutSensor'> {
}

declare type TimePointMsec = number & {
    __brand: 'TimePointMsec';
};

declare type UUID = string & {
    __brand: 'UUID';
};

declare interface VideoCard extends BaseCard<'VideoCard'> {
    video: VideoIdentifier;
    muted: boolean;
    loop: boolean;
}

declare interface VideoIdentifier extends BaseAssetIdentifier<"video/mp4"> {
}

export { }
