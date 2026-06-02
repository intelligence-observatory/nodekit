"""Internal Graph operation for transforming Asset locators."""

from collections.abc import Callable, Iterable

from nodekit._internal.types.assets import Asset, AssetLocator, BaseLocator
from nodekit._internal.types.cards import Card, CompositeCard, ImageCard, VideoCard
from nodekit._internal.types.graph import Graph
from nodekit._internal.types.node import Node
from nodekit._internal.types.sensors import (
    MultiSelectSensor,
    ProductSensor,
    SelectSensor,
    Sensor,
    SumSensor,
)


# %%
def transform_asset_locators(
    graph: Graph,
    transform: Callable[[Asset], AssetLocator],
) -> Graph:
    """Return a copy of a Graph with every Asset locator transformed."""

    graph_copy = graph.model_copy(deep=True)
    _transform_graph_asset_locators_in_place(graph=graph_copy, transform=transform)
    return graph_copy


def _transform_graph_asset_locators_in_place(
    graph: Graph,
    transform: Callable[[Asset], AssetLocator],
) -> None:
    for node in graph.nodes.values():
        if isinstance(node, Graph):
            _transform_graph_asset_locators_in_place(graph=node, transform=transform)
        elif isinstance(node, Node):
            if node.card is not None:
                _transform_card_asset_locators_in_place(card=node.card, transform=transform)
            _transform_sensor_asset_locators_in_place(sensor=node.sensor, transform=transform)
        else:
            raise TypeError(f"Unexpected graph node type: {type(node)}")


def _transform_card_asset_locators_in_place(
    card: Card,
    transform: Callable[[Asset], AssetLocator],
) -> None:
    if isinstance(card, ImageCard):
        card.image.locator = _transform_locator(asset=card.image, transform=transform)
    elif isinstance(card, VideoCard):
        card.video.locator = _transform_locator(asset=card.video, transform=transform)
    elif isinstance(card, CompositeCard):
        for child in card.children.values():
            _transform_card_asset_locators_in_place(card=child, transform=transform)


def _transform_sensor_asset_locators_in_place(
    sensor: Sensor,
    transform: Callable[[Asset], AssetLocator],
) -> None:
    for card in _iter_sensor_cards(sensor=sensor):
        _transform_card_asset_locators_in_place(card=card, transform=transform)

    if isinstance(sensor, (ProductSensor, SumSensor)):
        for child in sensor.children.values():
            _transform_sensor_asset_locators_in_place(sensor=child, transform=transform)


def _iter_sensor_cards(sensor: Sensor) -> Iterable[Card]:
    if isinstance(sensor, (SelectSensor, MultiSelectSensor)):
        yield from sensor.choices.values()


def _transform_locator(
    asset: Asset,
    transform: Callable[[Asset], AssetLocator],
) -> AssetLocator:
    transformed_locator = transform(asset.model_copy(deep=True))
    if not isinstance(transformed_locator, BaseLocator):
        raise TypeError(
            "transform_asset_locators transform must return an AssetLocator, "
            f"got {type(transformed_locator)}."
        )
    return transformed_locator
