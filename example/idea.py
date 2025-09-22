from typing import List, Self, Union, Tuple
import pydantic


# %% Style 1:
class Node:
    cards: List # sensory stimuli
    sensors: List # end predicates on input streams

class Transition(pydantic.BaseModel):
    source: Union[Node, Tuple[Node, int]]
    target: Node

class Timeline(pydantic.BaseModel):
    nodes: List[Node]
    transitions: List[Transition] | None = None # If None, just a linear sequence


# %%
fixation_node = Node()
image_choice_node = Node()
positive_node = Node()
negative_node = Node()

transitions = [
    Transition(
        source=fixation_node,
        target=image_choice_node,
    ),
    Transition(
        source=(image_choice_node, 0),
        target=positive_node,
    ),
    Transition(
        source=(image_choice_node, 1),
        target=negative_node,
    ),
]

t = Timeline(
    nodes = [
        fixation_node,
        image_choice_node,
        positive_node,
        negative_node
    ]
)

# %% Style 2:

class Node2(pydantic.BaseModel):
    cards: List
    sensors: List
    outcomes: List['Node2']


class Timeline2(pydantic.BaseModel):
    nodes: List[Node2]


t = Timeline()
xx = t.nodes[0]
