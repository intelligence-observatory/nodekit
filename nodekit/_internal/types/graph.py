from typing import Dict, Literal, Self

import pydantic

from nodekit import VERSION, Node
from nodekit._internal.types.transition import Transition
from nodekit._internal.types.value import NodeId, RegisterId, Value

# %%
class Graph(pydantic.BaseModel):
    nodekit_version: Literal["0.1.0"] = pydantic.Field(
        default=VERSION, validate_default=True
    )
    nodes: Dict[NodeId, Node]
    transitions: Dict[NodeId, list[Transition]] = pydantic.Field(
        description="A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node."
    )
    start: NodeId
    registers: Dict[RegisterId, Value] = pydantic.Field(default_factory=dict)

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
