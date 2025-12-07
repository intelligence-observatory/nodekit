from typing import Dict

from nodekit._internal.types.expressions.expressions import Expression
from nodekit._internal.types.graph import Graph
from nodekit._internal.types.node import Node
from nodekit._internal.types.transition import Branch, End, Go, Transition
from nodekit._internal.types.value import NodeId, RegisterId, Value

import collections

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
        raise ValueError(f"If ids are given, they must be unique. Duplicates:\n{'\n'.join(duplicates)}")

    # Identify new start NodeId:
    first = sequence[0]
    if isinstance(first, Node):
        start_node_id = ids[0]
    elif isinstance(first, Graph):
        start_node_id = f"{ids[0]}/{first.start}"
    else:
        raise ValueError(f"First item in sequence is not a Node or Graph: {first}")

    # Assemble:
    nodes: Dict[NodeId, Node] = {}
    transitions: Dict[NodeId, list[Transition]] = {}
    registers: Dict[RegisterId, Value] = {}

    for i_child, child in enumerate(sequence):
        if isinstance(child, Node):
            # If a Node, its NodeId is the namespace id:
            current_node_id = ids[i_child]
            nodes[current_node_id] = child
            transitions.setdefault(current_node_id, [])
            terminal_node_ids = [current_node_id]

        elif isinstance(child, Graph):
            # Register nodes with namespaced ids:
            current_node_namespace = ids[i_child]
            for node_id, node in child.nodes.items():
                # Add namespace prefix
                new_id = f"{current_node_namespace}/{node_id}"
                nodes[new_id] = node

            # Add transitions that describe the internal structure of this sub-graph:
            for from_id, transition_list in child.transitions.items():
                new_from_id = f"{current_node_namespace}/{from_id}"
                transitions.setdefault(new_from_id, [])
                for tr in transition_list:
                    transitions[new_from_id].append(
                        _namespace_transition(tr, current_node_namespace)
                    )

            # Get pointer to the entry port for this sub-graph:
            start_node_id = f"{current_node_namespace}/{child.start}"

            # Namespace registers
            for reg_id, value in child.registers.items():
                namespaced_reg_id = f"{current_node_namespace}/{reg_id}"
                registers[namespaced_reg_id] = value

            # Terminal nodes: any node without outgoing transitions (or empty list)
            namespaced_node_ids = [
                f"{current_node_namespace}/{node_id}" for node_id in child.nodes.keys()
            ]
            terminal_node_ids = [
                nid for nid in namespaced_node_ids if len(transitions.get(nid, [])) == 0
            ]
        else:
            raise ValueError(f"Invalid item in sequence: {child}")

        if i_child == 0:
            prev_terminal_node_ids = terminal_node_ids
            continue

        # Connect outgoing ports of previous Node | Graph to the start Node of this Node | Graph:
        for terminal_id in prev_terminal_node_ids:
            transitions.setdefault(terminal_id, [])
            transitions[terminal_id].append(
                Go(
                    to=start_node_id,
                    register_updates={},
                )
            )

        prev_terminal_node_ids = terminal_node_ids


    return Graph(
        nodes=nodes,
        transitions=transitions,
        start=start_node_id,
        registers=registers,
    )


# %% Helper functions:
def _node_to_graph(
        node: Node,
        node_id: NodeId,
) -> Graph:
    """
    Wrap a Node in a Graph.
    """
    return Graph(
        nodes={
            node_id: node,
        },
        transitions={
            node_id: End()
        },
        start=node_id,
        registers={},
    )

def _namespace_id(
        namespace: str,
        id: str
) -> str:
    return f"{namespace}/{id}"

def _namespace_graph(
        graph: Graph,
        namespace: str
) -> Graph:
    """
    Returns a Graph where all NodeId and RegisterId are prefixed with `namespace/`.
    The Transitions are also updated accordingly.
    """

    # Nodes:
    namespaced_nodes: Dict[NodeId, Node] = {}
    for node_id, node in graph.nodes.items():
        namespaced_nodes[_namespace_id(namespace, node_id)] = node

    # Transitions:
    namespaced_transitions: Dict[NodeId, Transition] = {}
    for node_id, transition in graph.transitions.items():
        namespaced_transitions[_namespace_id(namespace, node_id)] = _namespace_transition(
            transition=transition,
            namespace=namespace
        )

    # Start
    start_id = _namespace_id(namespace, graph.start)

    # Registers:
    namespaced_registers: Dict[RegisterId, Value] = {}
    for register_id, value in graph.registers.items():
        namespaced_registers[_namespace_id(namespace, register_id)] = value

    return Graph(
        nodes=namespaced_nodes,
        transitions=namespaced_transitions,
        start=start_id,
        registers=namespaced_registers,
    )


def _namespace_transition(transition: Transition, namespace: str) -> Transition:
    """
    Returns a Transition where any referenced RegisterId and NodeId are prefixed with `{namespace}/`.
    """
    if isinstance(transition, Go):
        return transition.model_copy(
            update={
                "to": _namespace_id(namespace, transition.to),
                "register_updates": {
                    _namespace_id(namespace, reg_id): _namespace_registers(expr, namespace)
                    for reg_id, expr in transition.register_updates.items()
                },
            }
        )
    if isinstance(transition, End):
        return transition
    if isinstance(transition, Branch):
        return transition.model_copy(
            update={
                "cases": [
                    Case(
                        when=_namespace_registers(case.when, namespace),
                        then=_namespace_transition(case.then, namespace),  # type: ignore[arg-type]
                    )
                    for case in transition.cases
                ],
                "otherwise": _namespace_transition(transition.otherwise, namespace),  # type: ignore[arg-type]
            }
        )
    raise TypeError(f"Unsupported transition type: {transition}")


def _namespace_expression(expression: Expression, namespace: str) -> Expression:
    ...
