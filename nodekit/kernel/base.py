import pydantic
from typing import Literal , Dict, Annotated, Tuple, Set

from nodekit._internal.types.common import (
    SpatialPoint,
    SpatialSize,
    TimeElapsedMsec,
    NodeTimePointMsec,
    ColorHexString,
PressableKey,
)


# %% Cards
class BaseCard(pydantic.BaseModel):
    """
    Cards are finite state machines, whose state has an associated view projection on the Board.
    Whenever a Card receives an input, it may evolve its state and may emit an output.

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
    card_type: str
    x: SpatialPoint
    y: SpatialPoint
    z: int
    width: SpatialSize
    height: SpatialSize

    start_msec: NodeTimePointMsec = 0
    end_msec: NodeTimePointMsec | None  = None


# %% Pretty much visual cards
class ShapeCard(BaseCard):
    shape: Literal['ellipse', 'rectangle'] # The shape of the filled region of the shape.
    color: ColorHexString  # current color
    border_color: ColorHexString | None
    border_width: SpatialSize

class ImageCard(BaseCard):
    image: str

class VideoCard(BaseCard):
    movie: str
    muted: bool = True
    loop: bool = False
    elapsed_msec: TimeElapsedMsec = 0 # current elapsed time in movie

class TextCard(BaseCard):
    text: Annotated[str, pydantic.Field(min_length=0, max_length=10000)]  # current text
    text_color: ColorHexString  # current text color
    background_color: ColorHexString  # current background color
    font_size: SpatialSize = 0.0375


# %% Sensors
NodeId = str
CardId = str # Uniquely identifies a Blot in the Node. Always of form {NodeId}.{BlotName}
SensorId = str

class BaseSensor(pydantic.BaseModel):
    required: bool = True # Whether it is required that the Sensor fires before the Node terminate
    start_msec: NodeTimePointMsec = 0

class VisualSensor(BaseSensor):
    x: SpatialPoint
    y: SpatialPoint
    z: int
    w: SpatialSize
    h: SpatialSize


class SelectSensor(BaseSensor):
    """
    Turns its target cards into selectable, hoverable buttons.
    Selections occur on mouse up.
    In the special case where max_choices = 1, clicking an un-selected Card will automatically de-select and select the target
    """
    card_ids: Set[CardId]
    pattern: str | None # Describes the subset of selections which will fire this sensor. DNF?
    selected: Set[CardId] # Current. Must validate.
    min_choices: int = pydantic.Field(
        default=1,
        ge=0, # Can be zero; note this would fire the Sensor immediately if selected is the empty set
    )
    max_choices: int | None = pydantic.Field(
        default = 1,
        description='In the special case where max_choices = 1, clicking an un-selected Card will automatically de-select and select the target.',
    ) # Fires whenever a valid selection of (min_choices, max_choices) cards is made


class KeySensor(BaseSensor):
    keys: Set[PressableKey] # Fires whenever any one of these keys are pressed.


class FreeTextEntrySensor(BaseSensor):
    pattern: str | None # text entry predicate (as regex) which must be matched before the Sensor fires (e.g., min or max). If None, fires on any text change
    prompt_text: Annotated[str, pydantic.Field(min_length=0, max_length=1000)] # static prompt text shown if text == ''
    text: Annotated[str, pydantic.Field(min_length=0, max_length=10000)] = '' # current
    text_color: ColorHexString # current text color


type BinSelections = Dict[int, Set[int]] # mapping from horizontal bin index to set of vertical bin indices
class GridSelectSensor(BaseSensor):
    """
    A visual Sensor.
    """
    pattern: str | None # todo; doodle predicate which must be matched before Sensor fires. If None, fires whenever any stroke  is made.
    num_bins_horizontal: int = pydantic.Field(ge=1) # cannot be changed at runtime
    num_bins_vertical: int = pydantic.Field(ge=1) # cannot be changed at runtime
    stroke_color: ColorHexString
    selected_bins: BinSelections = pydantic.Field(
        description="The set of (i_h, i_w) coordinates that are currently stroked.",
    )
    gridline_color: ColorHexString | None = None

class SliderSensor(BaseSensor):
    """
    A visual Sensor.
    The thumb always has the appearance of being inactivated until it is interacted with the first time.
    """
    num_ticks: Annotated[int, pydantic.Field(gt=1, lt=1000)]
    tick_index: Annotated[int, pydantic.Field(ge=0)] # initial thumb index
    show_ticks: bool

    orientation: Literal['horizontal', 'vertical']
    track_color: ColorHexString
    thumb_color: ColorHexString


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
    submit_button: TextCard | None = None # Whether to participant must use a submit button to affirm their choices. Hoverable and selectable only when all required Sensors have fired. If None, Node ends on timeout OR when all required Sensors have fired
    background_color: ColorHexString | None
    timeout_msec: NodeTimePointMsec | None

# %%
class Predicate(pydantic.BaseModel):
    """
    A boolean-valued Expression that is applied to an Action
    Expression[bool]
        - Timeout reached (current Sensor states are reported, as is)
    - Submit button pressed, affirming current Sensor states (current  Sensor states are reported, as is)
    - Auto-submit, triggered on All required Sensors have been interacted with satisfactorily (some Sensors have Guards, like regexes)

    """
    ...


# %%
class GraphV2(pydantic.BaseModel):
    nodes: Dict[NodeId, NodeV2]
    transitions: Dict[NodeId, Dict[SensorId, NodeId]]

# %%
from pydantic import BaseModel, Field, model_validator
from typing import Literal, List, Union


BaseValue = bool | int | float

class Lit[V: BaseValue](BaseModel):
    op: Literal["lit"]  = 'lit'
    value: V
class SetLit(BaseModel):
    op: Literal["set"]
    values: List[Lit]

class Ref(BaseModel):
    op: Literal["ref"] = 'ref'
    path: List[str] # {sensor_id}.{value}

# Boolean-valued expressions:
class Cmp(BaseModel):
    op: Literal["eq","ne","lt","le","gt","ge"]
    left: "Expr"
    right: "Expr"

class InOp(BaseModel):
    op: Literal["in","not_in"]
    left: "Expr"
    right: SetLit

class Between(BaseModel):
    op: Literal["between"]
    ref: Ref
    lo: Lit
    hi: Lit

# Boolean connectives:
class And(BaseModel):
    op: Literal["and"]
    args: List["Expr"]
class Or(BaseModel):
    op: Literal["or"]
    args: List["Expr"]
class Not(BaseModel):
    op: Literal["not"]
    arg: "Expr"

Expr = Annotated[
    Union[Lit, SetLit, Ref, Cmp, InOp, Between, And, Or, Not],
    pydantic.Field(discriminator='op')
]

chose_correct = Cmp(
    op='eq',
    left=Ref(
        path=['choice', 'left-choice'] # bool
    ),
    right=Lit(
        value=True,
    )
)