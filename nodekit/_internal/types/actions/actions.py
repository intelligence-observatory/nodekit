from abc import ABC
from typing import List, Literal, Union, Annotated, Any

import pydantic

from nodekit._internal.types.common import DatetimeUTC, PressableKey, SensorId, NullValue


# %%
class BaseAction(pydantic.BaseModel, ABC):
    sensor_id: SensorId = pydantic.Field(
        description='Identifier of the Sensor that emitted this Action.'
    )
    action_type: str
    action_value: Any
    timestamp_action: DatetimeUTC = pydantic.Field(
        description='The timestamp when the Sensor for this Action was triggered.'
    )


# %%
class ClickAction(BaseAction):
    class Value(pydantic.BaseModel):
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
    class Value(pydantic.BaseModel):
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

    class Value(pydantic.BaseModel):
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
