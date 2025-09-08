
from typing import List

import pydantic

from nodekit._internal.types.base import DslModel
from nodekit._internal.types.cards.cards import Card


class Reinforcer(DslModel):

    reinforcer_cards: List[Card] = pydantic.Field(
        description='Cards which configure the (noninteractive) Reinforcer delivery phase.'
    )

    # Todo: ensure finite timespan