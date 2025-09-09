from abc import ABC
from typing import Literal, Union, Annotated, Set, Self ,List
from uuid import uuid4

import pydantic

from nodekit._internal.types.common import CardId, PressableKey, SensorId, TimePointMsec
from nodekit._internal.types.cards.cards import Card


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

    # Consequence for triggering this Sensor:
    consequence: List[Card] = pydantic.Field(
        description='The Consequence is a list of Cards that will be presented to the Participant on a fresh Board if this Sensor is triggered.',
        default_factory=list,
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
    sensor_type: Literal['ClickSensor'] = 'ClickSensor'
    card_id: CardId = pydantic.Field(description='The ID of the click-able Card to which this ClickSensor is attached.')


# %%
class KeyPressSensor(BaseSensor):
    sensor_type: Literal['KeyPressSensor'] = 'KeyPressSensor'
    key: PressableKey = pydantic.Field(description='The key that triggers this KeyPressSensor when pressed down.')


# %%
class KeyHoldsSensor(BaseSensor):
    sensor_type: Literal['KeyHoldsSensor'] = 'KeyHoldsSensor'
    key: PressableKey = pydantic.Field(description='The key tracked by this KeyHoldsSensor when held.')


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
