from abc import ABC
from typing import Literal, Union, Annotated, Dict, Any

import pydantic

from nodekit._internal.types.values import PressableKey, SpatialPoint, Value
from typing import TypedDict

# %%
class BaseAction(pydantic.BaseModel, ABC):
    action_type: str
    action_value: Any



# %%
class KeyAction(BaseAction):
    action_type: Literal["KeyAction"] = "KeyAction"
    key: PressableKey = pydantic.Field(description="The key that was pressed.")


# %%
class SliderAction(BaseAction):
    action_type: Literal["SliderAction"] = "SliderAction"
    bin_index: int = pydantic.Field(
        description="The index of the bin that was selected.", ge=0
    )


# %%
class TextEntryAction(BaseAction):
    action_type: Literal["TextEntryAction"] = "TextEntryAction"
    text: str


# %%
class WaitAction(BaseAction):
    action_type: Literal["WaitAction"] = "WaitAction"


# %%
class SelectAction(BaseAction):
    action_type: Literal["SelectAction"] = "SelectAction"
    selection: str


# %%
class MultiSelectAction(BaseAction):
    action_type: Literal["MultiSelectAction"] = "MultiSelectAction"
    selections: list[str]


# %%
class ProductAction(BaseAction):
    action_type: Literal["ProductAction"] = "ProductAction"
    child_actions: Dict[str, "Action"]


# %%
class SumAction(BaseAction):
    action_type: Literal["SumAction"] = "SumAction"
    child_id: str
    child_action: "Action"


# %%
type Action = Annotated[
    Union[
        KeyAction,
        SliderAction,
        TextEntryAction,
        WaitAction,
        SelectAction,
        MultiSelectAction,
        ProductAction,
        SumAction,
    ],
    pydantic.Field(discriminator="action_type"),
]
