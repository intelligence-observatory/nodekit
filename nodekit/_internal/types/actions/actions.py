from abc import ABC
from typing import Literal, Union, Annotated

import pydantic

from nodekit._internal.types.common import PressableKey, SpatialPoint


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
class SliderAction(BaseAction):
    action_type: Literal["SliderAction"] = "SliderAction"
    value: float = pydantic.Field(description="The value of the slider, in normalized units.", ge=0, le=1)
    bin_index: int = pydantic.Field(description="The index of the bin that was selected.", ge=0)


# %%
Action = Annotated[
    Union[
        ClickAction,
        KeyAction,
        TimeoutAction,
        SliderAction,
    ],
    pydantic.Field(discriminator="action_type"),
]
