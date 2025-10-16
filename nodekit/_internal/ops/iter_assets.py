from typing import Iterator, Callable

from nodekit._internal.types.assets import Image, Video
from nodekit._internal.types.cards import ImageCard, VideoCard, Card
from nodekit._internal.types.graph import Graph

def iter_assets(graph: Graph) -> Iterator[Image | Video]:
    """
    Iterates over all assets found in the graph.
    """
    for node in graph.nodes.values():
        for card in node.cards.values():
            card: Card
            if isinstance(card, ImageCard):
                yield card.image
            elif isinstance(card, VideoCard):
                yield card.video

def transform_asset_locators(
        graph: Graph,
        transform_func:  Callable[[Image | Video], Image | Video]
) -> Graph:
    """
    Transforms all asset locators in the Graph to use the provided locators.
    Returns a copy.
    """