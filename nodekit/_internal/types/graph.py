from typing import Dict, Literal, Self, Union

import pydantic

from nodekit import VERSION, Node
from nodekit._internal.types.transition import Transition, Go, IfThenElse, Switch, End
from nodekit._internal.types.values import NodeId, RegisterId, Value
from nodekit._internal.types import expressions as expressions


# %%
class Graph(pydantic.BaseModel):
    type: Literal["Graph"] = "Graph"
    nodekit_version: Literal["0.2.1"] = pydantic.Field(
        default=VERSION, validate_default=True
    )

    nodes: Dict[NodeId, Union[Node, "Graph"]] = pydantic.Field(
        description="The set of Nodes in the Graph, by NodeId. Note that a Graph can contain other Graphs as Nodes.",
    )

    transitions: Dict[NodeId, Transition] = pydantic.Field(
        description="The set of Transitions in the Graph, by NodeId.",
    )

    start: NodeId = pydantic.Field(description="The start Node of the Graph.")

    registers: Dict[RegisterId, Value] = pydantic.Field(
        default_factory=dict,
        description="The initial values register values. ",
    )

    @pydantic.model_validator(mode="after")
    def check_graph_is_valid(
        self,
    ) -> Self:
        # Check the Graph has at least one Node:
        num_nodes = len(self.nodes)
        if num_nodes == 0:
            raise ValueError("Graph must have at least one node.")

        # Check specified start Node exists:
        if self.start not in self.nodes:
            raise ValueError(f"Start Node {self.start} does not exist in nodes.")

        # Check each Node has a Transition:
        for node_id in self.nodes:
            if node_id not in self.transitions:
                raise ValueError(f"Node {node_id} has no corresponding Transition.")

        # Check Transitions:
        for node_id, transition in self.transitions.items():
            # Check Transition corresponds to an existing Node:
            if node_id not in self.nodes:
                raise ValueError(
                    f"Transition found for Node {node_id} but Node does not exist."
                )

            # Check each Go transition points to an existing Node:
            for go_target_node_id in _gather_go_targets(transition):
                if go_target_node_id not in self.nodes:
                    raise ValueError(
                        f"Go Transition from Node {node_id} points to non-existent Node {go_target_node_id}."
                    )

            # Check that the Transition only reference existing registers:
            reg_refs = set()
            if isinstance(transition, Go) or isinstance(transition, End):
                for register_id, expr in transition.register_updates.items():
                    reg_refs |= _get_reg_references(expr)
                    reg_refs.add(register_id)
            elif isinstance(transition, IfThenElse):
                reg_refs |= _get_reg_references(transition.if_)
                for register_id, expr in transition.then.register_updates.items():
                    reg_refs |= _get_reg_references(expr)
                    reg_refs.add(register_id)
                for register_id, expr in transition.else_.register_updates.items():
                    reg_refs |= _get_reg_references(expr)
                    reg_refs.add(register_id)
            elif isinstance(transition, Switch):
                reg_refs |= _get_reg_references(transition.on)
                for case_transition in transition.cases.values():
                    for register_id, expr in case_transition.register_updates.items():
                        reg_refs |= _get_reg_references(expr)
                        reg_refs.add(register_id)
                for register_id, expr in transition.default.register_updates.items():
                    reg_refs |= _get_reg_references(expr)
                    reg_refs.add(register_id)
            else:
                raise TypeError(
                    f"Unhandled Transition type during register reference check: {type(transition)}"
                )

            undefined_regs = reg_refs - set(self.registers.keys())
            if len(undefined_regs) > 0:
                raise ValueError(
                    f"Transition for Node {node_id} references undefined registers: {', '.join(undefined_regs)}"
                )

        # Check each Node is reachable from the start Node (no orphan Nodes)
        reachable_nodes = _get_reachable_node_ids(
            start=self.start,
            transitions=self.transitions,
        )
        orphan_nodes = set(self.nodes.keys()) - reachable_nodes
        if len(orphan_nodes) > 0:
            raise ValueError(
                f"Found Nodes that are not reachable from the start Node {self.start}: {'\n'.join(list(orphan_nodes))}"
            )

        # Check each Node has a path to an End transition (no loops without a possibility of exit)
        node_ids_with_path_to_end = _get_node_ids_with_path_to_end(
            transitions=self.transitions,
        )

        if len(node_ids_with_path_to_end) < len(self.nodes):
            nodes_without_path_to_end = (
                set(self.nodes.keys()) - node_ids_with_path_to_end
            )
            raise ValueError(
                f"Found Nodes that do not have a path to an End transition: {'\n'.join(list(nodes_without_path_to_end))}"
            )

        return self


# %%

def _get_reg_references(expression: expressions.Expression) -> set[RegisterId]:
    """
    Returns the set of RegisterIds referenced in this Expression.
    """
    if isinstance(expression, (expressions.Reg, expressions.ChildReg)):
        return {expression.id}

    if isinstance(expression, (expressions.Local, expressions.LastAction, expressions.Lit)):
        return set()

    if isinstance(expression, expressions.Not):
        return _get_reg_references(expression.operand)

    if isinstance(expression, (expressions.BaseCmp, expressions.BaseArithmeticOperation)):
        return _get_reg_references(expression.lhs) | _get_reg_references(expression.rhs)

    if isinstance(expression, expressions.If):
        return (
            _get_reg_references(expression.cond)
            | _get_reg_references(expression.then)
            | _get_reg_references(expression.otherwise)
        )

    if isinstance(expression, expressions.Or) or isinstance(expression, expressions.And):
        refs: set[RegisterId] = set()
        for arg in expression.args:
            refs |= _get_reg_references(arg)
        return refs

    if isinstance(expression, expressions.GetListItem):
        return _get_reg_references(expression.list) | _get_reg_references(expression.index)

    if isinstance(expression, expressions.GetDictValue):
        return _get_reg_references(expression.d) | _get_reg_references(expression.key)

    if isinstance(expression, expressions.Slice):
        refs = _get_reg_references(expression.array) | _get_reg_references(expression.start)
        if expression.end is not None:
            refs |= _get_reg_references(expression.end)
        return refs

    if isinstance(expression, expressions.Map):
        return _get_reg_references(expression.array) | _get_reg_references(expression.func)

    if isinstance(expression, expressions.Filter):
        return _get_reg_references(expression.array) | _get_reg_references(expression.predicate)

    if isinstance(expression, expressions.Fold):
        return (
            _get_reg_references(expression.array)
            | _get_reg_references(expression.init)
            | _get_reg_references(expression.func)
        )

    raise TypeError(f"Unhandled expression type: {type(expression)}")

def _get_reachable_node_ids(
    start: NodeId,
    transitions: Dict[NodeId, Transition],
) -> set[NodeId]:
    """
    Returns the set of NodeIds reachable from the start NodeId, given these transitions.
    Args:
        start:
        transitions:

    Returns:

    """

    reachable_node_ids: set[NodeId] = set()
    nodes_to_visit: list[NodeId] = [start]

    while nodes_to_visit:
        current_node_id = nodes_to_visit.pop()
        if current_node_id not in reachable_node_ids:
            reachable_node_ids.add(current_node_id)

            if current_node_id not in transitions:
                raise ValueError(f"NodeId {current_node_id} not found in transitions.")

            current_transition = transitions[current_node_id]
            for target_node_id in _gather_go_targets(current_transition):
                if target_node_id not in reachable_node_ids:
                    nodes_to_visit.append(target_node_id)

    return reachable_node_ids


def _get_node_ids_with_path_to_end(
    transitions: dict[NodeId, Transition],
) -> set[NodeId]:
    """
    Returns the set of NodeIds that have a path to an End transition, given these transitions.
    Args:
        transitions:

    Returns:

    """

    def _contains_end(transition: Transition) -> bool:
        if isinstance(transition, End):
            return True
        if isinstance(transition, IfThenElse):
            return _contains_end(transition.then) or _contains_end(transition.else_)
        if isinstance(transition, Switch):
            return any(
                _contains_end(t) for t in transition.cases.values()
            ) or _contains_end(transition.default)
        return False

    # Build reverse edges (target -> set of sources).
    reverse_edges: dict[NodeId, set[NodeId]] = {}
    for node_id, transition in transitions.items():
        for tgt in _gather_go_targets(transition):
            reverse_edges.setdefault(tgt, set()).add(node_id)

    # Seed with nodes whose own transition subtree contains an End.
    can_reach_end: set[NodeId] = set()
    stack: list[NodeId] = []
    for node_id, transition in transitions.items():
        if _contains_end(transition):
            can_reach_end.add(node_id)
            stack.append(node_id)

    # Propagate backward along reverse edges.
    while stack:
        target = stack.pop()
        for src in reverse_edges.get(target, ()):
            if src not in can_reach_end:
                can_reach_end.add(src)
                stack.append(src)

    return can_reach_end


def _gather_go_targets(transition: Transition) -> list[NodeId]:
    """
    Recursively gather all NodeIds this Transition points to.
    Args:
        transition:

    Returns:

    """
    if isinstance(transition, Go):
        return [transition.to]
    if isinstance(transition, IfThenElse):
        return _gather_go_targets(transition.then) + _gather_go_targets(
            transition.else_
        )
    if isinstance(transition, Switch):
        targets: list[NodeId] = []
        for case_transition in transition.cases.values():
            targets += _gather_go_targets(case_transition)
        targets += _gather_go_targets(transition.default)
        return targets
    return []
