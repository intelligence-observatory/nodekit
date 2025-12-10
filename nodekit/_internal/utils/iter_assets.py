from typing import Iterator, Iterable

from nodekit._internal.types.assets import Image, Video
from nodekit._internal.types.cards import Card, ImageCard, VideoCard, CompositeCard
from nodekit._internal.types.graph import Graph
from nodekit._internal.types.node import Node
from nodekit._internal.types.sensors.sensors import (
    SelectSensor,
    MultiSelectSensor,
    ProductSensor,
    SumSensor,
)


# %%
def iter_assets(graph: Graph) -> Iterator[Image | Video]:
    """
    Iterates over all assets found in the graph (cards and sensor-attached cards).
    """
    for node in graph.nodes.values():
        if isinstance(node, Graph):
            yield from iter_assets(node)
            continue
        elif isinstance(node, Node):
            yield from _iter_card_assets(node.stimulus)

            # Some sensors carry cards (select/multiselect choices, products/sums).
            yield from _iter_sensor_cards(node.sensor)
        else:
            raise TypeError(f"Unexpected graph node type: {type(node)}")


def _iter_card_assets(card: Card) -> Iterable[Image | Video]:
    if isinstance(card, ImageCard):
        yield card.image
    elif isinstance(card, VideoCard):
        yield card.video
    elif isinstance(card, CompositeCard):
        for child in card.children.values():
            yield from _iter_card_assets(child)


def _iter_sensor_cards(sensor) -> Iterable[Image | Video]:
    """
    Helper to walk sensor trees for cards (select/multiselect/product/sum).
    """
    if isinstance(sensor, SelectSensor):
        for choice_card in sensor.choices.values():
            yield from _iter_card_assets(choice_card)
    elif isinstance(sensor, MultiSelectSensor):
        for choice_card in sensor.choices.values():
            yield from _iter_card_assets(choice_card)
    elif isinstance(sensor, ProductSensor):
        for child in sensor.children.values():
            yield from _iter_sensor_cards(child)
    elif isinstance(sensor, SumSensor):
        for child in sensor.children.values():
            yield from _iter_sensor_cards(child)
