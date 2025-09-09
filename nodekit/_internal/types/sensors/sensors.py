from abc import ABC
from typing import Literal, Union, Annotated

import pydantic

from nodekit._internal.types.common import CardId, PressableKey, TimePointMsec
from nodekit._internal.types.reinforcer_maps.reinforcer_maps import Consequence

# %%
class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor represents a listener for Participant behavior.
    When a Sensor is triggered, it emits an Action.
    """

    # Sensor
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

    # Consequence
    consequence: Consequence | None = pydantic.Field(
        description='The immediate Consequence that is realized when this Sensor is triggered, which may serve as an operant reinforcer or punisher.' ,
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
class KeyPressSensor(BaseSensor):
    sensor_type: Literal['KeyPressSensor'] = 'KeyPressSensor'
    key: PressableKey = pydantic.Field(description='The key that triggers this KeyPressSensor when pressed down.')


# %%
Sensor = Annotated[
    Union[
        DoneSensor,
        ClickSensor,
        KeyPressSensor,
        # Add other Sensor types here as needed
    ],
    pydantic.Field(discriminator='sensor_type')
]
