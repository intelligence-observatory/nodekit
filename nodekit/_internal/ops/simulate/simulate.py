from __future__ import annotations

import random
import warnings
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Mapping

import nodekit._internal.types.events as e
from nodekit._internal.ops.simulate.evaluate_expression import (
    EvalContext,
    evaluate_expression,
)
from nodekit._internal.ops.simulate.sample_action import sample_action
from nodekit._internal.types.actions import Action
from nodekit._internal.types.graph import Graph
from nodekit._internal.types.node import Node
from nodekit._internal.types.trace import Trace
from nodekit._internal.types.transitions import (
    End,
    Go,
    IfThenElse,
    Switch,
    Transition,
)
from nodekit._internal.types.values import RegisterId, Value


# %%
class Agent(ABC):
    @abstractmethod
    def __call__(self, node: Node) -> Action | None:
        """
        Return an Action or None (to end the simulation), given the Node.
        Args:
            node:

        Returns:
            Action | None: The selected Action, or None to end the simulation.

        """
        ...


# %%
class DummyAgent(Agent):
    """
    An Agent that randomly selects the first available Action in a Node.
    """

    def __init__(self, seed: int | None = None):
        self.rng = random.Random(seed)

    def __call__(self, node: Node) -> Action | None:
        return sample_action(
            sensor=node.sensor,
            rng=random.Random(),
        )


# %%
def simulate(
    graph: Graph,
    agent: Agent | None = None,
) -> Trace:
    """
    Deterministically simulates a Graph using the provided Agent.
    Pointer and keyboard sample events are omitted; only Node start/action/end events
    are emitted for leaf Nodes.

    If no Agent is provided, a DummyAgent is used that randomly selects an
    available Action in each Node.

    Args:
        graph:
        agent:

    Returns:

    """

    if agent is None:
        agent = DummyAgent(seed=None)

    time_elapsed_msec = 0

    events: list[e.Event] = [e.TraceStartedEvent(t=time_elapsed_msec)]

    simulated_events, _, time_elapsed_msec = _simulate_core(
        graph=graph,
        agent=agent,
        address=[],
        time_elapsed_msec=time_elapsed_msec,
    )
    events.extend(simulated_events)

    events.append(e.TraceEndedEvent(t=time_elapsed_msec))

    return Trace(
        events=events,
    )


# %%
@dataclass(frozen=True)
class EvalTransitionResult:
    next_node_id: str | None
    register_updates: dict[RegisterId, Value]


def _simulate_core(
    graph: Graph,
    agent: Agent,
    address: list[str],
    time_elapsed_msec: int,
) -> tuple[list[e.Event], dict[RegisterId, Value], int]:
    """
    Deterministically simulates a Graph using the provided Agent.
    Pointer and keyboard sample events are omitted; only Node start/action/end events
    are emitted for leaf Nodes.
    """
    nodes = graph.nodes
    registers: dict[RegisterId, Value] = {**graph.registers}

    events: list[e.Event] = []

    current_node_id = graph.start
    last_action: Action | None = None
    last_subgraph_registers: Mapping[RegisterId, Value] | None = None

    def _tick() -> int:
        nonlocal time_elapsed_msec
        time_elapsed_msec += 1
        return time_elapsed_msec

    while True:
        node_or_graph = nodes[current_node_id]
        current_address = [*address, current_node_id]

        if isinstance(node_or_graph, Graph):
            child_events, child_registers, time_elapsed_msec = _simulate_core(
                graph=node_or_graph,
                agent=agent,
                address=current_address,
                time_elapsed_msec=time_elapsed_msec,
            )
            events.extend(child_events)
            last_subgraph_registers = child_registers
            last_action = None
        elif isinstance(node_or_graph, Node):
            events.append(
                e.NodeStartedEvent(
                    t=_tick(),
                    node_address=current_address,
                    node=node_or_graph,
                )
            )

            action = agent(node_or_graph)
            if action is None:
                warnings.warn(
                    f"Agent returned None for node at address {current_address}. Ending run."
                )
                raise RuntimeError()

            events.append(
                e.ActionTakenEvent(
                    t=_tick(),
                    node_address=current_address,
                    action=action,
                )
            )
            events.append(
                e.NodeEndedEvent(
                    t=_tick(),
                    node_address=current_address,
                )
            )
            last_action = action
            last_subgraph_registers = None
        else:
            raise TypeError(
                f"Unknown node type: {getattr(node_or_graph, 'type', type(node_or_graph))}"
            )

        if current_node_id not in graph.transitions:
            break

        transition = graph.transitions[current_node_id]
        transition_result = _eval_transition(
            transition=transition,
            registers=registers,
            last_action=last_action,
            last_subgraph_registers=last_subgraph_registers,
        )

        for register_id, value in transition_result.register_updates.items():
            registers[register_id] = value

        next_node_id = transition_result.next_node_id
        if next_node_id is None:
            break

        current_node_id = next_node_id
        last_action = None
        last_subgraph_registers = None

    return events, registers, time_elapsed_msec


def _eval_transition(
    transition: Transition,
    registers: dict[RegisterId, Value],
    last_action: Action | None,
    last_subgraph_registers: dict[RegisterId, Value] | None,
) -> EvalTransitionResult:
    match transition:
        case Go() | End():
            register_update_values: dict[RegisterId, Value] = {}
            for register_id, update_expression in transition.register_updates.items():
                register_update_values[register_id] = evaluate_expression(
                    update_expression,
                    EvalContext(
                        graph_registers=registers,
                        local_variables={},
                        last_action=last_action,
                        last_subgraph_registers=last_subgraph_registers,
                    ),
                )

            if isinstance(transition, Go):
                return EvalTransitionResult(
                    next_node_id=transition.to,
                    register_updates=register_update_values,
                )

            return EvalTransitionResult(
                next_node_id=None,
                register_updates=register_update_values,
            )

        case IfThenElse():
            cond = evaluate_expression(
                transition.if_,
                EvalContext(
                    graph_registers=registers,
                    local_variables={},
                    last_action=last_action,
                    last_subgraph_registers=last_subgraph_registers,
                ),
            )
            branch = transition.then if cond else transition.else_
            return _eval_transition(
                transition=branch,
                registers=registers,
                last_action=last_action,
                last_subgraph_registers=last_subgraph_registers,
            )

        case Switch():
            selector = evaluate_expression(
                transition.on,
                EvalContext(
                    graph_registers=registers,
                    local_variables={},
                    last_action=last_action,
                    last_subgraph_registers=last_subgraph_registers,
                ),
            )

            for case_value, case_transition in transition.cases.items():
                if selector == case_value:
                    return _eval_transition(
                        transition=case_transition,
                        registers=registers,
                        last_action=last_action,
                        last_subgraph_registers=last_subgraph_registers,
                    )

            return _eval_transition(
                transition=transition.default,
                registers=registers,
                last_action=last_action,
                last_subgraph_registers=last_subgraph_registers,
            )

        case _:
            raise TypeError(f"Unhandled transition: {transition}")
