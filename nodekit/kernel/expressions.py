import pydantic

import enum
from abc import ABC
from typing import Dict, Union, Annotated, Literal

import pydantic
import functools

# %%
type BaseValue = str | float | int | bool
type StructKey = str
type Struct = Dict[StructKey, Struct | Value]

type ArrayIndex = int
type Array = list['Value']
type Value = BaseValue | Array | Struct
type VariableName = str


# %% Root
class OpEnum(enum.Enum):
    var = 'var'
    get = 'get'
    lit = 'lit'

    if_ = 'if'
    not_ = 'not'
    and_ = 'and'
    or_ = 'or'

    eq = 'eq'
    ne = 'ne'
    gt = 'gt'
    ge = 'ge'
    lt = 'lt'
    le = 'le'

    add = 'add'
    sub = 'sub'
    mul = 'mul'
    div = 'div'

    slice = 'slice'
    map = 'map'
    filter = 'filter'
    fold = 'fold'


class BaseExpression(pydantic.BaseModel):
    op: OpEnum
    model_config = pydantic.ConfigDict(extra='forbid')


# %%
class Var(BaseExpression):
    op: Literal[OpEnum.var] = OpEnum.var
    name: 'VariableName'
    scope: Literal['l', 'g'] = 'g'  # Whether to read from the local (l) or global (g) variable file


class Get(BaseExpression):
    """
    Get an element from a container (Array or Struct).
    """
    op: Literal[OpEnum.get] = OpEnum.get
    container: 'Expression'  # Array- or Struct-valued
    key: 'Expression'  # ArrayIndex or StructKey


class Lit(BaseExpression):
    """
    Literal value.
    """
    op: Literal[OpEnum.lit] = OpEnum.lit
    value: 'Value'


# %%
class If(BaseExpression):
    op: Literal[OpEnum.if_] = OpEnum.if_
    cond: 'Expression'
    then: 'Expression'
    otherwise: 'Expression'


# %% Boolean logic
class Not(BaseExpression):
    op: Literal[OpEnum.not_] = OpEnum.not_
    operand: 'Expression'


class Or(BaseExpression):
    op: Literal[OpEnum.or_] = OpEnum.or_
    args: list['Expression']  # variadic


class And(BaseExpression):
    op: Literal[OpEnum.and_] = OpEnum.and_
    args: list['Expression']  # variadic


# %% Binary comparators
class BaseCmp(BaseExpression, ABC):
    lhs: 'Expression'
    rhs: 'Expression'


class Eq(BaseCmp):
    op: Literal[OpEnum.eq] = OpEnum.eq


class Ne(BaseCmp):
    op: Literal[OpEnum.ne] = OpEnum.ne


class Gt(BaseCmp):
    op: Literal[OpEnum.gt] = OpEnum.gt


class Ge(BaseCmp):
    op: Literal[OpEnum.ge] = OpEnum.ge


class Lt(BaseCmp):
    op: Literal[OpEnum.lt] = OpEnum.lt


class Le(BaseCmp):
    op: Literal[OpEnum.le] = OpEnum.le


# %% Arithmetic
class BaseArithmeticOperation(BaseExpression, ABC):
    lhs: 'Expression'
    rhs: 'Expression'


class Add(BaseArithmeticOperation):
    op: Literal[OpEnum.add] = OpEnum.add


class Mul(BaseArithmeticOperation):
    op: Literal[OpEnum.mul] = OpEnum.mul


class Sub(BaseArithmeticOperation):
    op: Literal[OpEnum.sub] = OpEnum.sub


class Div(BaseArithmeticOperation):
    op: Literal[OpEnum.div] = OpEnum.div


# %% Array operations - Futur
class ArrayOp(BaseExpression, ABC):
    array: 'Expression'  # Expression must be array-valued


class Slice(ArrayOp):
    op: Literal[OpEnum.slice] = OpEnum.slice
    start: 'Expression'
    end: Union['Expression', None]


class Map(ArrayOp):
    op: Literal[OpEnum.map] = OpEnum.map
    cur: 'VariableName' = pydantic.Field(default='xcur')  # The variable name of the current array element
    func: 'Expression'  # Expression that will be applied to each element of the array


class Filter(ArrayOp):
    op: Literal[OpEnum.filter] = OpEnum.filter
    cur: 'VariableName' = pydantic.Field(default='xcur')  # The variable name of the current array element
    predicate: 'Expression'  # Expression that will be applied to each element of the array


class Fold(ArrayOp):
    op: Literal[OpEnum.fold] = OpEnum.fold
    init: 'Expression'
    acc: 'VariableName' = pydantic.Field(
        default='xagg',
        validate_default=True,
        description='The ID of the current cumulant'
    )
    cur: 'VariableName' = pydantic.Field(
        default='xcur',
        validate_default=True,
    )
    func: 'Expression'


# %%
type Expression = Annotated[
    Union[
        # Root
        Var,
        Get,
        Lit,
            # Logic
        If,
            # Boolean
        Not,
        Or,
        And,
            # Comparators
        Eq,
        Ge,
        Gt,
        Le,
        Lt,
            # Arithmetic
        Add,
        Sub,
        Mul,
        Div,
            # Array ops:
        Slice,
        Map,
        Filter,
        Fold,
    ],
    pydantic.Field(discriminator='op')
]

type VariableFile = Dict[VariableName, Value]


# %%
def evl(
        expression: Expression,
        gvs: VariableFile,
        lvs: VariableFile = None,
) -> Value:
    if lvs is None:
        lvs = {}

    match expression.op:
        case OpEnum.var:
            expression: Var
            if expression.name in lvs:
                return lvs[expression.name]
            return gvs[expression.name]
        case OpEnum.get:
            expression: Get
            container_value = evl(
                expression=expression.container,
                gvs=gvs,
                lvs=lvs,
            )
            key = evl(
                expression=expression.key,
                gvs=gvs,
                lvs=lvs,
            )
            return container_value[key]
        case OpEnum.lit:
            expression: Lit
            return expression.value
        case OpEnum.if_:
            expression: If
            predicate = evl(
                expression=expression.cond,
                gvs=gvs,
                lvs=lvs,
            )
            return evl(
                expression=expression.then if predicate else expression.otherwise,
                gvs=gvs,
                lvs=lvs,
            )
        case OpEnum.eq:
            expression: Eq
            is_equal: Value = evl(expression.lhs) == evl(expression.rhs)
            return is_equal
        case 'Not':
            expression: Not
            arg_value = evl(expression.arg, gvs)
            notted = not arg_value
            return notted
        case 'Or':
            expression: Or
            for a in expression.args:
                if evl(a, gvs=gvs):
                    return True
            return False
        case 'And':
            expression: And
            for a in expression.args:
                if not evl(a, gvs=gvs):
                    return False
            return True
        case OpEnum.ge:
            expression: Ge
            lhs = evl(expression.lhs, gvs)
            rhs = evl(expression.rhs, gvs)
            return lhs >= rhs
        case OpEnum.add:
            expression: Add
            lhs = evl(expression.lhs, gvs)
            rhs = evl(expression.rhs, gvs)
            return lhs + rhs
        case OpEnum.map:
            expression: Map
            array = evl(expression.array, gvs=gvs)

            # Map
            mapped_vals = []
            for xi in array:
                val_cur = evl(
                    expression=expression.func,
                    gvs=gvs,
                    lvs={
                        expression.cur: xi  # Bind the current item; throw away current locals
                    }
                )
                mapped_vals.append(val_cur)
            return mapped_vals

    raise NotImplementedError(f'Unknown expression type: {expression}')


# %%
if __name__ == '__main__':
    # %% Pseudocode example
    def native():
        hi = 3
        correct = (hi + 1) >= 2
        return correct


    def ast_handauthored():
        gvs = {'hi': 3}
        correct = Ge(
            lhs=Add(
                lhs=Var(name='hi'),
                rhs=Lit(value=1),
            ),
            rhs=Lit(value=3)
        )
        return evl(correct, gvs=gvs)


    print(native())
    print(ast_handauthored())


    # %% Pseudocode 2
    def native():
        x = [0, 3, 4, 5]
        return sum(x[-2:])


    def ast_handauthored():
        gvs = {
            'x': [0, 3, 4, 5]
        }

        result = Fold(
            array=Slice(
                array=Var(name='x'),
                start=Lit(value=-2),
                end=None
            ),
            func=Add(
                lhs=Var(name='xagg', scope='l'),
                rhs=Var(name='xcur', scope='l')
            ),
            init=Lit(value=0)
        )


    # %% Pseudocode 3
    accuracy_last_5 = Div(
        lhs=Fold(
            array=Slice(
                array=Var(name='my_data'),
                start=Lit(value=-5),
                end=None
            ),
            func=Add(
                lhs=Var(name='xagg', scope='l'),
                rhs=Var(name='xcur', scope='l')
            ),
            init=Lit(value=0)
        ),
        rhs=Lit(value=5)
    )
    from pathlib import Path
    Path('test.json').write_text(accuracy_last_5.model_dump_json(indent=2))

