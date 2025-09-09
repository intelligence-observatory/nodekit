from abc import ABC
from typing import Literal, Union, Annotated, Set, Self
from uuid import uuid4

import pydantic

from nodekit._internal.types.common import CardId, PressableKey, SensorId, TimePointMsec
from nodekit._internal.types.reinforcer_maps.reinforcer_maps import ReinforcerMap, NullReinforcerMap


# %%
class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor represents a listener for Participant behavior.
    When a Sensor is triggered, it emits an Action.
    """

    # Sensor
    sensor_id: SensorId = pydantic.Field(default_factory=uuid4)
    sensor_type: str

    # Time:
    t_start: TimePointMsec = pydantic.Field(
        description='The time (in milliseconds) relative to Node start when the Sensor is armed.',
        default=0,
    )
    t_end: TimePointMsec | None = pydantic.Field(
        description='The time (in milliseconds) relative to Node start when the Sensor is disarmed.',
        default=None,
    )

    # ReinforcerMap:
    reinforcer_map: ReinforcerMap = pydantic.Field(
        default_factory=NullReinforcerMap
    )


# %%
class TimeoutSensor(BaseSensor):
    """
    The TimeoutSensor triggers itself as soon as it is armed.
    Its Timespan should have zero duration.
    """
    sensor_type: Literal['TimeoutSensor'] = 'TimeoutSensor'

    @pydantic.model_validator(mode='after')
    def validate_timespan(self) -> Self:
        if self.t_start != self.t_end:
            raise ValueError('The TimeoutSensor must have t_start equal to t_end (i.e., zero duration).')
        return self

# %%
class DoneSensor(BaseSensor):
    sensor_type: Literal['DoneSensor'] = 'DoneSensor'
    card_id: CardId = pydantic.Field(description='The ID of the done-able Card to which this DoneSensor is attached.')


# %%
class ClickSensor(BaseSensor):
    sensor_type: Literal['ClickSensor'] = pydantic.Field(default='ClickSensor', frozen=True)
    card_id: CardId = pydantic.Field(description='The ID of the click-able Card to which this ClickSensor is attached.')


# %%
class KeyPressSensor(BaseSensor):
    sensor_type: Literal['KeyPressSensor'] = 'KeyPressSensor'
    keys: Set[PressableKey] = pydantic.Field(description='The set of keys that will trigger this KeyPressSensor when pressed.')


class KeyHoldsSensor(BaseSensor):
    sensor_type: Literal['KeyHoldsSensor'] = 'KeyHoldsSensor'
    keys: Set[PressableKey] = pydantic.Field(description='The set of keys that will be tracked by this KeyHoldsSensor when pressed.')


# %%
Sensor = Annotated[
    Union[
        DoneSensor,
        ClickSensor,
        KeyPressSensor,
        KeyHoldsSensor,
        TimeoutSensor,
        # Add other Sensor types here as needed
    ],
    pydantic.Field(discriminator='sensor_type')
]
