from typing import Self, Dict, Literal

import pydantic

from nodekit import Node, VERSION
from nodekit._internal.types.common import NodeId, SensorId


# %%
class Graph(pydantic.BaseModel):
    nodekit_version: Literal["0.1.0"] = pydantic.Field(default=VERSION)
    start: NodeId
    nodes: Dict[NodeId, Node]
    transitions: Dict[NodeId, Dict[SensorId, NodeId]] = pydantic.Field(
        description="A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node."
    )

    @pydantic.model_validator(mode="after")
    def check_graph_is_valid(
        self,
    ) -> Self:
        if self.start not in self.nodes:
            raise ValueError(f"Graph start node {self.start} not in nodes.")

        num_nodes = len(self.nodes)
        if num_nodes == 0:
            raise ValueError("Graph must have at least one node.")

        # Check the start Node exists:
        if self.start not in self.nodes:
            raise ValueError(f"Start Node {self.start} does not exist in nodes.")

        # Todo: Each Node except the start Node must be reachable from the start Node (i.e., no disconnected components)

        # Todo: topologically sort nodes (make a new dict with topo-sorted insertion order)

        # Todo: check all Nodes have a path to a leaf Sensor

        return self
