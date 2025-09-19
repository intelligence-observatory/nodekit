from typing import List, Self

import pydantic

from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.common import MonetaryAmountUsd, SensorId

# %%
class Outcome(pydantic.BaseModel):
    """
    An Outcome is a set of Cards that are displayed on a fresh Board following a Participant Action.
    An Outcome might be intended to serve as a reinforcer or punisher for the Participant.
    The Cards in an Outcome should all have closed t_end times, as the Outcome is expected to be temporally finite.
    """

    cards: List[Card] = pydantic.Field(
        description=(
            'Cards that will be displayed on a freshly cleared Board. These should all have a finite timespan.'
        ),
        default_factory=list,
    )

    bonus_amount_usd: MonetaryAmountUsd = pydantic.Field(
        description='The change in the running bonus amount. This can be positive or negative. This is not required to be tied to the Cards in any way.',
        default='0.00'
    )

    @pydantic.model_validator(mode='after')
    def check_cards_are_finite(self) -> Self:
        # Ensure all the cards have a finite timespan
        for card in self.cards:
            if card.t_end is None:
                raise ValueError(f'Outcome Card {card.card_id} must have a finite t_end.')
        return self

