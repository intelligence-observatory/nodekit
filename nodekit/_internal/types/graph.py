from typing import Dict, Literal, Self, Union

import pydantic

from nodekit import VERSION, Node
from nodekit._internal.types.transition import Transition
from nodekit._internal.types.value import NodeId, RegisterId, Value


# %%
class Graph(pydantic.BaseModel):
    type: Literal["Graph"] = "Graph"
    nodekit_version: Literal["0.2.0"] = pydantic.Field(default=VERSION, validate_default=True)
    nodes: Dict[NodeId, Union[Node, "Graph"]]
    transitions: Dict[NodeId, Transition]
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

        # Todo: Each Node must be reachable from the start Node (i.e., no disconnected components)

        # Todo: Each Go transition must point to an existing Node

        # Todo: check each Nodes has a path to an End transition

        return self
