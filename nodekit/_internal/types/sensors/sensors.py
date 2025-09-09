from abc import ABC

import pydantic

from nodekit._internal.types.common import CardId, PressableKey, TimePointMsec, SensorId
from typing import Literal, Annotated, Union
from uuid import uuid4

# %%
class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor represents a listener for Participant behavior.
    When a Sensor is triggered, it emits an Action.
    """

    # Sensor identifiers
    sensor_id: SensorId = pydantic.Field(description='The unique identifier for this Sensor.', default_factory=uuid4)
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


# %%
class DoneSensor(BaseSensor):
    sensor_type: Literal['DoneSensor'] = 'DoneSensor'
    card_id: CardId = pydantic.Field(description='The ID of the done-able Card to which this DoneSensor is attached.')


# %%
class ClickSensor(BaseSensor):
    sensor_type: Literal['ClickSensor'] = 'ClickSensor'
    card_id: CardId = pydantic.Field(description='The ID of the click-able Card to which this ClickSensor is attached.')


# %%
class KeySensor(BaseSensor):
    sensor_type: Literal['KeySensor'] = 'KeySensor'
    key: PressableKey = pydantic.Field(description='The key that triggers this KeySensor when pressed down.')


# %%
Sensor = Annotated[
    Union[
        DoneSensor,
        ClickSensor,
        KeySensor,
        # Add other Sensor types here as needed
    ],
    pydantic.Field(discriminator='sensor_type')
]
