from abc import ABC
from typing import Any

import pydantic

from psykit._internal.models.node_engine.base import DslModel
from psykit._internal.models.node_engine.fields import Timespan, SensorId, CardId
from uuid import uuid4


class BaseSensor(DslModel, ABC):
    """
    A Sensor represents a listener for Participant behavior. Sensors are bound to a specific Card, or to the Board.
    When a Sensor is triggered, it emits a fully qualified Action.
    """

    # Sensor
    sensor_id: SensorId = pydantic.Field(default_factory=uuid4)
    sensor_type: str
    sensor_parameters: Any
    # Temporal
    sensor_timespan: Timespan

    # Sensor target
    card_id: CardId | None = pydantic.Field(description='Identifier of the Entity (Card or Board) that this Sensor is attached to.')
