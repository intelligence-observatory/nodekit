from __future__ import annotations

import pydantic
from typing import Annotated, Dict, Literal, Optional

# =====================
# Value
# =====================

# Base
type BaseValue = str | int | float | bool

# Struct
type StructKey = str
type Struct = Dict[StructKey, "Value"]

# Array
type ArrayIndex = int
type Array = list["Value"]

# Full Value
type Value = BaseValue | Array | Struct


# =====================
# Expression base
# =====================

type VariableName = str


class BaseExpression(pydantic.BaseModel):
    op: str

    model_config = pydantic.ConfigDict(extra="forbid")


# =====================
# Root expressions
# =====================

class Var(BaseExpression):
    op: Literal["var"] = "var"
    name: VariableName
    scope: Literal["l", "g"] = pydantic.Field(
        default="g",
        description="Whether to read from locals (l) or the global variable file (g).",
    )


class ActionField(BaseExpression):
    """
    Access a field in the last completed Node's Action.
    """
    op: Literal["af"] = "af"
    key: StructKey


class Get(BaseExpression):
    """
    Get an element from a container (Array or Struct).
    `container` must evaluate to an array- or struct-valued result.
    """
    op: Literal["get"] = "get"
    container: "Expression"
    # ArrayIndex or StructKey
    key: StructKey | ArrayIndex


class Lit(BaseExpression):
    """
    Literal value.
    """
    op: Literal["lit"] = "lit"
    value: Value


# =====================
# Conditional
# =====================

class If(BaseExpression):
    op: Literal["if"] = "if"
    cond: "Expression"
    then: "Expression"
    otherwise: "Expression"


# =====================
# Boolean logic
# =====================

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


# =====================
# Binary comparators
# =====================

class BaseCmp(BaseExpression):
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


# =====================
# Arithmetic
# =====================

class BaseArithmeticOperation(BaseExpression):
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


# =====================
# Array operations
# =====================

class ArrayOp(BaseExpression):
    # Expression must be array-valued at runtime
    array: "Expression"


class Slice(ArrayOp):
    op: Literal["slice"] = "slice"
    start: "Expression"
    end: Optional["Expression"] = None


class Map(ArrayOp):
    op: Literal["map"] = "map"
    # The variable name of the current array element.
    cur: VariableName
    # Expression that will be applied to each element of the array.
    func: "Expression"


class Filter(ArrayOp):
    op: Literal["filter"] = "filter"
    # The variable name of the current array element.
    cur: VariableName
    # Expression that will be applied to each element of the array
    # and interpreted as a predicate.
    predicate: "Expression"


class Fold(ArrayOp):
    op: Literal["fold"] = "fold"
    init: "Expression"
    # The ID of the current cumulant.
    acc: VariableName
    # The variable name of the current array element.
    cur: VariableName
    func: "Expression"


# =====================
# Discriminated union
# =====================

Expression = Annotated[
    Var
    | ActionField
    | Get
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
        Var,
        ActionField,
        Get,
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