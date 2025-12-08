from typing import Dict, Literal

import pydantic

from nodekit._internal.types.expressions.expressions import Expression
from nodekit._internal.types.value import NodeId, RegisterId


# %%
class BaseTransition(pydantic.BaseModel):
    transition_type: str


class Go(BaseTransition):
    transition_type: Literal["Go"] = "Go"
    to: NodeId
    register_updates: Dict[RegisterId, Expression] = pydantic.Field(
        default_factory=dict,
    )


class End(BaseTransition):
    transition_type: Literal["End"] = "End"


type LeafTransition = Go | End

# %%
from typing import Annotated
class IfThenElse(BaseTransition):
    model_config = pydantic.ConfigDict(
        serialize_by_alias=True,
        validate_by_alias=False,
        populate_by_name=True,
    ) # See https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.validate_by_name

    transition_type: Literal["IfThenElse"] = "IfThenElse"

    # Using Annotated to maintain type hints (https://docs.pydantic.dev/latest/concepts/fields/?query=populate_by_name#field-aliases)
    if_: Annotated[
        Expression,
        pydantic.Field(
            serialization_alias='if',
            validation_alias='if',
            description="A boolean-valued Expression."
        )
    ]
    then: LeafTransition
    else_: Annotated[
        LeafTransition,
        pydantic.Field(
            default_factory=End,
            validate_default=True,
            alias='else'
        )
    ]

# %%
class Case(pydantic.BaseModel):
    when: Expression
    then: LeafTransition


class Branch(BaseTransition):
    transition_type: Literal["Branch"] = "Branch"
    cases: list[Case]
    otherwise: LeafTransition = pydantic.Field(
        default_factory=End,
        description="The transition to take if no case matches.",
        validate_default=True,
    )


# %%
type Transition = Go | End | Branch | IfThenElse
