import nodekit as nk
from nodekit._internal.types.common import SensorId, NodeId
from typing import Dict, List, Tuple
from collections import defaultdict, deque


def topological_sort(nodes: Dict[NodeId, nk.Node], transitions: Dict[NodeId, Dict[SensorId, NodeId]]) -> List[NodeId]:
    """
    Perform a topological sort over a directed graph of nodes and transitions.

    Each Node object is a window with cards, and transitions define directed edges 
    between nodes, keyed by SensorId identifiers. Nodes are first ranked according 
    to their topological order, then ties within the same rank are deterministically 
    broken lexicologically using incoming SensorIds. Nodes without incoming sensors (roots)
    are prioritized first.

    Args:
    nodes : Mapping of node identifiers to Node objects representing graph vertices.
    transitions : Mapping from each input NodeId to its outgoing transitions, where each
        key is a SensorId and each value is the target NodeId of that transition.

    Returns:
    List[NodeId]: A list of node identifiers in topologically sorted order
    """

    node_keys = [key for key in nodes]
    edges = []
    incoming_sensors = {key:[] for key in nodes}
    for in_node, transition in transitions.items():

        # Check if input Node from the transitions exists:
        if in_node not in nodes:
            raise KeyError(f"Transition refers to non-existent node '{in_node}'")

        for sensor, out_node in transition.items():

            # Check if Sensor from the transition exists:
            if sensor not in nodes[in_node].sensors:
                raise KeyError(f"Sensor '{sensor}' not found in node '{in_node}'")

            # Check if output Node from the transition exists:
            if out_node not in nodes:
                raise KeyError(f"Transition from '{in_node}' points to unknown node '{out_node}'")

            edges.append((in_node, out_node))
            incoming_sensors[out_node].append(sensor)
            
    rank_order = topo_sort_core(node_keys, edges)
    
    # Group by rank and apply tie-breaker:
    rank_groups = defaultdict(list)
    for key, rank in zip(node_keys, rank_order):
        rank_groups[rank].append(key)

    ordered = []
    for rank in sorted(rank_groups.keys()):
        group = rank_groups[rank]
        # Tie-break sorts nodes alphabetically but puts nodes with no incoming sensors (root nodes) first
        group.sort(
            key = lambda node: (incoming_sensors.get(node) is None,
                                incoming_sensors.get(node))
        )
        ordered.extend(group)

    return ordered

    
def topo_sort_core(node_keys: List[NodeId], edges: List[Tuple[NodeId, NodeId]]) -> List[int]:
    """
    Perform topological sorting and return a list of ranks for each node key.

    Args:
        node_keys: List of unique node identifiers (strings).
        edges: List of (src, dst) edges representing dependencies.

    Returns:
        List[int]: Ranks corresponding to each node in node_keys order.
    """
    # Build adjacency list and indegree count:
    adjacency = defaultdict(list)
    indegree = {key: 0 for key in node_keys}

    for src, dst in edges:
        adjacency[src].append(dst)
        indegree[dst] += 1

    # Initialize queue with nodes of indegree 0:
    queue = deque([key for key, deg in indegree.items() if deg == 0])

    rank_map = {}
    current_rank = 0

    # Core sorting algorithm:
    while queue:
        for _ in range(len(queue)):
            node = queue.popleft()
            rank_map[node] = current_rank
            for neighbor in adjacency[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
        current_rank += 1

    # Check for cycles:
    if len(rank_map) != len(node_keys):
        raise ValueError("Loop present in Graph, please reconfigure the structure")

    # Return ranks in the same order as node_keys:
    return [rank_map[key] for key in node_keys]    
