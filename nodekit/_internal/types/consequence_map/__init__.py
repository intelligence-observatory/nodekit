from typing import List, Self

import pydantic

from nodekit._internal.types.cards.cards import Card


class Consequence(pydantic.BaseModel):
    ...
    # Consequence
    cards: List[Card] = pydantic.Field(
        description=(
            'A Consequence plays the role of serving as an operant reinforcer or punisher to the Participant. '
            'It consists of the display of a given set of Cards on a fresh Board, following this Sensor being triggered. '
            'These Cards should all have closed t_end times, as the Consequence is expected to be temporally finite.'
            'An empty list means no consequence (i.e., the next Node will immediately begin).'
        ),
        default_factory=list,
    )

    @pydantic.model_validator(mode='after')
    def check_finite_consequence(self) -> Self:
        # Ensure all the cards have a finite timespan
        for card in self.cards:
            if card.t_end is None:
                raise ValueError(f'Consequence card {card.card_id} must have a finite t_end.')
        return self

