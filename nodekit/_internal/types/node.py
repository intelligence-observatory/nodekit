from typing import List, Dict, Self

import pydantic

from nodekit._internal.types.board import Board
from nodekit._internal.types.cards.cards import Card
from nodekit._internal.types.common import AmountUsdStr, NodeId, SensorId
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
    sensors: Dict[SensorId, Sensor] = pydantic.Field(
        min_length=1,
        description='List of Sensors that listen for a Participant Action. The first Sensor that is triggered ends the Node.'
    )
    effects: List[Effect] = pydantic.Field(default_factory=list)

    # Annotations:
    payment_usd: AmountUsdStr = pydantic.Field(
        default='0',
        description='The Experimenter\'s intended change to the Particant\'s bonus amount (in USD) whenever this Node is visited.'
    )


# %%
InstanceId = str
from typing import List, Literal

"""
EntryPort = GraphId | NodeId
ExitPort = GraphId | NodeId | NodeId#SensorId

Address to identify a specific Node in a Graph is: 
node_id = {NodeId} # If Node in the top-level.
node_id = {GraphId}/{NodeId} # If Node in a sub-graph
node_id = {GraphId}/{GraphId}/{NodeId} # If Node in a sub-sub-graph


Transition:
ExitPort to EntryPort
"""

# %%
class GraphBuilder:
    def __init__(
            self,
            **kwargs
    ):
        ...


    def append(self, other) -> Self:
        ...

    def extend(self, others) -> Self:
        ...

    def to_json(self):
        ...

    def from_json(self):
        ...

# %%
class Graph(pydantic.BaseModel):
    """
    The canonical representation of a NodeKit runtime: a directed acyclic graph consisting of Nodes and Transitions between them, keyed off of Sensors.
    All Graphs begin at a single Node, given by start_index.
    Every Node in a Graph must have a path to an END Node, which is encoded by N.
    """
    nodekit_version: str = pydantic.Field(default=VERSION)
    nodes: Dict[NodeId, Node]
    start: NodeId
    transitions: Dict[NodeId, Dict[SensorId, NodeId]]  = pydantic.Field(
        description='A mapping from (node_id, sensor_id) pairs to the next_node_id that should be transitioned to when that Sensor is triggered in that node.'
    )

    @pydantic.model_validator(mode='after')
    def check_graph_is_valid(self) -> 'Graph':

        if not self.start in self.nodes:
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

    @classmethod
    def from_sequence(
            cls,
            sequence: List[Node | 'Graph'],
            ids: List[InstanceId | None] = None,
    ) -> Self:
        """
        A convenience method for returning a Graph which executes the given List[Node | Graph]  in the given order.
        The items are automatically issued ids unless `ids` is given.
        """
        if ids and len(ids) != len(sequence):
            raise ValueError("If ids are given, must be the same length as sequence.")
        if not ids:
            ids = [f'{i}' for i in range(len(sequence))]
        nodes: Dict[NodeId, Node] = {}
        transitions: Dict[NodeId, Dict[SensorId, NodeId]] = {}

        for i_child, child in enumerate(sequence):
            if isinstance(child, Node):
                if ids[i_child] in nodes:
                    raise ValueError(f"Duplicate NodeId {ids[i_child]} in sequence.")

                current_id = ids[i_child]
                nodes[current_id] = child
                if i_child > 0:
                    # Transition from previous Node to this Node on any Sensor of the previous Node:
                    prev_id = ids[i_child - 1]
                    transitions[prev_id] = {sensor_id: current_id for sensor_id in nodes[prev_id].sensors.keys()}
            elif isinstance(child, Graph):
                ...
                raise NotImplementedError
            else:
                raise ValueError(f"Invalid item in sequence: {child}")

        return cls(
            nodes=nodes,
            start=ids[0],
            transitions=transitions,
        )

# %%
class Trace(pydantic.BaseModel):
    """
    The canonical representation of a Participant's run through a Graph.
    """
    nodekit_version: str = pydantic.Field(default=VERSION)
    events: List[Event]
