from __future__ import annotations

from typing import Annotated, Literal, Union

import pydantic

from nodekit._internal.types.expressions import Expression
from nodekit._internal.types.values import NodeId, RegisterId


# %%
class BaseTransition(pydantic.BaseModel):
    transition_type: str


class Go(BaseTransition):
    transition_type: Literal["Go"] = "Go"
    to: NodeId
    register_updates: dict[RegisterId, Expression] = pydantic.Field(
        default_factory=dict,
    )


class End(BaseTransition):
    transition_type: Literal["End"] = "End"
    register_updates: dict[RegisterId, Expression] = pydantic.Field(
        default_factory=dict,
    )


type LeafTransition = Go | End


# %%
class IfThenElse(BaseTransition):
    model_config = pydantic.ConfigDict(
        serialize_by_alias=True,
        validate_by_alias=False,
        populate_by_name=True,
    )  # See https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.validate_by_name

    transition_type: Literal["IfThenElse"] = "IfThenElse"

    # Using Annotated to maintain type hints (https://docs.pydantic.dev/latest/concepts/fields/?query=populate_by_name#field-aliases)
    if_: Annotated[
        Expression,
        pydantic.Field(
            serialization_alias="if",
            validation_alias="if",
            description="A boolean-valued Expression.",
        ),
    ]
    then: Transition
    else_: Annotated[
        Transition,
        pydantic.Field(default_factory=End, validate_default=True, alias="else"),
    ]


# %%
type Transition = Annotated[
    Union[
        Go,
        End,
        IfThenElse,
    ],
    pydantic.Field(discriminator="transition_type"),
]

# Ensure forward refs are resolved (Pydantic v2)
IfThenElse.model_rebuild()
