from typing import Literal, Union, Annotated

import pydantic

from psykit._internal.models.node_engine.base import DslModel, NullParameters
from psykit._internal.models.node_engine.fields import TimeDurationMsec
from psykit._internal.models.node_engine.sensors.base import BaseSensor

from psykit._internal.models.node_engine.fields import CardId


# %%
class TimeoutSensor(BaseSensor):
    """
    Attaches to the Board and triggers an Action after a specified timeout period.
    """

    class TimeoutSensorParameters(DslModel):
        timeout_msec: TimeDurationMsec

    sensor_type: Literal['TimeoutSensor'] = 'TimeoutSensor'
    sensor_parameters: TimeoutSensorParameters
    card_id: None = pydantic.Field(default=None, frozen=True)  # Only binds to Board


# %%
class DoneSensor(BaseSensor):
    sensor_type: Literal['DoneSensor'] = 'DoneSensor'
    sensor_parameters: NullParameters = pydantic.Field(default_factory=NullParameters, frozen=True)
    card_id: CardId = pydantic.Field(default=None, frozen=True)  # Only binds to Card


# %%
class ClickSensor(BaseSensor):
    sensor_type: Literal['ClickSensor'] = pydantic.Field(default='ClickSensor', frozen=True)
    sensor_parameters: NullParameters = pydantic.Field(default_factory=NullParameters, frozen=True)
    card_id: CardId = pydantic.Field(default=None, frozen=True)  # Only binds to Card


# %%
Sensor = Annotated[
    Union[
        TimeoutSensor,
        DoneSensor,
        ClickSensor,
        # Add other Sensor types here as needed
    ],
    pydantic.Field(discriminator='sensor_type')
]
