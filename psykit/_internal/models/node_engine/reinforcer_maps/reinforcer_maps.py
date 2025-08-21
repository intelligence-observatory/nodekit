from typing import Literal

from psykit._internal.models.node_engine.base import DslModel, NullParameters
from psykit._internal.models.node_engine.reinforcer_maps.base import BaseReinforcerMap
from psykit._internal.models.node_engine.reinforcer_maps.reinforcer.reinforcer import Reinforcer

from typing import Annotated, Union

import pydantic


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
class NullReinforcerMap(BaseReinforcerMap):
    """
    A convenience class which represents an ReinforcerMap which yields a NullReinforcer.
    """
    reinforcer_map_type: Literal['NullReinforcerMap'] = 'NullReinforcerMap'
    reinforcer_map_parameters: NullParameters = pydantic.Field(
        default_factory=NullParameters, frozen=True
    )


# %%
ReinforcerMap = Annotated[
    Union[
        NullReinforcerMap,
        ConstantReinforcerMap,
        # Add other OutcomeMap types here as needed
    ],
    pydantic.Field(discriminator='reinforcer_map_type')
]
