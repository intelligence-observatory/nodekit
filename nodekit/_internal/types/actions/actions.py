from typing import List, Literal, Union, Annotated

import pydantic

from nodekit._internal.types.base import DslModel, NullValue
from nodekit._internal.types.common import DatetimeUTC, PressableKey

from nodekit._internal.types.actions.base import BaseAction


# %%

class ClickAction(BaseAction):
    """
    A fully-qualified description of a Sensor emission.
    """

    class Value(DslModel):
        """
        A fully-qualified description of a Sensor emission.
        """
        click_x: float = pydantic.Field(description='The x-coordinate of the click, in Board units.')
        click_y: float = pydantic.Field(description='The y-coordinate of the click, in Board units.')

    action_type: Literal['ClickAction'] = 'ClickAction'
    action_value: Value


# %%
class DoneAction(BaseAction):
    action_type: Literal['DoneAction'] = 'DoneAction'
    action_value: NullValue = pydantic.Field(default_factory=NullValue, frozen=True)


# %%
class TimeoutAction(BaseAction):
    action_type: Literal['TimeoutAction'] = 'TimeoutAction'
    action_value: NullValue = pydantic.Field(default_factory=NullValue, frozen=True)

# %%
class KeyPressAction(BaseAction):
    class Value(DslModel):
        key: PressableKey

    action_type: Literal['KeyPressAction'] = 'KeyPressAction'
    action_value: Value


# %%
class KeyHold(pydantic.BaseModel):
    key: PressableKey = pydantic.Field(
        description="The key that was pressed."
    )
    timestamp_start: DatetimeUTC | None = pydantic.Field(
        description="The timestamp when the key was pressed down. This is None if the key was already being held down at the start of the Sensor Timespan."
    )
    timestamp_end: DatetimeUTC | None = pydantic.Field(
        description="The timestamp when the key was released. This is None if the key is still being held down at the end of the Sensor Timespan."
    )


class KeyHoldsAction(BaseAction):

    class Value(DslModel):
        key_holds: List[KeyHold]

    action_type: Literal['KeyHoldsAction'] = 'KeyHoldsAction'
    action_value: Value

# %%
Action = Annotated[
    Union[
        ClickAction,
        DoneAction,
        TimeoutAction,
        KeyPressAction,
        KeyHoldsAction,
        # Add other Action types here as needed
    ],
    pydantic.Field(discriminator='action_type')
]
