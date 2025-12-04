from typing import List, Union, Dict, Iterable

from nodekit._internal.types.expressions.expressions import Lit
from nodekit._internal.types.graph import Graph, Transition
from nodekit._internal.types.node import Node
from nodekit._internal.types.value import NodeId, RegisterId, Value



# %%
def concat(
    sequence: List[Union[Graph, Node]],
    ids: List[str] | None = None,
) -> Graph:
    """
    A convenience method for returning a Graph which executes the given List[Node | Graph]  in the given order.
    The items are automatically issued namespace ids '0', '1', ... in order, unless `ids` is given.
    """

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
    transitions: Dict[NodeId, list[Transition]] = {}
    registers: Dict[RegisterId, Value] = {}

    prev_terminal_node_ids: List[NodeId] = []

    for i_child, child in enumerate(sequence):
        if isinstance(child, Node):
            # Register the Node
            current_node_id = ids[i_child]
            nodes[current_node_id] = child

            # Get pointer to the entry port for this Node:
            start_node_id = current_node_id

            # Ensure transitions key exists for terminal detection
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
            for from_id, sensor_map in child.transitions.items():
                new_from_id = f"{current_node_namespace}/{from_id}"
                transitions.setdefault(new_from_id, [])
                for tr in sensor_map:
                    transitions[new_from_id].append(
                        Transition(
                            when=tr.when,
                            to=f"{current_node_namespace}/{tr.to}",
                            register_updates={
                                f"{current_node_namespace}/{reg_id}": expr
                                for reg_id, expr in tr.register_updates.items()
                            },
                        )
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
            terminal_node_ids = [nid for nid in namespaced_node_ids if len(transitions.get(nid, [])) == 0]
        else:
            raise ValueError(f"Invalid item in sequence: {child}")

        # Connect outgoing ports of previous Node | Graph to the start Node of this Node | Graph:
        if i_child > 0:
            for terminal_id in prev_terminal_node_ids:
                transitions.setdefault(terminal_id, [])
                transitions[terminal_id].append(
                    Transition(
                        when=Lit(value=True),
                        to=start_node_id,
                        register_updates={},
                    )
                )

        prev_terminal_node_ids = terminal_node_ids

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
        registers=registers,
    )


