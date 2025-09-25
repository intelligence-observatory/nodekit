from typing import Dict, Self, List, Union

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
    The canonical representation of a NodeKit runtime: a directed acyclic graph starting at a single Node.
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
            sequence: List[Union[Node , 'Graph']],
            ids: List[NodeId | None] = None,
    ) -> Self:
        """
        A convenience method for returning a Graph which executes the given List[Node | Graph]  in the given order.
        The items are automatically issued ids unless `ids` is given.
        """

        # Generate IDs:
        if ids and len(ids) != len(sequence):
            raise ValueError("If ids are given, must be the same length as sequence.")
        if not ids:
            ids: List[NodeId] = [f'{i}' for i in range(len(sequence))]
        if len(set(ids)) != len(ids):
            raise ValueError("If ids are given, they must be unique.")

        # Assemble Graph:
        nodes: Dict[NodeId, Node] = {}
        transitions: Dict[NodeId, Dict[SensorId, NodeId]] = {}

        for i_child, child in enumerate(sequence):
            if isinstance(child, Node):
                # Register the Node
                current_node_id = ids[i_child]
                nodes[current_node_id] = child

                # Get pointer to the entry port for this Node:
                start_node_id = current_node_id
            elif isinstance(child, Graph):
                # Register nodes with namespaced ids:
                current_node_namespace = ids[i_child]
                for node_id, node in child.nodes.items():
                    # Add namespace prefix
                    new_id = f'{current_node_namespace}/{node_id}'
                    nodes[new_id] = node

                # Add transitions that describe the internal structure of this sub-graph:
                for from_id, sensor_map in child.transitions.items():
                    new_from_id = f'{current_node_namespace}/{from_id}'
                    transitions[new_from_id] = {sensor_id: f'{current_node_namespace}/{to_id}' for sensor_id, to_id in sensor_map.items()}

                # Get pointer to the entry port for this sub-graph:
                start_node_id = f'{current_node_namespace}/{child.start}'
            else:
                raise ValueError(f"Invalid item in sequence: {child}")

            # Connect outgoing ports of previous Node | Graph to the start Node of this Node | Graph:
            if i_child > 0:
                prev_namespace = ids[i_child - 1]

                # Connect terminal Sensors in previous namespace to this Node:
                for prev_node_id in nodes.keys():
                    prev_node = nodes[prev_node_id]

                    if prev_node_id == prev_namespace: # The previous item in sequence was a Node
                        # Should not have any transitions yet
                        assert prev_node_id not in transitions
                        transitions[prev_node_id] = {}

                        # Connect all its sensors to the start of this Node
                        for sensor_id in prev_node.sensors.keys():
                            transitions[prev_node_id][sensor_id] = start_node_id

                        break # No need to check other Nodes

                    if prev_node_id.startswith(f'{prev_namespace}/'): # The previous item in sequence was a Graph; this is one of its Nodes
                        # Connect any of this Node's terminal sensors to the start of this Node
                        for sensor_id in prev_node.sensors.keys():
                            # If this sensor_id does not have a transition, add one linking it here
                            if prev_node_id not in transitions:
                                transitions[prev_node_id] = {}

                            if sensor_id not in transitions[prev_node_id]:
                                transitions[prev_node_id][sensor_id] = start_node_id

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
