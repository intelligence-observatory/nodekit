from abc import ABC
from typing import Any

import pydantic

from nodekit._internal.models.fields import (
    DatetimeUTC
)
from nodekit._internal.models.node_engine.base import DslModel
from nodekit._internal.models.node_engine.fields import SensorId


class BaseAction(DslModel, ABC):
    sensor_id: SensorId = pydantic.Field(
        description='Identifier of the Sensor that emitted this Action.'
    )
    action_type: str
    action_value: Any
    timestamp_action: DatetimeUTC = pydantic.Field(
        description='The timestamp when the Sensor for this Action was triggered.'
    )
