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
from nodekit._internal.types.effects.base import Effect
from nodekit._internal.types.reinforcer_maps.reinforcer_maps import ReinforcerMap
from nodekit._internal.types.sensors.sensors import Sensor


# %% Node
class Node(pydantic.BaseModel):
    node_id: NodeId = pydantic.Field(default_factory=uuid4)

    board: Board = pydantic.Field(
        default_factory=Board
    )

    cards: List[Card] = pydantic.Field(
        description=(
            "List of Cards placed on the Board, in back-to-front order "
            "(i.e. the first Card in this list is at the \"bottom\" of the Board, in the z-direction)"),
    )

    sensors: List[Sensor] = pydantic.Field(
        min_length=1,
    )
    reinforcer_maps: List[ReinforcerMap] = pydantic.Field(default_factory=list)
    effects: List[Effect] = pydantic.Field(default_factory=list)

    @pydantic.model_validator(mode='after')
    def check_node_is_well_formed(self) -> Self:

        # Run basic checks
        # Check Cards have unique IDs
        card_id_to_card = {card.card_id: card for card in self.cards}
        if len(card_id_to_card) != len(self.cards):
            raise ValueError("Cards must have unique IDs.")

        # Check Sensors:
        sensor_id_to_sensor = {sensor.sensor_id: sensor for sensor in self.sensors}
        if len(sensor_id_to_sensor) != len(self.sensors):
            raise ValueError("Sensors must have unique IDs.")
        for sensor in self.sensors:

            # Ensure Sensor references a valid target
            if sensor.card_id and sensor.card_id not in card_id_to_card:
                raise ValueError(f"Sensor {sensor.sensor_id} is not attached to a valid Card or the Board.")

            # Todo: check that the Sensor and Target type are compatible:
            ...

        # Check Reinforcer Maps
        for rmap in self.reinforcer_maps:
            if rmap.sensor_id not in sensor_id_to_sensor:
                raise ValueError(f"ReinforcerMap {rmap.reinforcer_map_id} is not attached to a valid Sensor.")

            # Todo: apply rules for ReinforcerMap-Sensor compatibility
            ...

        return self


# %% NodeGraph
class NodeGraph(pydantic.BaseModel):

    nodes: List[Node]

    # Payment information
    base_payment_usd: PayableMonetaryAmountUsd = pydantic.Field(
        description="The base payment (in USD) that a Participant receives upon successfully completing a TaskRun. Explicitly disclosed to the Participant ahead of time.",
    )
    bonus_rules: List[BonusRule] = pydantic.Field(
        default_factory=list,
        description='A list of bonus rules that apply to the TaskRun. These rules determine additional payments based on Participant behavior during the TaskRun.'
                    'These are not disclosed to the Participant by default, but might be described elsewhere, like the description or in a Node.'
    )

    # Duration
    max_duration_sec: int = pydantic.Field(
        gt=0,
        description="The maximum of time in seconds a Participant has to complete a TaskRun, before it is marked as failed."
    )

    # Metadata that is disclosed to the Participant:
    title: str = pydantic.Field(
        min_length=1,
        description='The title of the Recruitment Platform posting for the task.'
    )
    description: str = pydantic.Field(
        min_length=1,
        description='A detailed description of the task in the Recruitment Platform posting.'
    )
    keywords: List[str] = pydantic.Field(
        description='Keywords that Participants may use to discover this task on the Recruitment Platform.'
    )

    # NodeKit version:
    nodekit_version: str = pydantic.Field(default=VERSION)
