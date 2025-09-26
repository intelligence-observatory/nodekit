from typing import Dict, List

import pydantic

from nodekit._internal.types.board import Board
from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.common import SensorId
from nodekit._internal.types.effects.effects import Effect
from nodekit._internal.types.sensors.sensors import Sensor


# %%
class Node(pydantic.BaseModel):
    class Config:
        frozen = True

    board: Board = pydantic.Field(default_factory=Board)
    cards: List[Card] = pydantic.Field(
        description=(
            "List of Cards placed on the Board, in back-to-front order."
            "The first Card in this list is at the \"bottom\" of the Board, in the z-direction."
        ),
    )
    sensors: Dict[SensorId, Sensor] = pydantic.Field(
        min_length=1,
        description='List of Sensors that listen for a Participant Action. The first Sensor that is triggered ends the Node.'
    )
    effects: List[Effect] = pydantic.Field(default_factory=list)
