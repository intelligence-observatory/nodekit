from abc import ABC
from typing import Literal, Union, Annotated, Set, Any
from uuid import uuid4

import pydantic

from nodekit._internal.types.common import CardId, PressableKey, NullParameters, SensorId, Timespan


# %%
class BaseSensor(pydantic.BaseModel, ABC):
    """
    A Sensor represents a listener for Participant behavior.
    When a Sensor is triggered, it emits an Action.
    """

    # Sensor
    sensor_id: SensorId = pydantic.Field(default_factory=uuid4)
    sensor_timespan: Timespan = pydantic.Field(description=(
        'The timespan during which this Sensor is armed and can trigger. '
        'If an open-ended timespan, the Sensor is armed indefinitely until it triggers'))
    sensor_type: str
    sensor_parameters: NullParameters


# %%
class TimeoutSensor(BaseSensor):
    """
    The TimeoutSensor triggers itself as soon as it is armed.
    Its Timespan should have zero duration.
    """
    sensor_type: Literal['TimeoutSensor'] = 'TimeoutSensor'

    @pydantic.field_validator('sensor_timespan')
    def validate_timespan(cls, v: Timespan) -> Timespan:
        if v.start_time_msec != v.end_time_msec:
            raise ValueError('TimeoutSensor must have a zero-duration Timespan (start_time must equal end_time).')
        return v

# %%
class DoneSensor(BaseSensor):
    class Parameters(pydantic.BaseModel):
        """
        Parameters for the DoneSensor.
        """
        card_id: CardId = pydantic.Field(description='The ID of the done-able Card to which this DoneSensor is attached.')

    sensor_type: Literal['DoneSensor'] = 'DoneSensor'
    sensor_parameters: Parameters


# %%
class ClickSensor(BaseSensor):
    class Parameters(pydantic.BaseModel):
        """
        Parameters for the DoneSensor.
        """
        card_id: CardId = pydantic.Field(description='The ID of the click-able Card to which this ClickSensor is attached.')

    sensor_type: Literal['ClickSensor'] = pydantic.Field(default='ClickSensor', frozen=True)
    sensor_parameters: Parameters


# %%
class KeyPressSensor(BaseSensor):
    class Parameters(pydantic.BaseModel):
        keys: Set[PressableKey] = pydantic.Field(description='The set of keys that will trigger this KeyPressSensor when pressed.')

    sensor_type: Literal['KeyPressSensor'] = 'KeyPressSensor'
    sensor_parameters: Parameters


class KeyHoldsSensor(BaseSensor):
    class Parameters(pydantic.BaseModel):
        keys: Set[PressableKey] = pydantic.Field(description='The set of keys that will be tracked by this KeyHoldsSensor when pressed.')

    sensor_type: Literal['KeyHoldsSensor'] = 'KeyHoldsSensor'
    sensor_parameters: Parameters


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
