from abc import ABC
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.common import NullParameters
from nodekit._internal.types.reinforcer_maps.reinforcer import Reinforcer


# %%
class BaseReinforcerMap(pydantic.BaseModel, ABC):
    """
    A ReinforcerMap represents a function mapping an Action emitted from a Sensor to a Reinforcer.
    """
    reinforcer_map_type: str
    reinforcer_map_parameters: NullParameters


# %%
class ConstantReinforcerMap(BaseReinforcerMap):
    """
    A ReinforcerMap that always returns the same Reinforcer, regardless of the Action's value.
    Works on all Sensors.
    """

    class Parameters(pydantic.BaseModel):
        reinforcer: Reinforcer = pydantic.Field(description='The Outcome to return for any Action emitted by the Sensor it is attached to.')

    reinforcer_map_type: Literal['ConstantReinforcerMap'] = 'ConstantReinforcerMap'
    reinforcer_map_parameters: Parameters


class NullReinforcerMap(BaseReinforcerMap):
    """
    A ReinforcerMap that returns no Reinforcer, regardless of the Action's value.
    Works on all Sensors.
    """

    reinforcer_map_type: Literal['NullReinforcerMap'] = 'NullReinforcerMap'

# %%
ReinforcerMap = Annotated[
    Union[
        ConstantReinforcerMap,
        NullReinforcerMap
    ],
    pydantic.Field(discriminator='reinforcer_map_type')
]
