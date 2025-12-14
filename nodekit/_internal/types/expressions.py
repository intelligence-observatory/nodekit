from abc import ABC
from typing import Annotated, Literal, Optional

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


class Local(BaseExpression):
    """
    Evaluates to the value of a local variable.
    Used to reference variables defined in Map, Filter, Fold expressions.
    To be distinguished from Graph registers (Reg).
    """
    op: Literal["local"] = "local"
    name: LocalVariableName


class LastAction(BaseExpression):
    """
    Evaluates to the last completed Node's Action.action_value.
    """

    op: Literal["la"] = "la"


class GetListItem(BaseExpression):
    """
    Get an element from a container (Array or Struct).
    `container` must evaluate to an array- or struct-valued result.
    """

    op: Literal["gli"] = "gli"
    list: "Expression"
    index: "Expression"


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


# %% Array operations
class ListOp(BaseExpression, ABC):
    # Expression must be array-valued at runtime
    array: "Expression"


class Slice(ListOp):
    op: Literal["slice"] = "slice"
    start: "Expression"
    end: Optional["Expression"] = None


class Map(ListOp):
    op: Literal["map"] = "map"
    # The variable name of the current array element.
    cur: LocalVariableName
    # Expression that will be applied to each element of the array.
    func: "Expression"


class Filter(ListOp):
    op: Literal["filter"] = "filter"
    # The variable name of the current array element.
    cur: LocalVariableName
    # Expression that will be applied to each element of the array
    # and interpreted as a predicate.
    predicate: "Expression"


class Fold(ListOp):
    op: Literal["fold"] = "fold"
    init: "Expression"
    # The ID of the current cumulant.
    acc: LocalVariableName
    # The variable name of the current array element.
    cur: LocalVariableName
    func: "Expression"


# %%
type Expression = Annotated[
    Reg
    | ChildReg
    | Local
    | LastAction
    | GetListItem
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
    | Slice
    | Map
    | Filter
    | Fold,
    pydantic.Field(discriminator="op"),
]

# Ensure forward refs are resolved (Pydantic v2)
for _model in (
    Reg,
    ChildReg,
    Local,
    LastAction,
    GetListItem,
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
    Slice,
    Map,
    Filter,
    Fold,
):
    _model.model_rebuild()
