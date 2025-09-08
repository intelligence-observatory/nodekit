from typing import List, Self
from uuid import uuid4

import pydantic
from nodekit._internal.version import VERSION

from nodekit._internal.types.board import Board
from nodekit._internal.types.bonus_policy import BonusRule
from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.common import (
    PayableMonetaryAmountUsd,
    NodeId
)
from nodekit._internal.types.effects.effects import Effect
from nodekit._internal.types.sensors.sensors import Sensor


# %% Node
class Node(pydantic.BaseModel):
    node_id: NodeId = pydantic.Field(default_factory=uuid4)

    board: Board = pydantic.Field(
        default_factory=Board
    )

    cards: List[Card] = pydantic.Field(
        description=(
            "List of Cards placed on the Board, in back-to-front order."
            "The first Card in this list is at the \"bottom\" of the Board, in the z-direction."),
    )
    sensors: List[Sensor] = pydantic.Field(
        min_length=1,
    )
    effects: List[Effect] = pydantic.Field(default_factory=list)

    @pydantic.model_validator(mode='after')
    def check_node_is_well_formed(self) -> Self:

        # Check Card IDs are unique within the Node
        card_id_to_card = {card.card_id: card for card in self.cards}
        if len(card_id_to_card) != len(self.cards):
            raise ValueError("Cards in a Node must each have a unique ID.")

        # Check Sensor IDs are unique within the Node:
        sensor_id_to_sensor = {sensor.sensor_id: sensor for sensor in self.sensors}
        if len(sensor_id_to_sensor) != len(self.sensors):
            raise ValueError("Sensors in a Node must each have a unique ID.")
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

    nodes: List[Node]

    # Payment information
    base_payment_usd: PayableMonetaryAmountUsd = pydantic.Field(
        description="The base payment (in USD) that a Participant receives upon successfully completing a run. Disclosed to the Participant ahead of time.",
    )
    bonus_rules: List[BonusRule] = pydantic.Field(
        description='A list of bonus rules that are used to compute a bonus reward based on Participant behavior during the run.'
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
