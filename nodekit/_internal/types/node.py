from typing import List

import pydantic

from nodekit._internal.types.board import Board
from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.effects.effects import Effect
from nodekit._internal.types.sensors.sensors import Sensor
from nodekit._internal.version import VERSION
from nodekit._internal.types.events.events import Event

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
    sensors: List[Sensor] = pydantic.Field(min_length=1)
    effects: List[Effect] = pydantic.Field(default_factory=list)


# %%
class Timeline(pydantic.BaseModel):
    nodes: List[Node] = pydantic.Field(
        min_length=1,
        description='The sequence of Nodes that make up the Timeline.'
    )
    nodekit_version: str = pydantic.Field(default=VERSION, description='The semantic version number of NodeKit used to create this Timeline.')


# %%
class Trace(pydantic.BaseModel):
    events: List[Event]
    nodekit_version: str = pydantic.Field(default=VERSION, description='The semantic version number of NodeKit used to create this Timeline.')