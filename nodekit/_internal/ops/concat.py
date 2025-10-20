from typing import List, Union, Dict, Tuple

from nodekit._internal.types.graph import Graph
from nodekit._internal.types.node import Node
from nodekit._internal.types.common import (
    NodeId,
    SensorId,
)


def concat(
    sequence: List[Union[Graph, Node]],
    ids: List[NodeId] | None = None,
) -> Graph:
    """
    A convenience method for returning a Graph which executes the given List[Node | Graph]  in the given order.
    The items are automatically issued namespace ids '0', '1', ... in order, unless `ids` is given.
    """
    # Check sequence length:
    if len(sequence) == 0:
        raise ValueError("Sequence must have at least one item.")

    # Generate IDs:
    if ids and len(ids) != len(sequence):
        raise ValueError("If ids are given, must be the same length as sequence.")

    if ids is not None and len(set(ids)) != len(ids):
        raise ValueError("If ids are given, they must be unique.")

    if not ids:
        ids: List[NodeId] = [f"{i}" for i in range(len(sequence))]

    if len(set(ids)) != len(ids):
        raise ValueError("If ids are given, they must be unique.")

    # Validate sequence items:
    if any(not isinstance(x, (Node, Graph)) for x in sequence):
        raise TypeError("All elements in sequence must be `Node` or `Graph`.")

    # Assemble Graph:
    nodes: Dict[NodeId, Node] = {}
    transitions: Dict[NodeId, Dict[SensorId, NodeId]] = {}
    connections: List[List[Tuple[NodeId, SensorId]]] = []

    for i_child, child in enumerate(sequence):
        if isinstance(child, Node):
            current_node_id = ids[i_child]
            nodes[current_node_id] = child

            # Add connection with NodeId and SensorId pair for the node:
            connections.append([(current_node_id, sensor) for sensor in child.sensors])

        elif isinstance(child, Graph):
            # Register nodes with namespaced ids:
            current_node_namespace = ids[i_child]
            terminal: List[Tuple[NodeId, SensorId]] = []

            for node_id, node in child.nodes.items():
                # Add namespace prefix:
                new_id = f"{current_node_namespace}/{node_id}"
                nodes[new_id] = node

                # Add connection with NodeId and SensorId pair for terminal nodes and nodes with hanging sensors:
                for sensor in node.sensors:
                    if sensor not in child.transitions.get(node_id, {}):
                        terminal.append((new_id, sensor))

            connections.append(terminal)

            # Redo internal transitions with namespaced ids:
            for from_id, sensor_map in child.transitions.items():
                new_from_id = f"{current_node_namespace}/{from_id}"
                transitions[new_from_id] = {
                    sensor_id: f"{current_node_namespace}/{to_id}"
                    for sensor_id, to_id in sensor_map.items()
                }

        else:
            raise ValueError(f"Invalid item in sequence: {child}")

    # Create transitions between items in sequence:
    for i in range(len(connections) - 1):
        from_list = connections[i]

        # Get next node id:
        next_element = sequence[i + 1]
        if isinstance(next_element, Node):
            to_node = ids[i + 1]

        if isinstance(next_element, Graph):
            to_node = f"{ids[i + 1]}/{next_element.start}"

        # From connections create transitions to next node:
        for from_id, sensor_id in from_list:
            transitions.setdefault(from_id, {})[sensor_id] = to_node

    # Derive the start node id
    if isinstance(sequence[0], Node):
        start_node_id = ids[0]

    if isinstance(sequence[0], Graph):
        start_node_id = f"{ids[0]}/{sequence[0].start}"

    return Graph(
        nodes=nodes,
        start=start_node_id,
        transitions=transitions,
    )
