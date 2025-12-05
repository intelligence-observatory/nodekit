from typing import Dict, Literal

import pydantic

from nodekit._internal.types.expressions.expressions import Expression, Lit
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
type Transition = Go | End | Branch
