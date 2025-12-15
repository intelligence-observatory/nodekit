import warnings

from nodekit._internal.types.graph import Graph
from nodekit._internal.types.node import Node
from nodekit._internal.types.trace import Trace
from nodekit._internal.types.actions import Action
import nodekit._internal.types.events as e


from typing import Protocol


# %%


class Agent(Protocol):
    def __call__(
        self,
        node: Node,
    ) -> Action | None:
        """
        Args:
            board_state: the current Node to make a decision in.
            dt_msec: the amount of time the agent should simulate.

        Returns: a tuple of (updated Agent, selected Action | None).
        If None, the Agent indicates it will not ever make an Action in this Node.
        """

        ...


def simulate(
    graph: Graph,
    agent: Agent,
) -> Trace:
    warnings.warn(message="Not implemented.")

    time_elapsed_msec = 0

    events = [e.TraceStartedEvent(t=time_elapsed_msec)]

    events.append(e.TraceEndedEvent(t=time_elapsed_msec))

    return Trace(
        events=[],
    )
