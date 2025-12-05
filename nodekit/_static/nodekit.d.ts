declare type Action = ClickAction | KeyAction | SliderAction | FreeTextEntryAction | WaitAction | SelectAction | MultiSelectAction | ProductAction | SumAction;

declare interface ActionTakenEvent extends BaseNodeEvent<'ActionTakenEvent'> {
    action: Action;
}

declare interface Add extends BaseArithmeticOperation {
    op: "add";
}

declare interface And extends BaseExpression {
    op: "and";
    args: Expression[];
}

declare interface Append extends ListOp {
    op: "append";
    value: Expression;
}

declare interface BaseAction<T extends string> extends Dict {
    action_type: T;
    t: TimeElapsedMsec;
}

declare interface BaseArithmeticOperation extends BaseExpression {
    lhs: Expression;
    rhs: Expression;
}

declare interface BaseAsset<MT extends string> {
    sha256: SHA256;
    media_type: MT;
    locator: Locator;
}

declare interface BaseCard<T extends string> {
    card_type: T;
}

declare interface BaseCmp extends BaseExpression {
    lhs: Expression;
    rhs: Expression;
}

declare interface BaseEvent<T extends string> {
    event_type: T;
    t: TimeElapsedMsec;
}

declare interface BaseExpression {
    op: string;
}

declare interface BaseLocator<LT extends string> {
    locator_type: LT;
}

declare interface BaseNodeEvent<T extends string> extends BaseEvent<T> {
    node_id: NodeId;
}

declare interface BaseSensor<T extends string> {
    sensor_type: T;
}

declare interface BaseTransition<T extends string> {
    transition_type: T;
}

declare type Boolean_2 = Readonly<boolean>;

declare interface Branch extends BaseTransition<'Branch'> {
    cases: Array<{
        when: Expression;
        then: LeafTransition;
    }>;
    otherwise: LeafTransition;
}

declare interface BrowserContextSampledEvent extends BaseEvent<'BrowserContextSampledEvent'> {
    user_agent: string;
    timestamp_client: string;
    device_pixel_ratio: number;
    display: RegionSizePx;
    viewport: RegionSizePx;
}

declare type Card = LeafCard | CompositeCard;

declare interface ClickAction extends BaseAction<"ClickAction"> {
    x: SpatialPoint;
    y: SpatialPoint;
}

declare interface ClickSensor extends BaseSensor<'ClickSensor'> {
    region: Region;
}

declare type ColorHexString = String_2 & {
    __brand: 'ColorHexString';
};

declare interface CompositeCard extends BaseCard<'CompositeCard'> {
    children: Record<string, Card>;
}

declare interface Concat extends ListOp {
    op: "concat";
    value: Expression;
}

declare interface Dict {
    readonly [key: String_2]: Value;
}

declare interface Div extends BaseArithmeticOperation {
    op: "div";
}

declare interface End extends BaseTransition<'End'> {
}

declare interface Eq extends BaseCmp {
    op: "eq";
}

declare type Event_2 = BrowserContextSampledEvent | PageSuspendedEvent | PageResumedEvent | KeySampledEvent | PointerSampledEvent | NodeStartedEvent | ActionTakenEvent | NodeEndedEvent | TraceStartedEvent | TraceEndedEvent;

declare type Expression = Reg | Local | LastAction | GetListItem | GetDictValue | Lit | If | Not | Or | And | Eq | Ne | Gt | Ge | Lt | Le | Add | Sub | Mul | Div | Append | Concat | Slice | Map_2 | Filter | Fold;

declare interface FileSystemPath extends BaseLocator<"FileSystemPath"> {
    path: string;
}

declare interface Filter extends ListOp {
    op: "filter";
    /**
     * The variable name the current array element will be assigned to in locals. Can be referenced in the func: Expression with Loc(...).
     */
    cur: LocalVariableName;
    /**
     * Expression that will be applied to each element of the array
     * and interpreted as a predicate.
     */
    predicate: Expression;
}

declare type Float = Readonly<number>;

declare interface Fold extends ListOp {
    op: "fold";
    init: Expression;
    /**
     * The variable name the cumulant will be assigned to. Can be referenced in the func: Expression with Var(...).
     */
    acc: LocalVariableName;
    /**
     * The variable name the current array element will be assigned to in locals. Can be referenced in the func: Expression with Loc(...).
     */
    cur: LocalVariableName;
    func: Expression;
}

declare interface FreeTextEntryAction extends BaseAction<"FreeTextEntryAction"> {
    text: string;
}

declare interface FreeTextEntrySensor extends BaseSensor<'FreeTextEntrySensor'> {
    prompt: string;
    font_size: SpatialSize;
    min_length: number;
    max_length: number | null;
    region: Region;
}

declare interface Ge extends BaseCmp {
    op: "ge";
}

declare interface GetDictValue extends BaseExpression {
    /**
     * Get a value from a Dict.
     */
    op: "gdv";
    d: Expression;
    key: Expression;
}

declare interface GetListItem extends BaseExpression {
    /**
     * Get an item from a List.
     */
    op: "gli";
    list: Expression;
    index: Expression;
}

declare interface Go extends BaseTransition<'Go'> {
    to: NodeId;
    register_updates: Record<RegisterId, Expression>;
}

declare interface Graph {
    nodekit_version: string;
    nodes: Record<NodeId, Node_2>;
    transitions: Record<NodeId, Transition>;
    start: NodeId;
    registers: Record<RegisterId, Value>;
}

declare interface Gt extends BaseCmp {
    op: "gt";
}

declare interface If extends BaseExpression {
    op: "if";
    cond: Expression;
    then: Expression;
    otherwise: Expression;
}

declare interface Image_2 extends BaseAsset<"image/png" | "image/svg+xml" | "image/gif"> {
}

declare interface ImageCard extends BaseCard<'ImageCard'> {
    image: Image_2;
    region: Region;
}

declare type Integer = Readonly<number>;

declare interface KeyAction extends BaseAction<"KeyAction"> {
    key: PressableKey;
}

declare interface KeySampledEvent extends BaseEvent<'KeySampledEvent'> {
    key: PressableKey;
    kind: 'down' | 'up';
}

declare interface KeySensor extends BaseSensor<'KeySensor'> {
    keys: Set<PressableKey>;
}

declare interface LastAction extends BaseExpression {
    /**
     * Evaluates to the last completed Node's Action.
     */
    op: "la";
}

declare interface Le extends BaseCmp {
    op: "le";
}

declare type LeafCard = ImageCard | VideoCard | TextCard;

declare type LeafTransition = Go | End;

declare type List = Value[];

declare interface ListOp extends BaseExpression {
    array: Expression;
}

declare interface Lit extends BaseExpression {
    /**
     * Literal value.
     */
    op: "lit";
    value: Value;
}

declare interface Local extends BaseExpression {
    /**
     * Evaluates to the value of the specified Local Variable.
     */
    op: "local";
    name: LocalVariableName;
}

declare type LocalVariableName = String_2;

declare type Locator = FileSystemPath | ZipArchiveInnerPath | RelativePath | URL_2;

declare interface Lt extends BaseCmp {
    op: "lt";
}

declare interface Map_2 extends ListOp {
    op: "map";
    /**
     * The variable name the current array element will be assigned to in locals. Can be referenced in the func: Expression with Loc(...).
     */
    cur: LocalVariableName;
    /**
     * Expression that will be applied to each element of the array.
     */
    func: Expression;
}

declare type MarkdownString = String_2 & {
    __brand: 'MarkdownString';
};

declare type Mask = 'ellipse' | 'rectangle' & {
    __brand: 'Mask';
};

declare interface Mul extends BaseArithmeticOperation {
    op: "mul";
}

declare interface MultiSelectAction extends BaseAction<"MultiSelectAction"> {
    selections: string[];
}

declare interface MultiSelectSensor extends BaseSensor<'MultiSelectSensor'> {
    choices: Record<string, Card>;
    min_selections: number;
    max_selections: number | null;
    confirm_button: Card;
}

declare interface Ne extends BaseCmp {
    op: "ne";
}

declare interface Node_2 {
    stimulus: Card;
    sensor: Sensor;
    board_color: ColorHexString;
    hide_pointer: boolean;
}

declare interface NodeEndedEvent extends BaseNodeEvent<'NodeEndedEvent'> {
}

declare type NodeId = String_2 & {
    __brand: 'NodeId';
};

declare interface NodeStartedEvent extends BaseNodeEvent<'NodeStartedEvent'> {
}

declare interface Not extends BaseExpression {
    op: "not";
    operand: Expression;
}

declare interface Or extends BaseExpression {
    op: "or";
    args: Expression[];
}

declare interface PageResumedEvent extends BaseEvent<'PageResumedEvent'> {
}

declare interface PageSuspendedEvent extends BaseEvent<'PageSuspendedEvent'> {
}

declare type PixelSize = Integer & {
    __brand: 'PixelSize';
};

/**
 * Plays a Graph, returning a Trace of Events.
 * @param graph
 * @param onEventCallback
 * @param debugMode
 */
export declare function play(graph: Graph, onEventCallback?: ((event: Event_2) => void), debugMode?: boolean): Promise<Trace>;

declare interface PointerSampledEvent extends BaseEvent<'PointerSampledEvent'> {
    x: SpatialPoint;
    y: SpatialPoint;
    kind: 'down' | 'up' | 'move';
}

declare type PressableKey = String_2;

declare interface ProductAction extends BaseAction<'ProductAction'> {
    child_actions: Record<string, Action>;
}

declare interface ProductSensor extends BaseSensor<'ProductSensor'> {
    children: Record<string, Sensor>;
}

declare interface Reg extends BaseExpression {
    /**
     * Evaluates to the value stored in the specified Graph Register.
     */
    op: "reg";
    id: RegisterId;
}

declare interface Region {
    x: SpatialPoint;
    y: SpatialPoint;
    w: SpatialSize;
    h: SpatialSize;
    z_index: number | null;
    mask: Mask;
}

declare interface RegionSizePx {
    width_px: PixelSize;
    height_px: PixelSize;
}

declare type RegisterId = String_2 & {
    __brand: 'RegisterId';
};

declare interface RelativePath extends BaseLocator<"RelativePath"> {
    relative_path: string;
}

declare interface SelectAction extends BaseAction<"SelectAction"> {
    selection: string;
}

declare interface SelectSensor extends BaseSensor<'SelectSensor'> {
    choices: Record<string, Card>;
}

declare type Sensor = ClickSensor | KeySensor | SliderSensor | FreeTextEntrySensor | WaitSensor | SelectSensor | MultiSelectSensor | ProductSensor | SumSensor;

declare type SHA256 = String_2 & {
    __brand: 'SHA256';
};

declare interface Slice extends ListOp {
    op: "slice";
    start: Expression;
    end: Expression | null;
}

declare interface SliderAction extends BaseAction<"SliderAction"> {
    bin_index: SliderBinIndex;
}

declare type SliderBinIndex = number & {
    __brand: 'SliderBinIndex';
};

declare interface SliderSensor extends BaseSensor<'SliderSensor'> {
    num_bins: number;
    show_bin_markers: boolean;
    initial_bin_index: SliderBinIndex;
    orientation: 'horizontal' | 'vertical';
    region: Region;
}

declare type SpatialPoint = Float & {
    __brand: 'SpatialPoint';
};

declare type SpatialSize = Float & {
    __brand: 'SpatialSize';
};

declare type String_2 = Readonly<string>;

declare interface Sub extends BaseArithmeticOperation {
    op: "sub";
}

declare interface SumAction extends BaseAction<'SumAction'> {
    child_id: string;
    child_action: Action;
}

declare interface SumSensor extends BaseSensor<'SumSensor'> {
    children: Record<string, Sensor>;
}

declare interface TextCard extends BaseCard<'TextCard'> {
    text: MarkdownString;
    font_size: SpatialSize;
    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
    text_color: ColorHexString;
    background_color: ColorHexString;
    region: Region;
}

declare type TimeDurationMsec = Integer & {
    __brand: 'TimeDurationMsec';
};

declare type TimeElapsedMsec = Integer & {
    __brand: 'TimeElapsedMsec';
};

declare interface Trace {
    nodekit_version: string;
    events: Event_2[];
}

declare interface TraceEndedEvent extends BaseEvent<'TraceEndedEvent'> {
}

declare interface TraceStartedEvent extends BaseEvent<'TraceStartedEvent'> {
}

declare type Transition = Go | Branch | End;

declare interface URL_2 extends BaseLocator<"URL"> {
    url: string;
}

declare type Value = Boolean_2 | Integer | Float | String_2 | List | Dict;

declare interface Video extends BaseAsset<"video/mp4"> {
}

declare interface VideoCard extends BaseCard<'VideoCard'> {
    video: Video;
    loop: boolean;
    region: Region;
}

declare interface WaitAction extends BaseAction<"WaitAction"> {
}

declare interface WaitSensor extends BaseSensor<"WaitSensor"> {
    duration_msec: TimeDurationMsec;
}

declare interface ZipArchiveInnerPath extends BaseLocator<"ZipArchiveInnerPath"> {
    zip_archive_path: string;
    inner_path: string;
}

export { }
