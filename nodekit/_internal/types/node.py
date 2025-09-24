from typing import List, Literal

import pydantic

from nodekit._internal.types.board import Board
from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.common import NodeIndex, SensorIndex
from nodekit._internal.types.effects.effects import Effect
from nodekit._internal.types.events.events import Event
from nodekit._internal.types.sensors.sensors import Sensor
from nodekit._internal.version import VERSION


# %%
class Node(pydantic.BaseModel):

    class Config:
        frozen = True

    board: Board = pydantic.Field(default_factory=Board)

    cards: List[Card] = pydantic.Field(
        description=(
            "List of Cards placed on the Board, in back-to-front order."
            "The first Card in this list is at the \"bottom\" of the Board, in the z-direction."
        ),
    )
    sensors: List[Sensor] = pydantic.Field(
        min_length=1,
        description='List of Sensors that listen for a Participant Action. The first Sensor that is triggered ends the Node.'
    )
    effects: List[Effect] = pydantic.Field(default_factory=list)


class Transition(pydantic.BaseModel):
    node_index: NodeIndex # The Node from which this Transition originates
    sensor_index: SensorIndex # The Sensor in that Node that triggers this Transition. None acts as a wildcard.
    next_node_index: NodeIndex | Literal['END']

# %%
class Graph(pydantic.BaseModel):
    """
    The canonical representation of a NodeKit runtime: a directed acyclic graph consisting of Nodes and Transitions between them, keyed off of Sensors.
    All Graphs begin at a single Node, given by start_index.
    Every Node in a Graph must have a path to an END Node, which is encoded by N.
    """
    nodes: List[Node] = pydantic.Field(
        min_length=1,
        description='A topologically sorted list of Nodes in the Graph. Tie-breaks are resolved by Node content hash.'
    )
    transitions: List[Transition]
    start_node_index: NodeIndex
    nodekit_version: str = pydantic.Field(default=VERSION)

    @pydantic.model_validator(mode='after')
    def check_graph_is_valid(self) -> 'Graph':
        # Todo
        num_nodes = len(self.nodes)
        # Check totality: each Node's sensors must have exactly one transition defined

        # Check acyclicity via Kahn's algorithm
        # Todo: topologically sort nodes in the validator
        ...
        # Check all sensors and nodes are reachable from START
        ...
        # Check all nodes have a path to END

        return self

# %%
class Trace(pydantic.BaseModel):
    events: List[Event]
    nodekit_version: str = pydantic.Field(default=VERSION, description='The semantic version number of NodeKit.')