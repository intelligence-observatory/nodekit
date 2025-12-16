from __future__ import annotations

import random

from nodekit._internal.ops.simulation.sample_action import sample_action
from nodekit._internal.ops.simulation.simulate import Agent
from nodekit._internal.types.actions import Action
from nodekit._internal.types.node import Node


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
