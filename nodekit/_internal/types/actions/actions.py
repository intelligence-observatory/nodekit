from abc import ABC
from typing import List, Literal, Union, Annotated

import pydantic

from nodekit._internal.types.common import DatetimeUTC, PressableKey, SensorId, NullValue, SpatialPoint


# %%
class BaseAction(pydantic.BaseModel, ABC):
    sensor_id: SensorId = pydantic.Field(description='Identifier of the Sensor that emitted this Action.')
    action_type: str
    timestamp_action: DatetimeUTC = pydantic.Field(description='The timestamp when the Sensor for this Action was triggered.')


# %%
class ClickAction(BaseAction):
    action_type: Literal['ClickAction'] = 'ClickAction'
    click_x: SpatialPoint = pydantic.Field(description='The x-coordinate of the click, in Board units.')
    click_y: SpatialPoint = pydantic.Field(description='The y-coordinate of the click, in Board units.')


# %%
class DoneAction(BaseAction):
    action_type: Literal['DoneAction'] = 'DoneAction'


# %%
class TimeoutAction(BaseAction):
    action_type: Literal['TimeoutAction'] = 'TimeoutAction'


# %%
class KeyPressAction(BaseAction):
    action_type: Literal['KeyPressAction'] = 'KeyPressAction'

    key: PressableKey = pydantic.Field(description='The key that was pressed.')


# %%
class KeyHoldsAction(BaseAction):
    action_type: Literal['KeyHoldsAction'] = 'KeyHoldsAction'

    class KeyHold(pydantic.BaseModel):
        key: PressableKey = pydantic.Field(
            description="The key that was pressed."
        )
        timestamp_start: DatetimeUTC | None = pydantic.Field(
            description="The timestamp when the key was pressed down. This is None if the key was already being held down at the start of the Sensor timespan."
        )
        timestamp_end: DatetimeUTC | None = pydantic.Field(
            description="The timestamp when the key was released. This is None if the key is still being held down at the end of the Sensor timespan."
        )

    keyholds: List[KeyHold] = pydantic.Field(
        description="A list of keys that were held down during the Sensor timespan, along with their press and release timestamps."
    )


# %%
Action = Annotated[
    Union[
        ClickAction,
        DoneAction,
        KeyPressAction,
        KeyHoldsAction,
        TimeoutAction,
        # Add other Action types here as needed
    ],
    pydantic.Field(discriminator='action_type')
]
