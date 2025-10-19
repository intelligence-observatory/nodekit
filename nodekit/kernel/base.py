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
    #z: SpatialPoint
    width: SpatialSize
    height: SpatialSize
    placed: bool = True # Whether it is currently placed on the Board.

# %% Mixins for Card affordances
type SelectionState = bool
class SelectableBlotMixin(pydantic.BaseModel):
    selected: SelectionState = False
    selectable: bool = False  # whether its selection state can be toggled or not

    # Visuals
    selected_color: ColorHexString | None # if None, no selected effect
    unselected_color: ColorHexString | None # if None, no unselected effect
    unselectable_color: ColorHexString | None # if None, no unselectable effect

class HoverableBlotMixin(pydantic.BaseModel):
    hoverable: bool = False
    hover_color: ColorHexString | None  # if None, no hover effect

class DraggableBlotMixin(pydantic.BaseModel):
    draggable: bool = False


# %%
class ShapeCard(BaseCard):
    shape: Literal['ellipse', 'rectangle'] # The shape of the filled region of the shape.
    color: ColorHexString  # current color
    border_color: ColorHexString | None
    border_width: SpatialSize

class SliderCard(BaseCard):
    num_ticks: Annotated[int, pydantic.Field(gt=1, lt=1000)]
    tick_index: Annotated[int, pydantic.Field(ge=0)]
    show_ticks: bool
    activated: bool = pydantic.Field(description='Whether the thumb has been activated. One-way transition.')

    orientation: Literal['horizontal', 'vertical']
    track_color: ColorHexString
    thumb_color: ColorHexString

class FreeTextEntryCard(BaseCard):
    prompt_text: Annotated[str, pydantic.Field(min_length=0, max_length=1000)] # static prompt text shown if text == ''
    text: Annotated[str, pydantic.Field(min_length=0, max_length=10000)] # current text
    text_color: ColorHexString # current text color

class ImageCard(BaseCard, SelectableBlotMixin, HoverableBlotMixin, DraggableBlotMixin):
    image: str # URL or base64-encoded image data or identifier. Cannot be changed after instantiation.

class MovieCard(BaseCard, SelectableBlotMixin, HoverableBlotMixin, DraggableBlotMixin):
    movie: str # URL or base64-encoded movie data or identifier. Cannot be changed after instantiation.
    muted: bool = True
    elapsed_msec: TimeElapsedMsec = 0 # current elapsed time in movie
    playing: bool = True

type BinSelections = Dict[int, Set[int]] # mapping from horizontal bin index to set of vertical bin indices
class DoodleCard(BaseCard):
    num_bins_horizontal: int = pydantic.Field(ge=1) # cannot be changed at runtime
    num_bins_vertical: int = pydantic.Field(ge=1) # cannot be changed at runtime
    stroke_color: ColorHexString
    selected_bins: BinSelections = pydantic.Field(
        description="The set of (i_h, i_w) coordinates that are currently stroked.",
    )

class TextCard(BaseCard, SelectableBlotMixin, HoverableBlotMixin, DraggableBlotMixin):
    text: Annotated[str, pydantic.Field(min_length=0, max_length=10000)]  # current text
    text_color: ColorHexString  # current text color
    background_color: ColorHexString  # current background color
    font_size: SpatialSize = 0.0375


# %% CardOutputs
class CardEvent[T: str](pydantic.BaseModel):
    card_event_type: T
    t: TimeElapsedMsec

class Selected(CardEvent[Literal['Selected']]):
    selection_state: SelectionState

class Dragged(CardEvent[Literal['Dragged']]):
    x: SpatialPoint = pydantic.Field(description='The x-coordinate of the drag event, in Board units.')
    y: SpatialPoint = pydantic.Field(description='The y-coordinate of the drag event, in Board units.')

class SliderMoved(CardEvent[Literal['SliderMoved']]):
    tick_index: int

class TextEntered(CardEvent[Literal['TextEntered']]):
    text: str

class Doodled(CardEvent[Literal['Doodled']]):
    selected_bins: BinSelections


# %% Registers
RegisterId = str # Uniquely identifies a Register in the Node. Always of form {CardId}.{property}
#type RegisterValueType = Union of all the types of fields in the Blots above

# %%
"""
Types of update rules in the flows I've noticed so far: 
- "Starting and stopping cards": WHEN t  >= t, ASSIGN .placed
- "Activating a submit button": WHEN {source card expression}, ASSIGN .selectable
- "Preventing further selections": WHEN {source card expression}, ASSIGN .selectable 
- "Snapping a dragged card": WHEN {drag ends}, ASSIGN {expression which assigns x,y to l2 distance minimal snap position}
- "Looping a movie": WHEN {movie cards ends expression}, set .elapsed_msec = 0
- "Pausing a movie":
"""

class Predicate(...):
    ...
    # WHEN clock.t >= T
    # WHEN slider.touched
    # WHEN card.selected
    #


class UpdateRule(pydantic.BaseModel):
    when: Predicate
    assign: Dict[RegisterId, Expression]

# %%
"""
In the same way Cards emit an Output, Nodes emit an Output. But:
 1. What is the output type?
    - Fact: The full trace of CardEvents is preserved by default, but should be considered optional.
    - Fact: the output type should be derivable from the Events; it is a projection. 
    - Fact: the output should have a semantic tag determined by a scheme provided by the user. 
 2. When is the output emitted?
    - Fact: The output is emitted _once_.
    - Fact: the output is emitted when an ExitRule (Sensor?) is fired. 

I think I want Exits to be semantic, so they can determine between-Node flow. 
Up til this point, I had been implementing "trials" as compositions of Nodes...Hmm...I should think 
through the following inter-Node flows: 
- Staircase. If correct, transition to the next Node with distinct parameters; needs to be a global register
- Feedback screen contingent on user Actions (e.g. fixing the doodle; playing back?)

I guess I'm okay living with the idea that Node outputs are basically enums (accompanied by nonfunctional 
semantic fact derivations – Actions ) where the enum values set by the author, not arbitrary values.

i.e., we can observe that any Action consists of _the value itself_ and a function which tags it 
into an enum value (or no-ops).

As for the Action value specification itself, let's keep it simple; it's always an ADT 
of the CardEvents. 

Maybe we can roll up all the typical flows (compositions of UpdateRules / ExitRules) in a concept 
called a "Sensor". A Sensor 'wires' Cards together in the global context, and defines an exit condition. 
One Sensor maps to one exit. Sensors are author-space concepts.

SelectSensor:
    card_id: SelectableCard 
    when:
    
MultiSelectSensor:
    selectable_ids: Dict[CardId, bool] 
    min_choices: bool
    max_choices: bool

SliderSensor: 
    

ConfirmSensor:
    sensor: 
    confirm_card: SelectableCard
"""
# %%
CardId = str # Uniquely identifies a Blot in the Node. Always of form {NodeId}.{BlotName}
UpdateId = str
ExitId = str
NodeId = str
SensorId = str


class BaseSensor(pydantic.BaseModel):
    ...

class SelectSensor(BaseSensor):
    selectable_card_ids: Set[CardId]
    pattern: str | None # Describes the subset of selections which will fire this sensor. DNF.
    min_choices: int = 1
    max_choices: int | None = None # Fires whenever a valid selection of (min_choices, max_choices) cards is made

    # Action reported:
    """
    SelectAction:
        {
            card_id: bool
        } 
    """

class FreeTextEntrySensor(BaseSensor):
    card_id: CardId  # Of a FreeTextEntryCard
    pattern: str | None # text entry predicate (as regex) which must be matched before the Sensor fires. If None, fires on text change

    # Action reported:
    """
    FreeTextEntryAction: 
        {
            card_id: text
        }
    """

class DoodleSensor(BaseSensor):
    card_id: CardId  # of the doodle sensor
    pattern: str | None # todo; doodle predicate which must be matched before Sensor fires. If None, fires whenever any stroke  is made.

    """
    DoodleAction: 
        {
            card_id: text
        }
    """

class SliderSensor(BaseSensor):
    card_id: CardId # Of SliderSensor
    pattern: int | None # The subset of ticks for which this Sensor will fire. If None, will fire whenever the slider is moved.

class KeySensor(BaseSensor):
    keys: Set[PressableKey] # Fires whenever any one of these keys are pressed.

class TimeoutSensor(BaseSensor):
    """
    Sensor which fires when the given amount of time has elapsed.
    """
    timeout_msec: NodeTimePointMsec

class CompositeSensor(BaseSensor):
    """
    A 'composite' Sensor which wraps other Sensors and collects their emissions. This Sensor fires when it has collected at least
    one emission from each of its source Sensors, and its associated Card has been selected.

    The Action it reports collects the latest emissions from its source Sensors a struct:
    {
        sensor_id: SensorAction
    }
    """
    confirm_card_id: CardId # The ID of a selectable card which, when selected, confirms the source sensors. Sets .selectable=True only when all required sources have fired.
    source_sensors: Set[SensorId]

# %%
class NodeV2(pydantic.BaseModel):
    cards: Dict[CardId, BaseCard]
    update_rules: Dict[UpdateId, UpdateRule]
    sensors: Dict[SensorId, BaseSensor]


