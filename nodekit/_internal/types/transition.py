from typing import Dict

import pydantic

from nodekit._internal.types.expressions.expressions import Expression, Lit
from nodekit._internal.types.value import NodeId, RegisterId

# %%
class TransitionFunction(pydantic.BaseModel):
    ...

class Transition(pydantic.BaseModel):
    when: Expression = pydantic.Field(
        description='A Boolean-valued Expression. When it evaluates to True, this Transition is taken.',
        default=Lit(value=True),
        validate_default=True,
    )
    to: NodeId
    register_updates: Dict[RegisterId, Expression]
