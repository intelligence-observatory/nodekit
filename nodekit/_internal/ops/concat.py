from nodekit._internal.types.node import Graph


def concat(
        graphs: [Graph]
) -> Graph:
    """
    Concatenates a list of Graphs into a single Graph by merging their nodes and transitions.
    The resultant Graph is equivalent to running each input Graph in sequence.
    Annotations are preserved, but node indices are renumbered.
    """
    ...
    raise NotImplementedError()