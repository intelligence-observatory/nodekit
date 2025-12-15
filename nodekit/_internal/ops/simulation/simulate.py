import warnings

from nodekit._internal.types.graph import Graph
from nodekit._internal.types.trace import Trace
from typing import Protocol, Self

from nodekit._internal.types.node import Node
from nodekit._internal.types.actions import Action

# %%
class Agent(Protocol):

    def __call__(
            self,
            node: Node,
    ) -> tuple[Self, Action | None]:
        """

        Args:
            node: the current Node to make a decision in.

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