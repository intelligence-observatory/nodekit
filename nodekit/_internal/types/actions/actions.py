from abc import ABC
from typing import Literal, Union, Annotated

import pydantic

from nodekit._internal.types.common import DatetimeUTC, PressableKey, SensorId, SpatialPoint


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
class KeyAction(BaseAction):
    action_type: Literal['KeyAction'] = 'KeyAction'


# %%
Action = Annotated[
    Union[
        ClickAction,
        DoneAction,
        KeyAction,
        TimeoutAction,
    ],
    pydantic.Field(discriminator='action_type')
]
