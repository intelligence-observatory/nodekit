from pathlib import Path
from typing import Self, Dict, List

import pydantic

from nodekit import Node, VERSION
from nodekit._internal.types.assets.identifiers import AssetIdentifier
from nodekit._internal.types.cards.cards import (
    ImageCard,
    VideoCard,
)
from nodekit._internal.types.common import NodeId, SensorId, MediaType, SHA256
from nodekit._internal.ops.hash_asset_file import get_extension


# %%
class Manifest(pydantic.BaseModel):
    """
    The data model for the manifest.json file inside a NodeKit Graph file (.nkg), which is the
    canonical representation of a NodeKit Graph.
    """

    nodekit_version: str = pydantic.Field(default=VERSION)
    start: NodeId
    nodes: Dict[NodeId, Node]
    transitions: Dict[NodeId, Dict[SensorId, NodeId]] = pydantic.Field(
        description="A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node."
    )

    asset_paths: Dict[MediaType, Dict[SHA256, Path]] = pydantic.Field(
        description="Relative paths to all assets referenced by the Graph. "
                    "A dictionary mapping ({media type}, {sha256}) to the "
                    "path of the backing file relative to the root of the zip archive."
    )

    @pydantic.model_validator(mode="after")
    def check_graph_is_valid(self) -> Self:
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

        # Check all referenced Assets exist

        return self

# %%
class Graph:
    def __init__(
            self,
            start: NodeId,
            nodes: Dict[NodeId, Node],
            transitions: Dict[NodeId, Dict[SensorId, NodeId]],
    ):

        # Check that all Assets in the Nodes are backed by a locator, and not bare identifiers

        # Check that all Assets used in this Graph exist in the AssetStore; otherwise, raise an error:
        ... # todo

        # Validate the wire JSON model for the Graph:
        self._manifest: Manifest = Manifest(
            start=start,
            nodes=nodes,
            transitions=transitions,
            asset_paths=asset_paths,
        )

    @property
    def start(self) -> NodeId:
        return self._manifest.start

    @property
    def nodes(self) -> Dict[NodeId, Node]:
        return self._manifest.nodes

    @property
    def transitions(self) -> Dict[NodeId, Dict[SensorId, NodeId]]:
        return self._manifest.transitions

def collect_asset_identifiers(node: Node) -> List[AssetIdentifier]:
    assets: List[AssetIdentifier] = []

    for card in node.cards:
        if isinstance(card, ImageCard):
            asset_identifier = card.image
        elif isinstance(card, VideoCard):
            asset_identifier = card.video
        else:
            continue
        assets.append(asset_identifier)
    return assets
