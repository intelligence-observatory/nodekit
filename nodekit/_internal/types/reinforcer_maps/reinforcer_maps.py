from abc import ABC
from typing import Literal, Any

from nodekit._internal.types.base import DslModel, NullParameters
from nodekit._internal.types.common import SensorId
from nodekit._internal.types.reinforcer_maps.reinforcer import Reinforcer

from typing import Annotated, Union

import pydantic


# %%
class BaseReinforcerMap(DslModel, ABC):
    """
    Represents a map from a fully qualified Action emitted by a particular Sensor to an Outcome.
    """
    reinforcer_map_type: str
    reinforcer_map_parameters: Any
    sensor_id: SensorId


# %%
class ConstantReinforcerMap(BaseReinforcerMap):
    class Parameters(DslModel):
        reinforcer: Reinforcer = pydantic.Field(description='The Outcome to return for any Action emitted by the Sensor it is attached to.')

    """
    An OutcomeMap which always returns the same Outcome for any Action emitted by the Sensor it is attached to.
    """
    reinforcer_map_type: Literal['ConstantReinforcerMap'] = 'ConstantReinforcerMap'
    reinforcer_map_parameters: Parameters


# %%
ReinforcerMap = Annotated[
    Union[
        ConstantReinforcerMap,
    ],
    pydantic.Field(discriminator='reinforcer_map_type')
]
