from typing import Literal, List, Dict

from nodekit._internal.types.board import Board
from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.common import SensorIndex
from nodekit._internal.types.effects.effects import Effect
from nodekit._internal.types.sensors.sensors import Sensor

NodeId = str
SensorId = str

class GraphBuilder:
    """
    Convenience class for building a Graph incrementally.
    """

    def __init__(
            self
    ):
        ...

    def add_node(
            self,
            node_id: NodeId, # User-supplied handle
            cards: List[Card],
            sensors: Dict[SensorId, Sensor],
            next_node: Dict[SensorId, NodeId | Literal['END']], # Forward references allowed
            board: Board | None = None,
            effects: List[Effect] | None = None,
    ):
        """
        Add a Node to the Graph. If a Node with the given node_id already exists, it is replaced.
        """
        ...

