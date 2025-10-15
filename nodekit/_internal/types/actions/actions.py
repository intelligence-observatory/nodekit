from abc import ABC
from typing import Literal, Union, Annotated, Dict

import pydantic

from nodekit._internal.types.common import PressableKey, SpatialPoint, CardId


# %%
class BaseAction(pydantic.BaseModel, ABC):
    action_type: str


# %%
class ClickAction(BaseAction):
    action_type: Literal["ClickAction"] = "ClickAction"
    x: SpatialPoint = pydantic.Field(
        description="The x-coordinate of the click, in Board units."
    )
    y: SpatialPoint = pydantic.Field(
        description="The y-coordinate of the click, in Board units."
    )


# %%
class TimeoutAction(BaseAction):
    action_type: Literal["TimeoutAction"] = "TimeoutAction"


# %%
class KeyAction(BaseAction):
    action_type: Literal["KeyAction"] = "KeyAction"
    key: PressableKey = pydantic.Field(description="The key that was pressed.")


# %%
class SliderState(pydantic.BaseModel):
    slider_normalized_position: float = pydantic.Field(
        description="The value of the slider, in normalized units.", ge=0, le=1
    )
    slider_bin_index: int = pydantic.Field(
        description="The index of the bin that was selected.", ge=0
    )


class FreeTextEntryState(pydantic.BaseModel):
    text: str = pydantic.Field(description="The text that was entered.")


class SubmitAction(BaseAction):
    action_type: Literal["SubmitAction"] = "SubmitAction"
    submitted_values: Dict[CardId, SliderState | FreeTextEntryState] = pydantic.Field(
        description="A mapping from CardId to the corresponding Action (SliderAction or FreeTextEntryAction) that was submitted."
    )


# %%
Action = Annotated[
    Union[
        ClickAction,
        KeyAction,
        TimeoutAction,
        SubmitAction,
    ],
    pydantic.Field(discriminator="action_type"),
]
