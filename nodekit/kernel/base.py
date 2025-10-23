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

# %% Space
from typing import TypedDict
class Region(TypedDict):
    x: SpatialPoint
    y: SpatialPoint
    z_index: int | None  # If None or there are ties, Cards' z-index is determined by CardId(!)
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
    start_msec: NodeTimePointMsec = 0
    end_msec: NodeTimePointMsec | None = None


# %% Pretty much visual cards
class ImageCard(BaseCard):
    image: str

class VideoCard(BaseCard):
    movie: str
    muted: bool = True
    loop: bool = False
    elapsed_msec: TimeElapsedMsec = 0  # current elapsed time in movie

class TextCard(BaseCard):
    text: Annotated[str, pydantic.Field(min_length=0, max_length=10000)]
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

    At a conceptual level, Cards accept inputs from a global context. The global context may provide
    inputs of the following types:
    - User pointer
    - User key press
    - Update commands. (Each Card exposes its own command input types)
    - Clock

    At a conceptual level, any given Card type is fully defined by the following:
    - Its input type, state type, and output type.
    - A rendering function that deterministically maps its current state to a visual representation.
    - A transition function that maps its current input to its next state and any outputs.
    """
    start_msec: NodeTimePointMsec = 0


class VisualSensor(BaseSensor):
    region: Region


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
    background_color: ColorHexString | None
    timeout_msec: NodeTimePointMsec | None


# %%
from typing import Annotated, Literal
from pydantic import BaseModel, Field

# ---------- Primitive aliases ----------
type Integer = int
type Float = float
type String = str
type Boolean = bool
type BaseValue = Integer | Float | String | Boolean


class Lit(BaseModel):
    op: Literal['lit'] = Field(default='lit', frozen=True)
    value: BaseValue | list[BaseValue]  # list supports membership checks


class Ref(BaseModel):
    """
    Stuff that can be referenced, at expression evaluation time:
    - cards/: Dict[CardId, BaseCard]
    - sensors/: Dict[SensorId, BaseSensor]
    - actions/: Dict[SensorId, BaseAction]
    - exit_type: Literal['timed-out', 'completed']
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
        path=['action', 'my-selection-sensor', 'selections']  # bool
    ),
)

timed_out = Cmp(
    op='eq',
    left=Lit(value='TimedOut'),
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
class GraphV2(pydantic.BaseModel):
    nodes: Dict[NodeId, NodeV2]
    transitions: Dict[NodeId, TransitionRuleset]  # If a Node doesn't have a Ruleset, that just means exit once the Node is done.
