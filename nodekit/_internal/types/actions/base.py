from abc import ABC
from typing import Any

import pydantic

from nodekit._internal.types.common import (
    DatetimeUTC, SensorId
)
from nodekit._internal.types.base import DslModel


class BaseAction(DslModel, ABC):
    sensor_id: SensorId = pydantic.Field(
        description='Identifier of the Sensor that emitted this Action.'
    )
    action_type: str
    action_value: Any
    timestamp_action: DatetimeUTC = pydantic.Field(
        description='The timestamp when the Sensor for this Action was triggered.'
    )
