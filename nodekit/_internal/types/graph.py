from typing import Dict, Self, List

import pydantic

from nodekit import VERSION, Node
from nodekit._internal.types.common import NodeId, SensorId

from pathlib import Path


# %%
class Graph:
    """
    The canonical representation of a NodeKit runtime.
     A Graph consists of Nodes and transitions between them.
     Nodes which do not have any outgoing transitions are terminal Nodes which end the experiment when completed.
    """

    def __init__(
            self,
            nodes: Dict[NodeId, Node],
            start: NodeId,
            transitions: Dict[NodeId, Dict[SensorId, NodeId]],
    ):
        # Validate the Graph:
        self._manifest = Manifest(
            nodes=nodes,
            start=start,
            transitions=transitions,
        ).model_copy()

    @property
    def start(self) -> NodeId:
        """
        The NodeId of the starting Node in the Graph.
        """
        return self._manifest.start

    @property
    def nodes(self) -> Dict[NodeId, Node]:
        """
        A mapping from NodeId to Node.
        """
        return self._manifest.nodes

    @property
    def transitions(self) -> Dict[NodeId, Dict[SensorId, NodeId]]:
        """
        A mapping from (NodeId, SensorId) to the next NodeId that will be transitioned to if the Sensor is triggered in that Node.
        """
        return self._manifest.transitions

    @property
    def assets(self) -> Dict[MimeType, Dict[SHA256, AssetFile]]:
        """
        A mapping from mime type to a mapping from SHA-256 hash to AssetFile.
        """
        raise NotImplementedError

    def save(self, path: Path) -> None:
        """
        Saves the Graph as a .nkg file, which is a .zip archive with the following structure:

        manifest.json
        assets/
            {mime-type}/

        """
        ...
        # Copy all Assets to assets/ folder
        # Create the manifest.json
        raise NotImplementedError

    @classmethod
    def load(cls, path: Path) -> Self:
        """
        Loads a .nkg file from disk and returns the corresponding Graph object.
        Backs all Assets with the .nkg file.
        """
        raise NotImplementedError



# %% Graph manifest
class Manifest(pydantic.BaseModel):
    nodekit_version: str = pydantic.Field(default=VERSION)

    # Nodes:
    nodes: Dict[NodeId, Node]

    # Control flow:
    start: NodeId
    transitions: Dict[NodeId, Dict[SensorId, NodeId]]  = pydantic.Field(
        description='A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node.'
    )

    @pydantic.model_validator(mode='after')
    def check_graph_is_valid(self) -> Self:

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
