from typing import Self, Dict, Literal

import pydantic

from nodekit import VERSION
from nodekit._internal.types.cards import Card
from nodekit._internal.types.value import ColorHexString, NodeId, RegisterId
from nodekit._internal.types.events.events import Event
from nodekit._internal.types.sensors.sensors import Sensor
from nodekit._internal.types.expressions.expressions import Value, Expression


# %%
class Node(pydantic.BaseModel):
    stimulus: Card
    sensor: Sensor

    board_color: ColorHexString = pydantic.Field(
        description='The color of the Board during this Node (the "background color").',
        default="#808080ff",
        validate_default=True,
    )
    hide_pointer: bool = False


# %%
class Transition(pydantic.BaseModel):
    when: Expression
    to: NodeId
    register_updates: Dict[RegisterId, Expression]


# %%
class Graph(pydantic.BaseModel):
    nodekit_version: Literal["0.1.0"] = pydantic.Field(
        default=VERSION, validate_default=True
    )
    nodes: Dict[NodeId, Node]
    transitions: Dict[NodeId, list[Transition]] = pydantic.Field(
        description="A mapping from (NodeId, SensorId) to the next Node that will be transitioned if the Sensor is triggered in that Node."
    )
    start: NodeId
    registers: Dict[RegisterId, Value]

    @pydantic.model_validator(mode="after")
    def check_graph_is_valid(
        self,
    ) -> Self:
        if self.start not in self.nodes:
            raise ValueError(f"Graph start node {self.start} not in nodes.")

        num_nodes = len(self.nodes)
        if num_nodes == 0:
            raise ValueError("Graph must have at least one node.")

        # Check the start Node exists:
        if self.start not in self.nodes:
            raise ValueError(f"Start Node {self.start} does not exist in nodes.")

        # Todo: Each Node except the start Node must be reachable from the start Node (i.e., no disconnected components)

        # Todo: topologically sort nodes (make a new dict with topo-sorted insertion order)

        # Todo: check all Nodes have a path to a leaf Sensor

        return self


# %%
class Trace(pydantic.BaseModel):
    nodekit_version: Literal["0.1.0"] = pydantic.Field(
        default=VERSION, validate_default=True
    )
    events: list[Event]

    @pydantic.field_validator("events")
    def order_events(cls, events: list[Event]) -> list[Event]:
        return sorted(events, key=lambda e: e.t)
