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
        description='Conditions that terminate the Node when met.'
    )

    effects: List[Effect] = pydantic.Field(default_factory=list)

class Transition(pydantic.BaseModel):
    node_index: NodeIndex | Literal['START']  # 'START' is a special sentinel value indicating the start of the Graph
    sensor_index: SensorIndex | None  # None indicates an unconditional transition (e.g., from START)
    next_node_index: NodeIndex | Literal['END']  # 'END' is a special sentinel value indicating the end of the Graph


# %%
class Graph(pydantic.BaseModel):
    """
    A directed graph of Nodes which defines a runtime.
    A Graph begins with the START Node.
    Every Node in a Graph must have a path to an END Node.

    Graphs may be defined compositionally: multiple Graphs can be combined using the
    .append() and .extend() convenience methods.
    """
    nodes: List[Node] = pydantic.Field(min_length=1)
    transitions: List[Transition]
    nodekit_version: str = pydantic.Field(default=VERSION)

    def append(self, graph: 'Graph') -> 'Graph':
        # Append another graph to this one, returning a new Graph.
        # These two Graphs will be executed sequentially
        raise NotImplementedError()

    def extend(self, graphs: List['Graph']) -> 'Graph':
        # Extend this graph by appending multiple graphs, returning a new Graph.
        # These Graphs will be executed sequentially
        raise NotImplementedError()

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