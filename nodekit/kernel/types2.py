import enum
from typing import Literal, Union, Annotated, Dict, List

import pydantic

import nodekit.kernel.expressions as expr
from nodekit import VERSION
from nodekit._internal.types.value import NodeId, CardId, SensorId, ColorHexString
from nodekit.kernel.expressions import Value, Expression

# %%
type RegisterId = str


# %%
class Transition(pydantic.BaseModel):
    when: Expression = pydantic.Field(
        description='Should be boolean-valued.',
        examples=[
            expr.Eq( # outcome.sensor_values['choice']=='left'",
                lhs=expr.Get(container=expr.SensorValueField(), key='sensor_values.choice'),
                rhs=expr.Lit(value='left')
            ),
        ]
    )
    to: NodeId
    register_updates: Dict[RegisterId, Expression] = pydantic.Field(
        description='Enacted if this Transition is followed.',
        examples=[
            {
                'num_correct', expr.Add(lhs=expr.Var(name='num_correct', ), rhs=expr.Lit(value=1)),
            }
        ]
    )

# %%
class Graph(pydantic.BaseModel):
    start: NodeId
    nodes: Dict[NodeId, 'Node']
    transitions: Dict[NodeId, list[Transition]] = pydantic.Field(
        description="The list of edges emanating from each Node. If no Transition is triggered, the Graph ends."
    )

    registers: Dict[RegisterId, Value] = pydantic.Field(
        default_factory=dict,
        validate_default=True,
    )

    nodekit_version: Literal["0.1.0"] = pydantic.Field(default=VERSION)

# %%
class NodePredicateEnum(enum.Enum):
    fulfilled = 'fulfilled'
    all = "all"
    race =  "race"

class BaseNodePredicate(pydantic.BaseModel):
    predicate_type: NodePredicateEnum

class SensorFulfilledPredicate(BaseNodePredicate):
    predicate_type: Literal[NodePredicateEnum.fulfilled] = NodePredicateEnum.fulfilled
    sensor_id: SensorId

class AllPredicate(BaseNodePredicate):
    predicate_type: Literal[NodePredicateEnum.all] = NodePredicateEnum.all
    items: List['NodePredicate'] | Literal['*']

class RacePredicate(BaseNodePredicate):
    predicate_type: Literal[NodePredicateEnum.race] = NodePredicateEnum.race
    items: List['NodePredicate']

type NodePredicate = Annotated[
    Union[
        SensorFulfilledPredicate,
        AllPredicate,
        RacePredicate
    ],
    pydantic.Field(discriminator='type')
]

# %%
class CardAnimation(pydantic.BaseModel):
    ...

class Card(pydantic.BaseModel):
    ...
    animations: list[CardAnimation]


# %%
class Sensor(pydantic.BaseModel):
    ...


# %%
class Pointer(pydantic.BaseModel):
    ...

# %%
class Node(pydantic.BaseModel):

    cards: Dict[CardId, Card] = pydantic.Field(
        description="Set of Cards placed on the Board.",
    )

    sensors: Dict[SensorId, Sensor] = pydantic.Field(
        min_length=1,
        description="Set of Sensors that each denote an Action Set.",
    )

    exit: NodePredicate = pydantic.Field(
        description='The definition of the conditions that will end the Node. If None (default), the Node ends when all Sensors are fulfilled.',
        default=AllPredicate(items='*'),
        validate_default=True,
    )

    pointer: Pointer | None

    board_color: ColorHexString = pydantic.Field(
        description='The color of the Board during this Node (the "background color").',
        default="#808080ff",
        validate_default=True,
    )

# %%
type AgentEvent = any # todo; pointer and key
type CardEvent = any # todo: card state mutations
NodeEvent = Union[AgentEvent , CardEvent]
type SensorValue = any # todo

class Outcome(pydantic.BaseModel):
    node: Node
    events: list[NodeEvent]
    sensor_values: Dict[SensorId, SensorValue]

# %%
class Trace(pydantic.BaseModel):
    ...
