from collections import defaultdict, deque
from typing import List, Tuple

from nodekit import Graph
from nodekit._internal.types.transition import Branch, End, Go, Transition
from nodekit._internal.types.value import NodeId


# %%
def topological_sort(
    graph: Graph,
) -> List[NodeId]:
    """
    Perform a topological sort over a directed graph of nodes and transitions.

    Each Transition defines zero or more outgoing edges from a node. Nodes are ranked
    according to topological order; ties within the same rank are deterministically
    broken lexicographically. Nested Graphs (if present in nodes) are treated as leaves.

    Args:
        graph: The nk.Graph object containing nodes and transitions.
    Returns:
        List[NodeId]: A list of node identifiers in topologically sorted order
    """

    nodes, transitions = graph.nodes, graph.transitions

    edges: list[tuple[NodeId, NodeId]] = []
    for in_node, transition in transitions.items():
        if in_node not in nodes:
            raise KeyError(f"Transition refers to non-existent node '{in_node}'")

        for out_node in _outgoing_targets(transition):
            if out_node not in nodes:
                raise KeyError(
                    f"Transition from '{in_node}' points to unknown node '{out_node}'"
                )
            edges.append((in_node, out_node))

    rank_order = _topo_sort_core(list(nodes.keys()), edges)

    # Group by rank and apply lexical tie-breaker:
    rank_groups = defaultdict(list)
    for key, rank in zip(nodes.keys(), rank_order):
        rank_groups[rank].append(key)

    ordered: list[NodeId] = []
    for rank in sorted(rank_groups.keys()):
        group = rank_groups[rank]
        group.sort()
        ordered.extend(group)

    return ordered


def _topo_sort_core(
    node_keys: List[NodeId], edges: List[Tuple[NodeId, NodeId]]
) -> List[int]:
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


def _outgoing_targets(tr: Transition) -> list[NodeId]:
    if isinstance(tr, Go):
        return [tr.to]
    if isinstance(tr, End):
        return []
    if isinstance(tr, Branch):
        targets = []
        for case in tr.cases:
            if isinstance(case.then, Go):
                targets.append(case.then.to)
        if isinstance(tr.otherwise, Go):
            targets.append(tr.otherwise.to)
        return targets
    raise TypeError(f"Unsupported transition type: {tr}")
