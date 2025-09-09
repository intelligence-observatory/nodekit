from abc import ABC
from typing import Literal, Annotated, Union, List

import pydantic

from nodekit._internal.types.cards.cards import Card

# %%

class Reinforcer(pydantic.BaseModel):
    """
    A Reinforcer describes a set of Cards to be presented to the user as a reward (or punishment) for taking a particular Action.
    """

    reinforcer_cards: List[Card] = pydantic.Field(
        description='Cards which constitute the Reinforcer.'
    )

    # Todo: ensure finite timespan


# %%
class BaseReinforcerMap(pydantic.BaseModel, ABC):
    """
    A ReinforcerMap represents a function mapping an Action emitted from a Sensor to a Reinforcer.
    """
    reinforcer_map_type: str


# %%
class ConstantReinforcerMap(BaseReinforcerMap):
    """
    A ReinforcerMap that always returns the same Reinforcer, regardless of the Action's value.
    Works on all Sensors.
    """

    reinforcer_map_type: Literal['ConstantReinforcerMap'] = 'ConstantReinforcerMap'
    reinforcer: Reinforcer = pydantic.Field(description='The Reinforcer to return for any Action emitted by the Sensor it is attached to.')


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

