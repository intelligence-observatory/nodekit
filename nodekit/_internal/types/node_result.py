from typing import Dict

import pydantic

from nodekit._internal.types.common import SensorId
from nodekit._internal.types.node import Node

class NodeResult(pydantic.BaseModel):
    node: Node
    action: Dict[SensorId, SensorValue]
