declare type Action = ClickAction | TimeoutAction | KeyAction;

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
    node_id: NodeId;
}

declare interface BaseSensor<T extends string> {
    sensor_type: T;
}

declare interface BrowserContextSampledEvent extends BaseEvent<'BrowserContextSampledEvent'> {
    user_agent: string;
    viewport_width_px: number;
    viewport_height_px: number;
    display_width_px: number;
    display_height_px: number;
    device_pixel_ratio: number;
}

declare type Card = ImageCard | TextCard | VideoCard;

declare interface ClickAction extends BaseAction<"ClickAction"> {
    x: SpatialPoint;
    y: SpatialPoint;
}

declare interface ClickSensor extends TemporallyBoundedSensor<'ClickSensor'> {
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

declare type Event_2 = TraceStartedEvent | BrowserContextSampledEvent | PageSuspendedEvent | PageResumedEvent | NodeEnteredEvent | NodeExitedEvent | PointerSampledEvent | KeySampledEvent | TraceEndedEvent;

declare interface Graph {
    nodekit_version: string;
    nodes: Record<NodeId, Node_2>;
    transitions: Record<NodeId, Record<SensorId, NodeId>>;
    start: NodeId;
}

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

declare interface KeySampledEvent extends BaseEvent<'KeySampledEvent'> {
    key: PressableKey;
    kind: 'down' | 'up';
}

declare interface KeySensor extends TemporallyBoundedSensor<'KeySensor'> {
    key: PressableKey;
}

declare type MarkdownString = string & {
    __brand: 'MarkdownString';
};

declare type Mask = 'rectangle' | 'ellipse';

declare interface Node_2 {
    cards: Card[];
    sensors: Record<SensorId, Sensor>;
    effects: Effect[];
    board_color: ColorHexString;
}

declare interface NodeEnteredEvent extends BaseNodeEvent<'NodeEnteredEvent'> {
}

declare interface NodeExitedEvent extends BaseNodeEvent<'NodeExitedEvent'> {
    sensor_id: SensorId;
    action: Action;
}

declare type NodeId = string & {
    __brand: 'NodeId';
};

declare type NodeTimePointMsec = number & {
    __brand: 'NodeTimePointMsec';
};

declare interface PageResumedEvent extends BaseEvent<'PageResumedEvent'> {
}

declare interface PageSuspendedEvent extends BaseEvent<'PageSuspendedEvent'> {
}

/**
 * Plays a Graph, returning a Trace of Events.
 * @param graph
 * @param assetUrls
 * @param onEventCallback
 * @param previousEvents
 */
export declare function play(graph: Graph, assetUrls: AssetUrl[], onEventCallback?: ((event: Event_2) => void) | null, previousEvents?: Event_2[]): Promise<Trace>;

declare interface PointerSampledEvent extends BaseEvent<'PointerSampledEvent'> {
    x: SpatialPoint;
    y: SpatialPoint;
    kind: 'down' | 'up' | 'move';
}

declare type PressableKey = string;

declare type Sensor = TimeoutSensor | ClickSensor | KeySensor;

declare type SensorId = string & {
    __brand: 'SensorId';
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

declare interface TemporallyBoundedSensor<T extends string> extends BaseSensor<T> {
    start_msec: NodeTimePointMsec;
    end_msec: NodeTimePointMsec | null;
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
    timeout_msec: NodeTimePointMsec;
}

declare interface Trace {
    nodekit_version: string;
    events: Event_2[];
}

declare interface TraceEndedEvent extends BaseEvent<'TraceEndedEvent'> {
}

declare interface TraceStartedEvent extends BaseEvent<'TraceStartedEvent'> {
}

declare interface VideoCard extends BaseCard<'VideoCard'> {
    video: VideoIdentifier;
    muted: boolean;
    loop: boolean;
}

declare interface VideoIdentifier extends BaseAssetIdentifier<"video/mp4"> {
}

export { }
