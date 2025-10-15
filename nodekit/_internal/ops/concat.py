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
    #
    if len(sequence) == 0:
        raise ValueError("Sequence must have at least one item.")

    # Generate IDs:
    if ids and len(ids) != len(sequence):
        raise ValueError("If ids are given, must be the same length as sequence.")
    if not ids:
        ids: List[NodeId] = [f"{i}" for i in range(len(sequence))]
    if len(set(ids)) != len(ids):
        raise ValueError("If ids are given, they must be unique.")

    # Assemble Graph:
    nodes: Dict[NodeId, Node] = {}
    transitions: Dict[NodeId, Dict[SensorId, NodeId]] = {}
    connections: List[Tuple[List[NodeId], NodeId]]

    for i_child, child in enumerate(sequence):
        if isinstance(child, Node):
            # Register the Node
            current_node_id = ids[i_child]
            nodes[current_node_id] = child

            if i_child > 0:
                connections.append()
        
        elif isinstance(child, Graph):
            # Register nodes with namespaced ids:
            current_node_namespace = ids[i_child]
            terminal_in_graph = []
            for node_id, node in child.nodes.items():
                # Add namespace prefix
                new_id = f"{current_node_namespace}/{node_id}"
                nodes[new_id] = node

            terminal_nodes.append(terminal_in_graph)

            # Add transitions that describe the internal structure of this sub-graph:
            for from_id, sensor_map in child.transitions.items():
                new_from_id = f"{current_node_namespace}/{from_id}"
                transitions[new_from_id] = {
                    sensor_id: f"{current_node_namespace}/{to_id}"
                    for sensor_id, to_id in sensor_map.items()
                }

            if i_child > 0:
                start_nodes.append(f"{current_node_namespace}/{child.start}")

        else:
            raise ValueError(f"Invalid item in sequence: {child}")
    
    print(start_nodes, terminal_nodes)
    # Add transitions that describe the connections between items in sequence:
    for src, dst in zip(terminal_nodes, start_nodes):
        if isinstance(src, List):
            for s in src:
                current_sensors = nodes[s].sensors
                transitions[s] = {sensor: dst for sensor in current_sensors}
        else:
            current_sensors = nodes[src].sensors
            transitions[src] = {sensor: dst for sensor in current_sensors}

    # Derive the start node id
    if isinstance(sequence[0], Node):
        start_node_id = ids[0]
    elif isinstance(sequence[0], Graph):
        start_node_id = f"{ids[0]}/{sequence[0].start}"
    else:
        raise ValueError(f"Invalid item in sequence: {sequence[0]}")

    return Graph(
        nodes=nodes,
        start=start_node_id,
        transitions=transitions,
    )
