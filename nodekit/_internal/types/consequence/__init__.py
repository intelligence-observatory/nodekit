from typing import List, Self

import pydantic

from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.common import (
    MonetaryAmountUsd, SensorId
)


class Consequence(pydantic.BaseModel):
    """
    A Consequence is a set of Cards that are displayed on a fresh Board following a specific Sensor being triggered.
    It can serve as a reinforcer or punisher to the Participant.
    The Cards in a Consequence should all have closed t_end times, as the Consequence is expected to be temporally finite.
    """

    sensor_id: SensorId = pydantic.Field(
        description='The ID of the Sensor that triggers this Consequence when activated. Any Action from this Sensor will trigger the Consequence.'
    )

    cards: List[Card] = pydantic.Field(
        description=(
            'Cards that will be displayed on a fresh Board, following this Sensor being triggered. '
        ),
        default_factory=list,
    )

    bonus_amount_usd: MonetaryAmountUsd = pydantic.Field(
        description='The change in bonus amount when the Sensor is triggered. This can be positive or negative.',
        default='0.00'
    )

    @pydantic.model_validator(mode='after')
    def check_consequence_is_finite(self) -> Self:
        # Ensure all the cards have a finite timespan
        for card in self.cards:
            if card.t_end is None:
                raise ValueError(f'Consequence card {card.card_id} must have a finite t_end.')
        return self

