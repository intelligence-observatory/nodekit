from abc import ABC
from typing import Literal, Annotated, Union, List, Self

import pydantic

from nodekit._internal.types.cards.cards import Card

# %%
class Consequence(pydantic.BaseModel):
    """
    A Consequence describes a set of Cards to be presented to the Participant as a reinforcer (or punisher)
    for taking a particular Action.
    """

    cards: List[Card] = pydantic.Field(
        description='Cards which constitute the Reinforcer.',
    )

    @pydantic.model_validator(mode='after')
    def check_finite_timespans(self) -> Self:
        # Ensure all the cards have a finite timespan
        for card in self.reinforcer_cards:
            if card.t_end is None:
                raise ValueError(f'Reinforcer card {card.card_id} must have a finite t_end.')
        return self


# %%
class BaseOutcome(pydantic.BaseModel, ABC):
    """
    A ReinforcerMap represents a function mapping an Action emitted from a Sensor to a Reinforcer.
    """
    outcome_type: str


# %%
class ConstantReinforcerMap(BaseOutcome):
    """
    A ReinforcerMap that always returns the same Reinforcer, regardless of the Action.
    """

    outcome_type: Literal['ConstantReinforcerMap'] = 'ConstantReinforcerMap'
    cards: List[Card] = pydantic.Field(description='The list of Cards to show as the Reinforcer.')


class NullReinforcerMap(BaseReinforcerMap):
    """
    A ReinforcerMap that returns no Reinforcer, regardless of the Action's value.
    """

    reinforcer_map_type: Literal['NullReinforcerMap'] = 'NullReinforcerMap'

# %%
Outcome = Annotated[
    Union[
        ConstantOutcome,
    ],
    pydantic.Field(discriminator='outcome_type')
]

