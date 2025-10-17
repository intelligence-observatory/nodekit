import pydantic
from typing import Literal , Dict, Annotated, Tuple, Set

from nodekit._internal.types.common import (
    SpatialPoint,
    SpatialSize,
    TimeElapsedMsec,
    NodeTimePointMsec,
    ColorHexString,
)


# %% Blots
class BaseBlot(pydantic.BaseModel):
    """
    Blots are stateful, logical entities which have a visual representation on the Board.
    Each Blot has a set of properties (fields) which can be read and written by *Rules.
    """
    blot_type: str
    x: SpatialPoint
    y: SpatialPoint
    width: SpatialSize
    height: SpatialSize

    placed: bool = True # Whether it currently exists on the Board. (Pedantry: note this is necessary but not sufficient for visibility)

type SelectionState = bool
class SelectableBlotMixin(pydantic.BaseModel):
    """
    Rendered as an overlay on the BaseBlot. z = 1.
    """
    selected: SelectionState = False
    selectable: bool = False  # whether it can be toggled or not

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
class ShapeBlot(BaseBlot):
    shape: Literal['ellipse', 'rectangle']
    color: ColorHexString  # current color

class SliderBlot(BaseBlot):
    num_ticks: Annotated[int, pydantic.Field(gt=1, lt=1000)]
    tick_index: Annotated[int, pydantic.Field(ge=0)] # Current tick index
    show_ticks: bool

    orientation: Literal['horizontal', 'vertical']
    track_color: ColorHexString
    thumb_color: ColorHexString

class FreeTextEntryBlot(BaseBlot):
    prompt_text: Annotated[str, pydantic.Field(min_length=0, max_length=1000)] # static prompt text shown if text == ''
    text: Annotated[str, pydantic.Field(min_length=0, max_length=10000)] # current text
    text_color: ColorHexString # current text color

class ImageBlot(BaseBlot, SelectableBlotMixin, HoverableBlotMixin):
    image: str # URL or base64-encoded image data or identifier. Cannot be changed on the fly

class MovieBlot(BaseBlot, SelectableBlotMixin, HoverableBlotMixin):
    movie: str # URL or base64-encoded movie data or identifier. Cannot be changed on the fly
    loop: bool
    muted: bool
    elapsed_msec: TimeElapsedMsec = 0 # current elapsed time in movie

class TextBlot(BaseBlot, SelectableBlotMixin, HoverableBlotMixin):
    text: Annotated[str, pydantic.Field(min_length=0, max_length=10000)]  # current text
    text_color: ColorHexString  # current text color
    background_color: ColorHexString  # current background color


type BinSelections = Dict[int, Set[int]] # mapping from horizontal bin index to set of vertical bin indices
class DoodleBlot(BaseBlot):
    num_bins_horizontal: int = pydantic.Field(ge=1) # cannot be changed at runtime
    num_bins_vertical: int = pydantic.Field(ge=1) # cannot be changed at runtime

    stroke_color: ColorHexString # should probably be transparent

    selected_bins: BinSelections = pydantic.Field(
        description="The set of (i_h, i_w) coordinates that are currently stroked.",
    )


# %% Actions. These are emitted by Cards, following new Participant input in the InputStream.
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

# %% Expressions.
# Expression[T] evaluates to a value of type T
# Should use AST JSON for this.
"""
We have constants (e.g. true, false, 3, "hello", "#FF0000", 42, 3.14)
We have register references (e.g. StimulusImage.visible, StimulusSlider.bin_index)
We have the current input event
We have operators (e.g. +, -, *, /, AND, OR, NOT, ==, !=, <, <=, >, >=) which take one or two arguments and return a value
We have parentheses for grouping (e.g ( ... ) )

These evaluate to *values*, including structs.
"""
class Expression(pydantic.BaseModel):
    pass

class Value(pydantic.BaseModel):
    """
    The result of evaluating an Expression.
    """
    ...

# %% Predicates. e.g. P = (StimulusImage.visible == true AND StimulusSlider.bin_index == 3)
# Predicates are Expression[bool]

"""
These operate on expressions (see above) and return a boolean value.

Operators: 
AND, OR, NOT
"""
class Predicate(pydantic.BaseModel):
    pass

# %% Registers
RegisterId = str # Uniquely identifies a Register in the Node. Always of form {CardId}.{property}
#type RegisterValueType = Union of all the types of fields in the Blots above


# The rendering function itself should also accept inputs:
# pointer

# %%
class UpdateRule(pydantic.BaseModel):
    when: Predicate
    assign: Dict[RegisterId, Expression]

# %%
class ExitRule(pydantic.BaseModel):
    when: Predicate


"""
Examples:  

Update rule: turning a card on:
WHEN input.clock_time >= 0 AND stimulus_image.visible == false
ASSIGN stimulus_image.visible = true

Update rule: turning a card off: 
WHEN input.clock_time >= 1000 AND stimulus_image.visible == true
ASSIGN stimulus_image.visible = false

Exit rule: ballistic selection
WHEN stimulus_image.selection_state == true
"""



# %%
CardId = str # Uniquely identifies a Blot in the Node. Always of form {NodeId}.{BlotName}
UpdateId = str
ExitId = str
NodeId = str

class NodeV2(pydantic.BaseModel):
    cards: Dict[CardId, BaseBlot]
    update_rules: Dict[UpdateId, UpdateRule]
    exit_rules: Dict[ExitId, ExitRule]


# %% Examples
"""
Back compat: first priorities

[Priority A] Core: card lifecycle
* Transition a blot to visible at time t by setting .visible = true
* Transition a blot to invisible at time t by setting .visible = false

[Priority B] Ballistic selection (key or click)
* Transition based on click / key to terminal (if click, set selectable register)

[Priority B] Timeout
* Transition to terminal state 

[Priority D] Hover 
* Transition a blot to hover / unhovered based on pointer location


[Priority C] Slider flow
* Set a slider value (either required or not) 
* Confirm

[Priority C] Free text entry flow
* Set a free text entry value (either required or not)
* Activate confirm button, perhaps based on regex predicate
* Termination: Press confirm button


[Priority D] Multi-select flow
* Transition a blot to unselected (from unselectable) based on t
* Transition choice blots to selected (from unselected) based on click, and maybe a guard predicate (min n to max k selected, out of N total)
* Transition the submit blot to terminal (from unselected) based on click, and a guard predicate (min n to max k selected, out of N total)

[Priority E] (e.g.) Color matching flow
* Based on a 'button' press, change the value of a blot property (e.g. luminance) upward or downward by a fixed increment, within bounds
* Confirm flow

"""

# %%

"""
Kernel proceeds in logical ticks. 
One possible invariant is that 1 tick = 1 rule execution.
"""