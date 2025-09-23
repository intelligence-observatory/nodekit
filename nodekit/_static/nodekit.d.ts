declare type Action = ClickAction | TimeoutAction | KeyAction;

declare interface ActionEvent extends BaseNodeEvent<'ActionEvent'> {
    sensor_index: SensorIndex;
    action: Action;
}

declare type AssetIdentifier = ImageIdentifier | VideoIdentifier;

declare interface AssetUrl {
    identifier: AssetIdentifier;
    url: string;
}

declare interface BaseAction<T extends string> {
    action_type: T;
}

declare interface BaseAssetIdentifier<MT extends string> {
    sha256: SHA256;
    mime_type: MT;
}

declare interface BaseCard<T extends string> {
    card_type: T;
    x: SpatialPoint;
    y: SpatialPoint;
    w: SpatialSize;
    h: SpatialSize;
    start_msec: NodeTimePointMsec;
    end_msec: NodeTimePointMsec | null;
}

declare interface BaseEffect<T extends string> {
    effect_type: T;
    start_msec: NodeTimePointMsec;
    end_msec: NodeTimePointMsec | null;
}

declare interface BaseEvent<T extends string> {
    event_type: T;
    t: TimeElapsedMsec;
}

declare interface BaseNodeEvent<T extends string> extends BaseEvent<T> {
    node_index: NodeIndex;
}

declare interface BaseSensor<T extends string> {
    sensor_type: T;
    start_msec: NodeTimePointMsec;
    end_msec: NodeTimePointMsec | null;
}

declare interface Board {
    board_width_px: number;
    board_height_px: number;
    background_color: ColorHexString;
}

declare interface BrowserContextEvent extends BaseEvent<'BrowserContextEvent'> {
    user_agent: string;
    viewport_width_px: number;
    viewport_height_px: number;
    display_width_px: number;
    display_height_px: number;
}

declare type Card = ImageCard | TextCard | VideoCard;

declare interface ClickAction extends BaseAction<"ClickAction"> {
    x: SpatialPoint;
    y: SpatialPoint;
}

declare interface ClickSensor extends BaseSensor<'ClickSensor'> {
    x: SpatialPoint;
    y: SpatialPoint;
    w: SpatialSize;
    h: SpatialSize;
    mask: Mask;
}

declare type ColorHexString = string & {
    __brand: 'ColorHexString';
};

declare type Effect = HidePointerEffect;

declare interface EndEvent extends BaseEvent<'EndEvent'> {
}

declare type Event_2 = StartEvent | BrowserContextEvent | LeaveEvent | ReturnEvent | NodeStartEvent | ActionEvent | NodeEndEvent | EndEvent;

declare interface Graph {
    nodekit_version: string;
    nodes: Node_2[];
    transitions: Transition[];
}

declare interface HidePointerEffect extends BaseEffect<'HidePointerEffect'> {
    end_msec: NodeTimePointMsec;
}

declare interface ImageCard extends BaseCard<'ImageCard'> {
    image: ImageIdentifier;
}

declare interface ImageIdentifier extends BaseAssetIdentifier<"image/png"> {
}

declare interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}

declare interface KeySensor extends BaseSensor<'KeySensor'> {
    key: PressableKey;
}

declare interface LeaveEvent extends BaseEvent<'LeaveEvent'> {
}

declare type MarkdownString = string & {
    __brand: 'MarkdownString';
};

declare type Mask = 'rectangle' | 'ellipse';

declare interface Node_2 {
    cards: Card[];
    sensors: Sensor[];
    effects: Effect[];
    board: Board;
}

declare interface NodeEndEvent extends BaseNodeEvent<'NodeEndEvent'> {
}

declare type NodeIndex = number & {
    __brand: "NodeIndex";
};

declare interface NodeStartEvent extends BaseNodeEvent<'NodeStartEvent'> {
}

declare type NodeTimePointMsec = number & {
    __brand: 'NodeTimePointMsec';
};

/**
 * Plays a Timeline, returning a Trace of Events.
 * @param timeline
 * @param assetUrls
 * @param onEventCallback
 * @param previousEvents
 */
export declare function play(timeline: Graph, assetUrls: AssetUrl[], onEventCallback?: ((event: Event_2) => void) | null, previousEvents?: Event_2[]): Promise<Trace>;

declare type PressableKey = "Enter" | " " | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

declare interface ReturnEvent extends BaseEvent<'ReturnEvent'> {
}

declare type Sensor = TimeoutSensor | ClickSensor | KeySensor;

declare type SensorIndex = number & {
    __brand: "SensorIndex";
};

declare type SHA256 = string & {
    __brand: 'SHA256';
};

declare type SpatialPoint = number & {
    __brand: 'SpatialPoint';
};

declare type SpatialSize = number & {
    __brand: 'SpatialSize';
};

declare interface StartEvent extends BaseEvent<'StartEvent'> {
}

declare interface TextCard extends BaseCard<'TextCard'> {
    text: MarkdownString;
    font_size: SpatialSize;
    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
    text_color: ColorHexString;
    background_color: ColorHexString;
}

declare type TimeElapsedMsec = number & {
    __brand: 'TimeElapsedMsec';
};

declare interface TimeoutAction extends BaseAction<"TimeoutAction"> {
}

declare interface TimeoutSensor extends BaseSensor<'TimeoutSensor'> {
    end_msec: null;
}

declare interface Trace {
    nodekit_version: string;
    events: Event_2[];
}

declare interface Transition {
    node_index: NodeIndex | 'START';
    sensor_index: SensorIndex;
    next_node_index: NodeIndex | 'END';
}

declare interface VideoCard extends BaseCard<'VideoCard'> {
    video: VideoIdentifier;
    muted: boolean;
    loop: boolean;
}

declare interface VideoIdentifier extends BaseAssetIdentifier<"video/mp4"> {
}

export { }
