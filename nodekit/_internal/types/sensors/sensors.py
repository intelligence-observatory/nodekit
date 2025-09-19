from abc import ABC
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.common import PressableKey, TimePointMsec
from nodekit._internal.types.regions import Region


# %%
class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor is a listener for Participant behavior.
    When a Sensor is triggered, it emits an Action.
    """

    # Sensor identifiers
    sensor_type: str

    # Time:
    t_start: TimePointMsec = pydantic.Field(
        default=0,
        description='The time (in milliseconds) relative to Node start when the Sensor is armed.',
    )

# %%
class TimeoutSensor(BaseSensor):
    """
    A Sensor that triggers immediately after it is armed.
    """
    sensor_type: Literal['TimeoutSensor'] = 'TimeoutSensor'
    t_start: TimePointMsec = pydantic.Field(
        description = 'The time (in milliseconds) relative to Node start when the TimeoutAction is emitted.',
    )

# %%
class ClickSensor(BaseSensor):
    sensor_type: Literal['ClickSensor'] = 'ClickSensor'
    region: Region = pydantic.Field(description='The region on the Board that triggers the Sensor if clicked.')

# %%
class KeySensor(BaseSensor):
    sensor_type: Literal['KeySensor'] = 'KeySensor'
    key: PressableKey = pydantic.Field(description='The key that triggers the Sensor when pressed down.')


# %%
Sensor = Annotated[
    Union[
        ClickSensor,
        KeySensor,
        TimeoutSensor,
    ],
    pydantic.Field(discriminator='sensor_type')
]
