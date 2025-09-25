from typing import Dict, List, Union, Self

import pydantic

from nodekit import VERSION, Node
from nodekit._internal.types.common import NodeId, SensorId


class Graph(pydantic.BaseModel):
    """
    The canonical representation of a NodeKit runtime.
     A Graph consists of Nodes and transitions between them.
     Nodes which do not have any outgoing transitions are terminal Nodes which end the experiment when completed.
    """
    nodekit_version: str = pydantic.Field(default=VERSION)
    nodes: Dict[NodeId, Node]
    start: NodeId
    transitions: Dict[NodeId, Dict[SensorId, NodeId]]  = pydantic.Field(
        description='A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node.'
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

                # Todo: this is a slow O(N^2) approach

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
