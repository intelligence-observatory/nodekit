import collections
from typing import Dict

from nodekit._internal.types.graph import Graph
from nodekit._internal.types.node import Node
from nodekit._internal.types.transition import End, Go, Transition
from nodekit._internal.types.value import NodeId


# %%
def concat(
    sequence: list[Graph | Node],
    ids: list[str] | None = None,
) -> Graph:
    """
    Returns a Graph which executes the given sequence of Node | Graph.
    In the new Graph, the sequence items' RegisterIds and NodeIds are prepended ids '0', '1', ..., unless `ids` is given.
    """

    if len(sequence) == 0:
        raise ValueError("Sequence must have at least one item.")

    # Generate new IDs:
    if ids and len(ids) != len(sequence):
        raise ValueError("If ids are given, must be the same length as sequence.")
    if ids is None:
        ids: list[NodeId] = [f"{i}" for i in range(len(sequence))]
    if len(set(ids)) != len(ids):
        counts = collections.Counter(ids)
        duplicates = [id_ for id_, count in counts.items() if count > 1]
        raise ValueError(
            f"If ids are given, they must be unique. Duplicates:\n{'\n'.join(duplicates)}"
        )

    # Assemble:
    nodes: Dict[NodeId, Node | Graph] = {}
    transitions: Dict[NodeId, Transition] = {}

    for i, (node_id, node) in enumerate(zip(ids, sequence)):
        nodes[node_id] = node

        if i + 1 < len(ids):
            transitions[node_id] = Go(to=ids[i + 1])
        else:
            transitions[node_id] = End()

    return Graph(
        nodes=nodes,
        transitions=transitions,
        start=ids[0],
    )
