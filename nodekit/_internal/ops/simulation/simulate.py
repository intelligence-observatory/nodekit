import warnings

from nodekit._internal.types.graph import Graph
from nodekit._internal.types.trace import Trace
from typing import Protocol, Self

from nodekit._internal.types.node import Node
from nodekit._internal.types.actions import Action

# %%

class AgentOutput:
    """
    A key or pointer event
    """
    ...

class BoardGraphic:
    """
    Represents the rasterized graphic of a board at a given time
    """
    ...

class BoardState:
    """
    Represents the state of a board at any given time
    """
    ...


class Agent(Protocol):

    def __call__(
            self,
            board_state: BoardState,
            dt_msec: int,
    ) -> list[AgentOutput]:
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
    warnings.warn(message='Not implemented.')
    return Trace(
        events=[],
    )

def _simulate_core() -> Trace:
    ...