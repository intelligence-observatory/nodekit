from abc import ABC
from typing import Literal, Annotated, Union, List, Self

import pydantic

from nodekit._internal.types.cards.cards import Card

# %%
class Consequence(pydantic.BaseModel):
    """
    A Consequence is the display of a set of Cards on a fresh Board.
    It plays the role of serving as a reinforcer or punisher to the Participant for taking a particular Action.
    These Cards should all have closed t_end times, as the Consequence is expected to be temporally finite.
    """

    cards: List[Card] = pydantic.Field(
        description='Cards which constitute the Consequence.',
        min_length=1,
    )

    @pydantic.model_validator(mode='after')
    def check_finite_timespans(self) -> Self:
        # Ensure all the cards have a finite timespan
        for card in self.cards:
            if card.t_end is None:
                raise ValueError(f'Reinforcer card {card.card_id} must have a finite t_end.')
        return self

