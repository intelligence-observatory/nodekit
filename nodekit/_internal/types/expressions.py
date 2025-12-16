from abc import ABC
from typing import Annotated, Literal

import pydantic

from nodekit._internal.types.values import Value, RegisterId

# %% Expression
type LocalVariableName = str


class BaseExpression(pydantic.BaseModel, ABC):
    op: str


class Reg(BaseExpression):
    """
    Evaluates to the value of the current Graph's register.
    """

    op: Literal["reg"] = "reg"
    id: RegisterId


class ChildReg(BaseExpression):
    """
    Evaluates to the value of the last completed subGraph's ("child" Graph) register.
    """

    op: Literal["creg"] = "creg"
    id: RegisterId


class LastAction(BaseExpression):
    """
    Evaluates to the last completed Node's Action.action_value.
    """

    op: Literal["la"] = "la"


class GetDictValue(BaseExpression):
    """
    Get a value from a dictionary by key.
    `dict` must evaluate to a dict-valued result.
    """

    op: Literal["gdv"] = "gdv"
    d: "Expression" = pydantic.Field(description="Evaluates to a Dict.")
    key: "Expression"


class Lit(BaseExpression):
    """
    Literal value.
    """

    op: Literal["lit"] = "lit"
    value: Value


# %% Conditional
class If(BaseExpression):
    op: Literal["if"] = "if"
    cond: "Expression"
    then: "Expression"
    otherwise: "Expression"


# %% Boolean logic
class Not(BaseExpression):
    op: Literal["not"] = "not"
    operand: "Expression"


class Or(BaseExpression):
    op: Literal["or"] = "or"
    # variadic
    args: list["Expression"]


class And(BaseExpression):
    op: Literal["and"] = "and"
    # variadic
    args: list["Expression"]


# %% Binary comparators
class BaseCmp(BaseExpression, ABC):
    lhs: "Expression"
    rhs: "Expression"


class Eq(BaseCmp):
    op: Literal["eq"] = "eq"


class Ne(BaseCmp):
    op: Literal["ne"] = "ne"


class Gt(BaseCmp):
    op: Literal["gt"] = "gt"


class Ge(BaseCmp):
    op: Literal["ge"] = "ge"


class Lt(BaseCmp):
    op: Literal["lt"] = "lt"


class Le(BaseCmp):
    op: Literal["le"] = "le"


# %% Arithmetic
class BaseArithmeticOperation(BaseExpression, ABC):
    lhs: "Expression"
    rhs: "Expression"


class Add(BaseArithmeticOperation):
    op: Literal["add"] = "add"


class Sub(BaseArithmeticOperation):
    op: Literal["sub"] = "sub"


class Mul(BaseArithmeticOperation):
    op: Literal["mul"] = "mul"


class Div(BaseArithmeticOperation):
    op: Literal["div"] = "div"


# %%
type Expression = Annotated[
    Reg
    | ChildReg
    | LastAction
    | GetDictValue
    | Lit
    | If
    | Not
    | Or
    | And
    | Eq
    | Ne
    | Gt
    | Ge
    | Lt
    | Le
    | Add
    | Sub
    | Mul
    | Div
    ,
    pydantic.Field(discriminator="op"),
]

# Ensure forward refs are resolved (Pydantic v2)
for _model in (
    Reg,
    ChildReg,
    LastAction,
    GetDictValue,
    Lit,
    If,
    Not,
    Or,
    And,
    Eq,
    Ne,
    Gt,
    Ge,
    Lt,
    Le,
    Add,
    Sub,
    Mul,
    Div,
):
    _model.model_rebuild()
