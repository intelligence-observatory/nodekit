import pydantic
from typing import Literal , Dict, Annotated

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
    placed: bool # Whether it currently exists on the Board. (Pedantry: note this is necessary but not sufficient for visibility)


class SelectableBlotMixin(pydantic.BaseModel):
    """
    Rendered as an overlay on the BaseBlot. z = 1.
    """
    selected_color: ColorHexString | None # if None, no selected effect
    unselected_color: ColorHexString | None # if None, no unselected effect
    unselectable_color: ColorHexString | None # if None, no unselectable effect
    selection_state: Literal['selected', 'unselected']
    selectable: bool # whether it can be toggled or not


class HoverableBlotMixin(pydantic.BaseModel):
    """
    Rendered as an overlay on the BaseBlot. z = 2.
    """
    hover_color: ColorHexString | None # if None, no hover effect
    # hover_state: Literal['hovered', 'unhovered'] # can always be derived instantaneously from current pointer input + registers; no need to store

# %%
class SliderBlot(BaseBlot):
    orientation: Literal['horizontal', 'vertical']
    track_color: ColorHexString
    thumb_color: ColorHexString
    num_bins: Annotated[int, pydantic.Field(gt=1, lt=1000)]
    bin_index: Annotated[int, pydantic.Field(ge=0)] # 0-indexed # Current

# %%
class RegionBlot(BaseBlot, SelectableBlotMixin, HoverableBlotMixin):
    color: ColorHexString # current color
    mask: Literal['circle', 'ellipse']

class ImageBlot(BaseBlot, SelectableBlotMixin, HoverableBlotMixin):
    image: str # URL or base64-encoded image data or identifier. Cannot be changed on the fly

class MovieBlot(BaseBlot, SelectableBlotMixin, HoverableBlotMixin):
    movie: str # URL or base64-encoded movie data or identifier. Cannot be changed on the fly
    loop: bool
    muted: bool

class TextBlot(BaseBlot, SelectableBlotMixin, HoverableBlotMixin):
    text: Annotated[str, pydantic.Field(min_length=0, max_length=10000)]  # current text
    text_color: ColorHexString  # current text color
    background_color: ColorHexString  # current background color

# %%
class FreeTextEntryBlot(BaseBlot):
    text: Annotated[str, pydantic.Field(min_length=0, max_length=10000)] # current text
    text_color: ColorHexString # current text color

# %% Registers
RegisterId = str # Uniquely identifies a Register in the Node. Always of form {BlotId}.{property}
#type RegisterValueType = Union of all the types of fields in the Blots above


# The rendering function itself should also accept inputs:
# pointer


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


# %%
class UpdateRule(pydantic.BaseModel):
    when: Predicate
    assign: Dict[RegisterId, Expression]

class ExitRule(pydantic.BaseModel):
    when: Predicate
    action_expression: Expression # Payload to calculate; useful for immediate consumption of Trace. Calculated after the assign step.


# %%
BlotId = str # Uniquely identifies a Blot in the Node. Always of form {NodeId}.{BlotName}
UpdateId = str
ExitId = str
NodeId = str

class NodeV2(pydantic.BaseModel):
    cards: Dict[BlotId, BaseBlot]
    update_rules: Dict[UpdateId, UpdateRule]
    exit_rules: Dict[ExitId, ExitRule]

class ActionEvent(pydantic.BaseModel):
    node_id: NodeId
    exit_id: ExitId
    action: Value # The evaluated action_expression from the triggered Sensor


# %% Example
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

[Priority C] Free text entry flow


[Priority D] Multi-select flow
* Transition a blot to unselected (from unselectable) based on t
* Transition choice blots to selected (from unselected) based on click, and maybe a guard predicate (min n to max k selected, out of N total)
* Transition the submit blot to terminal (from unselected) based on click, and a guard predicate (min n to max k selected, out of N total)

"""

# %%

"""
Kernel proceeds in logical ticks. 
One possible invariant is that 1 tick = 1 rule execution.
"""