import random
from abc import ABC, abstractmethod

from nodekit import Node
from nodekit._internal.ops.simulate.sample_action import sample_action
from nodekit._internal.types.actions import Action


#%%
class Agent(ABC):
    @abstractmethod
    def __call__(self, node: Node) -> Action:
        """
        Return an Action given a Node.
        Args:
            node:

        Returns:
            Action: The selected Action.

        """
        ...


class DummyAgent(Agent):
    """
    An Agent that randomly selects the first available Action in a Node.
    """

    def __init__(self, seed: int | None = None):
        self.rng = random.Random(seed)

    def __call__(self, node: Node) -> Action:
        return sample_action(
            sensor=node.sensor,
            rng=self.rng,
        )
