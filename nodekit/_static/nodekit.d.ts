declare type Action = ClickAction | DoneAction | TimeoutAction | KeyAction | KeyHoldsAction;

declare interface BaseAction<T extends string> {
    sensor_id: SensorId;
    action_type: T;
    timestamp_action: ISO8601_2;
}

declare interface BaseAssetLink<MT = string> {
    mime_type: MT;
    sha256: string;
    asset_url: string;
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
    event_type: T;
    event_payload: P;
    event_timestamp: ISO8601;
    nodekit_version: string;
};

declare interface BaseSensor<T extends string> {
    sensor_id: SensorId;
    sensor_type: T;
    t_armed: TimePointMsec;
}

declare interface BlankCard extends BaseCard<'BlankCard'> {
    color: ColorHexString;
}

declare interface Board {
    board_width_px: number;
    board_height_px: number;
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

declare type Card = FixationPointCard | ImageCard | TextCard | MarkdownPagesCard | VideoCard | BlankCard;

declare type CardId = string & {
    __brand: 'CardId';
};

declare interface ClickAction extends BaseAction<"ClickAction"> {
    click_x: number;
    click_y: number;
}

declare interface ClickSensor extends BaseSensor<'ClickSensor'> {
    card_id: CardId;
}

declare type ColorHexString = string & {
    __brand: 'ColorHexString';
};

declare interface Consequence {
    sensor_id: SensorId;
    cards: Card[];
    bonus_amount_usd: MonetaryAmountUsd;
}

declare interface DoneAction extends BaseAction<"DoneAction"> {
}

declare interface DoneSensor extends BaseSensor<'DoneSensor'> {
    card_id: CardId;
}

declare type Effect = HidePointerEffect;

declare type EndEvent = BaseEvent<'EndEvent', {}>;

declare type Event_2 = StartEvent | EndEvent | NodeResultEvent | LeaveEvent | ReturnEvent | BonusDisclosureEvent | BrowserContextEvent;

declare interface FixationPointCard extends BaseCard<'FixationPointCard'> {
}

declare interface HidePointerEffect extends BaseEffect<'HidePointerEffect'> {
    t_end: TimePointMsec;
}

declare interface ImageCard extends BaseCard<'ImageCard'> {
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

declare interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}

declare interface KeyHoldsAction extends BaseAction<"KeyHoldsAction"> {
}

declare interface KeyHoldsSensor extends BaseSensor<'KeyHoldsSensor'> {
    key: PressableKey;
}

declare interface KeySensor extends BaseSensor<'KeySensor'> {
    key: PressableKey;
}

declare type LeaveEvent = BaseEvent<'LeaveEvent', {}>;

declare interface MarkdownPagesCard extends BaseCard<'MarkdownPagesCard'> {
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
    cards: Card[];
    sensors: Sensor[];
    consequences: Consequence[];
    effects: Effect[];
}

declare interface NodeGraph {
    board: Board;
    nodes: Node_2[];
    nodekit_version: string;
}

declare type NodeId = string & {
    __brand: 'NodeId';
};

declare type NodeResultEvent = BaseEvent<'NodeResultEvent', {
    node_id: NodeId;
    node_execution_index: number;
    timestamp_start: ISO8601;
    timestamp_end: ISO8601;
    action: Action;
}>;

export declare type OnEventCallback = (event: Event_2) => void;

export declare function play(nodeGraph: NodeGraph, onEventCallback?: OnEventCallback | null, previousEvents?: Event_2[]): Promise<Event_2[]>;

declare type PressableKey = "Enter" | " " | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

declare type ReturnEvent = BaseEvent<'ReturnEvent', {}>;

declare type Sensor = TimeoutSensor | DoneSensor | ClickSensor | KeySensor | KeyHoldsSensor;

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

declare interface TextCard extends BaseCard<'TextCard'>, TextContent {
    background_color: ColorHexString;
}

declare interface TextContent {
    text: MarkdownString;
    text_color: ColorHexString;
    font_size: SpatialSize;
    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
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
    video_link: VideoLink;
}

declare interface VideoLink extends BaseAssetLink<"video/mp4"> {
}

export { }
