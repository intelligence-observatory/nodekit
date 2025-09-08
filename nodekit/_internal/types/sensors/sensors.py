from typing import Literal, Union, Annotated, Set

import pydantic

from nodekit._internal.types.base import DslModel, NullParameters
from nodekit._internal.types.common import CardId, PressableKey
from nodekit._internal.types.sensors.base import BaseSensor



# %%
class DoneSensor(BaseSensor):
    sensor_type: Literal['DoneSensor'] = 'DoneSensor'
    sensor_parameters: NullParameters = pydantic.Field(default_factory=NullParameters, frozen=True)
    card_id: CardId # Only binds to Card


# %%
class ClickSensor(BaseSensor):
    sensor_type: Literal['ClickSensor'] = pydantic.Field(default='ClickSensor', frozen=True)
    sensor_parameters: NullParameters = pydantic.Field(default_factory=NullParameters, frozen=True)
    card_id: CardId # Only binds to Card


# %%
class KeyPressSensor(BaseSensor):
    class KeyPressSensorParameters(DslModel):
        keys: Set[PressableKey]

    sensor_type: Literal['KeyPressSensor'] = 'KeyPressSensor'
    sensor_parameters: KeyPressSensorParameters
    card_id: None = pydantic.Field(default=None, frozen=True)  # Only binds to Board


class KeyHoldsSensor(BaseSensor):
    class KeyHoldsSensorParameters(DslModel):
        keys: Set[PressableKey]

    sensor_type: Literal['KeyHoldsSensor'] = 'KeyHoldsSensor'
    sensor_parameters: KeyHoldsSensorParameters
    card_id: None = pydantic.Field(default=None, frozen=True)  # Only binds to Board

# %%
Sensor = Annotated[
    Union[
        DoneSensor,
        ClickSensor,
        KeyPressSensor,
        KeyHoldsSensor,
        # Add other Sensor types here as needed
    ],
    pydantic.Field(discriminator='sensor_type')
]
