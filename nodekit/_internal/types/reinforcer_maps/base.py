from abc import ABC
from typing import Any

from nodekit._internal.types.base import DslModel
from nodekit._internal.types.common import SensorId


class BaseReinforcerMap(DslModel, ABC):
    """
    Represents a map from a fully qualified Action emitted by a particular Sensor to an Outcome.
    """
    reinforcer_map_type: str
    reinforcer_map_parameters: Any
    sensor_id: SensorId
