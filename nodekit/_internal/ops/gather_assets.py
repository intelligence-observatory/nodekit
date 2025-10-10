from typing import Iterator

from nodekit._internal.types.assets.identifiers import Image, Video
from nodekit._internal.types.cards.cards import ImageCard, VideoCard
from nodekit._internal.types.graph import Graph


def iter_assets(graph: Graph) -> Iterator[Image | Video]:
    """
    Iterates over all assets found in the graph.
    """
    for node in graph.nodes.values():
        for card in node.cards:
            if isinstance(card, ImageCard):
                yield card.image
            elif isinstance(card, VideoCard):
                yield card.video
