import enum

import pydantic
from typing import Literal, Dict, Annotated, Tuple, Set
from typing import Pattern

from nodekit._internal.types.common import (
    SpatialPoint,
    SpatialSize,
    TimeElapsedMsec,
    NodeTimePointMsec,
    ColorHexString,
    PressableKey,
)
from nodekit._internal.types.assets import Image, Video
from nodekit._internal.types.effects.effects import Effect
from nodekit._internal.types.events.events import Event
type RegisterId = str

# %% Space
from typing import TypedDict
class Region(TypedDict):
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialSize
    h: SpatialSize


# %% Cards
class BaseCard(pydantic.BaseModel):
    """
    Cards are visual elements that are placed on the Board for a timespan.
    They occupy a Region.
    """
    card_type: str
    region: Region
    z_index: int | None  # If None or there are ties, Cards' z-index is determined by CardId(!)
    start_msec: NodeTimePointMsec = 0
    end_msec: NodeTimePointMsec | None = None


# %% Pretty much visual cards
class ImageCard(BaseCard):
    image: Image

class VideoCard(BaseCard):
    movie: Video
    muted: bool = True
    loop: bool = False
    playback_start_delay_msec: TimeElapsedMsec = 0  # current elapsed time in movie


class TextCard(BaseCard):
    text: Annotated[str, pydantic.Field(max_length=10000)]
    text_color: ColorHexString  # current text color
    background_color: ColorHexString  # current background color
    font_size: SpatialSize = 0.0375
    ...


# %% Sensors
NodeId = str
CardId = str  # Uniquely identifies a Blot in the Node. Always of form {NodeId}.{BlotName}
SensorId = str

class BaseSensor(pydantic.BaseModel):
    """

    At a conceptual level, Sensors accept inputs from a global context. The global context may provide
    inputs of the following types:
    - User pointer
    - User key press
    - Clock time

    At a conceptual level, any given Sensor type is fully defined by the following:
    - Its input type, state type, and output type.
    - A rendering function that deterministically maps its current state to a visual representation.
    - A transition function that maps its current input to its next state and any outputs.
    """
    start_msec: NodeTimePointMsec = pydantic.Field(
        default=0,
        description='The time when the Sensor is armed.'
    )


class VisualSensor(BaseSensor):
    region: Region
    visibility_start_msec: NodeTimePointMsec = pydantic.Field(
        default=0,
        description='The time when the Sensor becomes visible. Must be less than or equal to .start_msec'
    )

    # todo: add validator here


class SelectSensor(BaseSensor):
    """
    Turns its target cards into selectable, hoverable buttons.
    Selections occur on mouse up.
    In the special case where max_choices = 1, clicking an un-selected Card will automatically de-select and select the target
    """
    card_ids: Set[CardId]
    min_choices: int = pydantic.Field(
        default=1,
        ge=0,  # Can be zero; note this would fire the Sensor immediately if selected is the empty set
    )
    max_choices: int | None = pydantic.Field(
        default=1,
        description='In the special case where max_choices = 1, clicking an un-selected Card will automatically de-select and select the target.',
    )


class KeySensor(BaseSensor):
    keys: Set[PressableKey]  # Fires whenever any one of these keys are pressed.


class FreeTextEntrySensor(VisualSensor):
    """
    Highly recommended that this is used with a SubmitSensor.
    """
    text_color: ColorHexString  # current text color
    pattern: Pattern[str] | None = pydantic.Field(
        default = '^.{1,10000}$', # Must write something between 1 and 10,000 characters
        examples=[
            '^.{7,49}$' # between 7 and 49 characters
        ],
        validate_default=True,
        description='text entry predicate (as regex) which must be matched before the Sensor is submittable (e.g., min or max characters). If None, fires on any text change'
    )


type BinSelections = Dict[int, Set[int]]  # mapping from horizontal bin index to set of vertical bin indices
class GridSelectSensor(BaseSensor):
    """
    A visual Sensor.
    """
    num_bins_horizontal: int = pydantic.Field(ge=1)  # cannot be changed at runtime
    num_bins_vertical: int = pydantic.Field(ge=1)  # cannot be changed at runtime
    selection_color: ColorHexString
    gridline_color: ColorHexString | None = None


class SliderSensor(VisualSensor):
    """
    A visual Sensor.
    The thumb always has the appearance of being inactivated until it is interacted with the first time.
    """
    num_ticks: Annotated[int, pydantic.Field(gt=1, le=1000)]  # If None, no snapping.
    tick_index: Annotated[int, pydantic.Field(ge=0)]  # initial
    show_ticks: bool
    orientation: Literal['horizontal', 'vertical']  # vertical positive direction is bottom to top; horizontal positive direction is left to right.
    track_color: ColorHexString
    thumb_color: ColorHexString


class SubmitSensor(VisualSensor):
    """
    This Sensor is inactivated until all other Sensors, other than other SubmitSensors, are in submittable state.
    """
    ...


# %%
class BaseAction(pydantic.BaseModel):
    action_type: str
    t: TimeElapsedMsec

# %%
from typing import Any

class NodeV2(pydantic.BaseModel):
    """
    Ways to terminate a Node:


    Keying transitions between Nodes:
        - On termination type (timeout | submit)
        - On Sensor value(s) (use register syntax)
        - Fallthrough
    """
    cards: Dict[CardId, BaseCard]
    sensors: Dict[SensorId, BaseSensor]
    effects: list[Effect]
    background_color: ColorHexString
    min_duration_msec: NodeTimePointMsec # Guards Node exit, even if all Sensors have been fulfilled.
    max_duration_msec: NodeTimePointMsec | None = None # Automatically terminates the Node here.
    annotations: Any


# %%
class Trace(pydantic.BaseModel):
    #results: list['NodeResult'] = pydantic.Field(description='The tidy, rolled-up view of what happened.')
    events: list[Event] = pydantic.Field(description='The canonical list of Events which describe how the Participant behaved across the Graph.')


class NodeResult(pydantic.BaseModel):
    """
    A rolled up ball o' facts. Maybe this is just the result of a blessed projection function on the Python side, derived from the event trace?
    Downside is that Trace becomes less self-explaining.
    """

    node_id: NodeId
    node: NodeV2 = pydantic.Field(description='The Node itself.')
    t_entered: TimeElapsedMsec = pydantic.Field(description='When the Node started occurred.')
    t_exited: TimeElapsedMsec = pydantic.Field(description='When the Node started occurred.')
    actions: Dict[SensorId, BaseAction] # The last commits of each Sensor.
    timed_out: bool = False


# %%
from typing import Annotated, Literal, Self
from pydantic import BaseModel, Field

# ---------- Primitive aliases ----------
type Integer = int
type Float = float
type String = str
type Boolean = bool
type BaseValue = Integer | Float | String | Boolean


class DtypeEnum(enum.Enum):
    INT = 'int'
    FLOAT = 'float'
    STR = 'str'
    BOOL = 'bool'

class Lit(BaseModel):
    op: Literal['lit'] = Field(default='lit', frozen=True)
    dtype: DtypeEnum | None = None
    value: BaseValue

    # Infer dtype
    @pydantic.model_validator(mode='after')
    def set_or_check_dtype(self, ) -> Self:
        if self.dtype is None:
            if isinstance(self.value, bool):
                self.dtype = DtypeEnum.BOOL
            elif isinstance(self.value, int):
                self.dtype = DtypeEnum.INT
            elif isinstance(self.value, float):
                self.dtype = DtypeEnum.FLOAT
            elif isinstance(self.value, str):
                self.dtype = DtypeEnum.STR
            else:
                raise TypeError(f"Unsupported literal type: {type(self.value)}")
        else:
            # Validate consistency
            expected = {
                DtypeEnum.BOOL: bool,
                DtypeEnum.INT: int,
                DtypeEnum.FLOAT: float,
                DtypeEnum.STR: str,
            }[self.dtype]
            if not isinstance(self.value, expected):
                raise TypeError(
                    f"dtype '{self.dtype}' does not match value type {type(self.value)}"
                )
        return self


class Ref(BaseModel):
    """
    Stuff that can be referenced, at expression evaluation time:
    - registers/: Dict[RegisterId, Register]
    - cards/: Dict[CardId, BaseCard]
    - sensors/: Dict[SensorId, BaseSensor]
    - actions/: Dict[SensorId, BaseAction]
    - timed_out: boolean
    """
    op: Literal['ref'] = Field(default='ref', frozen=True)
    path: list[str | int]  # e.g. ["trial","rt_ms"] or ["clicks",0,"button"]


class Cmp(BaseModel):
    op: Literal['eq', 'ne', 'lt', 'le', 'gt', 'ge'] = Field(frozen=True)
    left: 'Expr'
    right: 'Expr'


class InOp(BaseModel):
    op: Literal['in', 'not_in'] = Field(frozen=True)
    left: 'Expr'
    right: 'Expr'  # expect list-like on the right


class And(BaseModel):
    op: Literal['and'] = Field(default='and', frozen=True)
    args: list['Expr']


class Or(BaseModel):
    op: Literal['or'] = Field(default='or', frozen=True)
    args: list['Expr']


class Not(BaseModel):
    op: Literal['not'] = Field(default='not', frozen=True)
    arg: 'Expr'


Expr = Annotated[Lit | Ref | Cmp | InOp | And | Or | Not, Field(discriminator='op')]
type Predicate = And | Or | Not | Cmp | InOp

for cls in (Cmp, InOp, And, Or, Not):
    cls.model_rebuild()

# %% Example
chose_correct = InOp(
    op='in',
    left=Lit(
        value='my-left-card',
    ),
    right=Ref(
        path=['actions', 'my-selection-sensor', 'selections']  # bool
    ),
)

timed_out = Cmp(
    op='eq',
    left=Lit(
        value='TimedOut',
    ),
    right=Ref(
        path=['exit_type']
    )
)

# %%
class TransitionRule(pydantic.BaseModel):
    when: Predicate
    to: NodeId

class TransitionRuleset(pydantic.BaseModel):
    transition_rules: list[TransitionRule] = pydantic.Field(default_factory=list)  # evaluate top→bottom
    else_to: NodeId | None = None  # fallthrough. None means exit the Graph.

# %%
class RegisterUpdate(BaseModel):
    when: Predicate
    register: RegisterId
    assignment: Expr

# %%
class GraphV2(pydantic.BaseModel):
    nodes: Dict[NodeId, NodeV2]

    registers: Dict[RegisterId, Lit] = pydantic.Field(default_factory=dict)
    register_updates: Dict[NodeId, list[RegisterUpdate]]   = pydantic.Field(default_factory=dict) # If a Node doesn't have an associated RegisterUpdate, just leave the Register alone.

    transitions: Dict[NodeId, TransitionRuleset]  # If a Node doesn't have a Ruleset, that just means exit once the Node is done.
