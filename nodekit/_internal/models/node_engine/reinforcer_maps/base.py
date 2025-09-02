from abc import ABC
from typing import Any

from nodekit._internal.models.node_engine.base import DslModel
from nodekit._internal.models.node_engine.fields import SensorId


class BaseReinforcerMap(DslModel, ABC):
    """
    Represents a map from a fully qualified Action emitted by a particular Sensor to an Outcome.
    """
    reinforcer_map_type: str
    reinforcer_map_parameters: Any
    sensor_id: SensorId
