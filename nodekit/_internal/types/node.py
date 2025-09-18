from typing import List
from uuid import uuid4

import pydantic

from nodekit._internal.types.board.board import Board
from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.common import NodeId
from nodekit._internal.types.effects.effects import Effect
from nodekit._internal.types.outcome import Outcome
from nodekit._internal.types.sensors.sensors import Sensor
from nodekit._internal.version import VERSION


# %% Node
class Node(pydantic.BaseModel):
    class Config:
        frozen = True

    node_id: NodeId = pydantic.Field(default_factory=uuid4)

    cards: List[Card] = pydantic.Field(
        description=(
            "List of Cards placed on the Board, in back-to-front order."
            "The first Card in this list is at the \"bottom\" of the Board, in the z-direction."
        ),
    )
    sensors: List[Sensor] = pydantic.Field(min_length=1)
    outcomes: List[Outcome] = pydantic.Field(default_factory=list)
    effects: List[Effect] = pydantic.Field(default_factory=list)
    board: Board = pydantic.Field(default_factory=Board)


# %% Timeline
class Timeline(pydantic.BaseModel):
    nodes: List[Node] = pydantic.Field(
        min_length=1,
        description='The sequence of Nodes that make up the Timeline.'
    )
    nodekit_version: str = pydantic.Field(default=VERSION, description='The semantic version number of NodeKit used to create this Timeline.')
