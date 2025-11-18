import pydantic

from typing import Self, Dict, Literal

import pydantic

from nodekit import Node, VERSION
from nodekit._internal.types.common import NodeId, SensorId

from nodekit.kernel.expressions import Value
# %%
type RegisterId = str
# %%
class Graph(pydantic.BaseModel):
    start: NodeId
    nodes: Dict[NodeId, Node]
    transitions: Dict[NodeId, Dict[SensorId, NodeId]] = pydantic.Field(
        description="A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node."
    )

    registers: Dict[RegisterId, Value] = pydantic.Field(
        default_factory=dict,
        validate_default=True,
    )

    nodekit_version: Literal["0.1.0"] = pydantic.Field(default=VERSION)


# %%