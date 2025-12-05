from typing import Dict, List, Union

from nodekit._internal.types.expressions.expressions import Expression
from nodekit._internal.types.graph import Graph
from nodekit._internal.types.transition import Branch, Case, End, Go, Transition
from nodekit._internal.types.node import Node
from nodekit._internal.types.value import NodeId, RegisterId, Value


# Namespace register references inside an expression tree.
def _namespace_registers(expr: Expression, namespace: str) -> Expression:
    op = expr.op

    if op == "reg":
        return expr.model_copy(update={"id": f"{namespace}/{expr.id}"})

    if op == "gli":
        return expr.model_copy(
            update={
                "list": _namespace_registers(expr.list, namespace),
                "index": _namespace_registers(expr.index, namespace),
            }
        )
    if op == "gdv":
        return expr.model_copy(
            update={
                "dict": _namespace_registers(expr.d, namespace),
                "key": _namespace_registers(expr.key, namespace),
            }
        )
    if op == "if":
        return expr.model_copy(
            update={
                "cond": _namespace_registers(expr.cond, namespace),
                "then": _namespace_registers(expr.then, namespace),
                "otherwise": _namespace_registers(expr.otherwise, namespace),
            }
        )
    if op == "not":
        return expr.model_copy(update={"operand": _namespace_registers(expr.operand, namespace)})
    if op in {"or", "and"}:
        return expr.model_copy(update={"args": [_namespace_registers(arg, namespace) for arg in expr.args]})
    if op in {"eq", "ne", "gt", "ge", "lt", "le", "add", "sub", "mul", "div"}:
        return expr.model_copy(
            update={
                "lhs": _namespace_registers(expr.lhs, namespace),
                "rhs": _namespace_registers(expr.rhs, namespace),
            }
        )
    if op == "slice":
        return expr.model_copy(
            update={
                "array": _namespace_registers(expr.array, namespace),
                "start": _namespace_registers(expr.start, namespace),
                "end": _namespace_registers(expr.end, namespace) if expr.end is not None else None,
            }
        )
    if op == "append":
        return expr.model_copy(
            update={
                "array": _namespace_registers(expr.array, namespace),
                "value": _namespace_registers(expr.value, namespace),
            }
        )
    if op == "concat":
        return expr.model_copy(
            update={
                "array": _namespace_registers(expr.array, namespace),
                "value": _namespace_registers(expr.value, namespace),
            }
        )
    if op == "map":
        return expr.model_copy(
            update={
                "array": _namespace_registers(expr.array, namespace),
                "func": _namespace_registers(expr.func, namespace),
            }
        )
    if op == "filter":
        return expr.model_copy(
            update={
                "array": _namespace_registers(expr.array, namespace),
                "predicate": _namespace_registers(expr.predicate, namespace),
            }
        )
    if op == "fold":
        return expr.model_copy(
            update={
                "array": _namespace_registers(expr.array, namespace),
                "init": _namespace_registers(expr.init, namespace),
                "func": _namespace_registers(expr.func, namespace),
            }
        )

    # lit, local, la etc. do not reference registers
    return expr


def _namespace_transition(tr: Transition, namespace: str) -> Transition:
    if isinstance(tr, Go):
        return tr.model_copy(
            update={
                "to": f"{namespace}/{tr.to}",
                "register_updates": {
                    f"{namespace}/{reg_id}": _namespace_registers(expr, namespace)
                    for reg_id, expr in tr.register_updates.items()
                },
            }
        )
    if isinstance(tr, End):
        return tr
    if isinstance(tr, Branch):
        return tr.model_copy(
            update={
                "cases": [
                    Case(
                        when=_namespace_registers(case.when, namespace),
                        then=_namespace_transition(case.then, namespace),  # type: ignore[arg-type]
                    )
                    for case in tr.cases
                ],
                "otherwise": _namespace_transition(tr.otherwise, namespace),  # type: ignore[arg-type]
            }
        )
    raise TypeError(f"Unsupported transition type: {tr}")


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
    start_node_id: NodeId | None = None

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
            terminal_node_ids = [nid for nid in namespaced_node_ids if len(transitions.get(nid, [])) == 0]
        else:
            raise ValueError(f"Invalid item in sequence: {child}")

        # Connect outgoing ports of previous Node | Graph to the start Node of this Node | Graph:
        if i_child > 0:
            for terminal_id in prev_terminal_node_ids:
                transitions.setdefault(terminal_id, [])
                transitions[terminal_id].append(
                    Go(
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
