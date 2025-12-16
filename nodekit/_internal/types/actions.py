from abc import ABC
from typing import Literal, Union, Annotated, Dict, Any

import pydantic

from nodekit._internal.types.values import PressableKey


# %%
class BaseAction(pydantic.BaseModel, ABC):
    action_type: str
    action_value: Any


# %%
class WaitAction(BaseAction):
    action_type: Literal["WaitAction"] = "WaitAction"
    action_value: None = None


# %%
class KeyAction(BaseAction):
    action_type: Literal["KeyAction"] = "KeyAction"
    action_value: PressableKey = pydantic.Field(description="The key that was pressed.")


# %%
class SelectAction(BaseAction):
    action_type: Literal["SelectAction"] = "SelectAction"
    action_value: str = pydantic.Field(description="The selection made by the agent.")

# %%
class MultiSelectAction(BaseAction):
    action_type: Literal["MultiSelectAction"] = "MultiSelectAction"
    action_value: list[str] = pydantic.Field(description="The selections made by the agent.")


# %%
class TextEntryAction(BaseAction):
    action_type: Literal["TextEntryAction"] = "TextEntryAction"
    action_value: str = pydantic.Field(description="The text that was entered by the agent.")


# %%
class SliderAction(BaseAction):
    action_type: Literal["SliderAction"] = "SliderAction"
    action_value: int = pydantic.Field(description="The index of the bin that was selected.", ge=0)



# %%
class ProductAction(BaseAction):
    action_type: Literal["ProductAction"] = "ProductAction"
    action_value: Dict[str, "Action"] = pydantic.Field(
        description="A dictionary mapping child IDs to their corresponding Actions."
    )


# %%
class SumAction(BaseAction):
    action_type: Literal["SumAction"] = "SumAction"
    action_value: tuple[str, "Action"] = pydantic.Field(
        description="A tuple of (winner_id, Action) taken by the child node."
    )


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
