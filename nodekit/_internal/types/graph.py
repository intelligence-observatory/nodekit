from typing import Dict, Literal, Self, Union

import pydantic

from nodekit import VERSION, Node
from nodekit._internal.types.transition import Transition, Go, IfThenElse, Switch
from nodekit._internal.types.values import NodeId, RegisterId, Value


# %%
class Graph(pydantic.BaseModel):
    type: Literal["Graph"] = "Graph"
    nodekit_version: Literal["0.2.1"] = pydantic.Field(
        default=VERSION, validate_default=True
    )
    nodes: Dict[NodeId, Union[Node, "Graph"]] = pydantic.Field(
        description="The collection of Nodes in the Graph, keyed by their NodeId. Note that a Graph can contain other Graphs as Nodes.",
    )
    transitions: Dict[NodeId, Transition]
    start: NodeId = pydantic.Field(
        description="The NodeId of the Node where execution of the Graph begins."
    )
    registers: Dict[RegisterId, Value] = pydantic.Field(
        default_factory=dict,
        description="The values the Graph registers are set to when the Graph starts execution. ",
    )

    @pydantic.model_validator(mode="after")
    def check_graph_is_valid(
        self,
    ) -> Self:

        if self.start not in self.nodes:
            raise ValueError(f"Start Node {self.start} does not exist in nodes.")

        num_nodes = len(self.nodes)
        if num_nodes == 0:
            raise ValueError("Graph must have at least one node.")

        # Check each Node has a corresponding Transition
        for node_id in self.nodes:
            if node_id not in self.transitions:
                raise ValueError(
                    f"Node {node_id} exists but has no corresponding Transition."
                )

        # Check each Transition corresponds to an existing Node
        for node_id in self.transitions:
            if node_id not in self.nodes:
                raise ValueError(
                    f"Transition for Node {node_id} but Node does not exist."
                )

        # Each Go transition must point to an existing Node
        def go_targets(transition: Transition) -> list[NodeId]:
            if isinstance(transition, Go):
                return [transition.to]
            if isinstance(transition, IfThenElse):
                return go_targets(transition.then) + go_targets(transition.else_)
            if isinstance(transition, Switch):
                targets: list[NodeId] = []
                for case_transition in transition.cases.values():
                    targets += go_targets(case_transition)
                targets += go_targets(transition.default)
                return targets
            return []

        for node_id, transition in self.transitions.items():
            for to_node_id in go_targets(transition):
                if to_node_id not in self.nodes:
                    raise ValueError(
                        f"Go transition from Node {node_id} points to non-existent Node {to_node_id}."
                    )

        # Todo: check each Nodes has a path to an End transition
        # Todo: Each Node must be reachable from the start Node (i.e., no disconnected components)

        return self

# %%
def _validate_transition(
        transition: Transition,
        graph_element: Node | Graph,
        registers: Dict[RegisterId, Value],
) -> None:
    """
    This function validates that the given transition is valid for the given graph child and and graph registers.
    For example, if the Transition references a RegisterId, it checks that the RegisterId exists in the registers dict.

    Args:
        transition: the Transition to validate.
        graph_element: a Node or a subGraph.
        registers: the enclosing Graph's registers.

    Returns:
        None

    """

    match transition.transition_type:
        case "Go" | "End":
            register_updates = transition.register_updates


    # Todo:

