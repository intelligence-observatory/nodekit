from abc import ABC
from typing import Any

import pydantic

from nodekit._internal.models.node_engine.base import DslModel
from nodekit._internal.models.node_engine.fields import TimePointMsec, SensorId


class BaseAction(DslModel, ABC):
    sensor_id: SensorId = pydantic.Field(
        description='Identifier of the Sensor that emitted this Action.'
    )
    action_type: str
    action_value: Any
    reaction_time_msec: TimePointMsec = pydantic.Field(
        description='Measured from the onset of the earliest possible time the Action could be emitted.'
    )
