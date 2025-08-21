
from typing import List

import pydantic

from psykit._internal.models.node_engine.base import DslModel
from psykit._internal.models.node_engine.cards.cards import Card


class Reinforcer(DslModel):

    reinforcer_cards: List[Card] = pydantic.Field(
        description='Cards which configure the (noninteractive) Reinforcer delivery phase.'
    )
