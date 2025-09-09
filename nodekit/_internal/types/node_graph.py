from typing import List, Self
from uuid import uuid4

import pydantic

from nodekit._internal.types.board.board import Board
from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.common import PayableMonetaryAmountUsd, NodeId
from nodekit._internal.types.consequence import Consequence
from nodekit._internal.types.effects.effects import Effect
from nodekit._internal.types.sensors.sensors import Sensor
from nodekit._internal.version import VERSION


# %% Node
class Node(pydantic.BaseModel):
    node_id: NodeId = pydantic.Field(default_factory=uuid4)

    cards: List[Card] = pydantic.Field(
        description=(
            "List of Cards placed on the Board, in back-to-front order."
            "The first Card in this list is at the \"bottom\" of the Board, in the z-direction."
        ),
        min_length=1,
    )

    sensors: List[Sensor] = pydantic.Field(min_length=1)
    consequences: List[Consequence] = pydantic.Field(default_factory=list)
    effects: List[Effect] = pydantic.Field(default_factory=list)

    @pydantic.model_validator(mode='after')
    def check_node_is_well_formed(self) -> Self:

        for sensor in self.sensors:
            # Todo: if the Sensor references a Card, ensure the Card exists in this node.
            # Todo: check that the Sensor and Target type are compatible:
            ...

        # If there is only one Sensor, enforce the domain rule that it cannot be a TimeoutSensor.
        if len(self.sensors) == 1 and self.sensors[0].sensor_type == 'TimeoutSensor':
            raise ValueError("A Node with only one Sensor cannot be a TimeoutSensor. Combine this Node with the next Node instead.")

        return self


# %% NodeGraph
class NodeGraph(pydantic.BaseModel):

    board: Board = pydantic.Field(default_factory=Board)

    nodes: List[Node]

    # Payment information
    base_payment_usd: PayableMonetaryAmountUsd = pydantic.Field(
        description="The base payment (in USD) that a Participant receives upon successfully completing a run. Should be explicitly disclosed to the Participant ahead of time.",
    )

    # Duration
    max_duration_sec: int = pydantic.Field(
        gt=0,
        description="The maximum of time in seconds a Participant has to complete a run of the NodeGraph before it is no longer accepted."
    )

    # Metadata that should be disclosed to the Participant ahead of time:
    title: str = pydantic.Field(
        min_length=1,
        description='The title of the posting for the NodeGraph.'
    )
    description: str = pydantic.Field(
        min_length=1,
        description='A detailed description of the NodeGraph.'
    )
    keywords: List[str] = pydantic.Field(
        description='Keywords that Participants may use to discover this task.'
    )

    # NodeKit version:
    nodekit_version: str = pydantic.Field(default=VERSION)
