from typing import Dict

import pydantic

from nodekit import VERSION, Node, Board
from nodekit._internal.types.common import NodeId, SensorId


class Graph(pydantic.BaseModel):
    """
    The canonical representation of a NodeKit runtime.
     A Graph consists of Nodes and transitions between them.
     Nodes which do not have any outgoing transitions are terminal Nodes which end the experiment when completed.
    """
    nodekit_version: str = pydantic.Field(default=VERSION)

    # Nodes:
    nodes: Dict[NodeId, Node]

    # Control flow:
    start: NodeId
    transitions: Dict[NodeId, Dict[SensorId, NodeId]]  = pydantic.Field(
        description='A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node.'
    )

    @pydantic.model_validator(mode='after')
    def check_graph_is_valid(self) -> 'Graph':

        if self.start not in self.nodes:
            raise ValueError(f"Graph start node {self.start} not in nodes.")

        num_nodes = len(self.nodes)
        if num_nodes == 0:
            raise ValueError("Graph must have at least one node.")

        # Todo

        # Todo: Each Node except the start Node must be reachable from the start Node (i.e., no disconnected components)

        # Check acyclicity:
        # Todo: topologically sort nodes in the validator
        ...
        # Check all nodes have a path to END

        return self
