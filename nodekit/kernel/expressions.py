import enum
from abc import ABC
from typing import Dict, Union, Annotated, Literal

import pydantic

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
    svf = 'svf' # A field in a SensorValue from the last Node Outcome
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

# %%
class BaseExpression(pydantic.BaseModel):
    op: OpEnum
    model_config = pydantic.ConfigDict(extra='forbid')


# %%
class Var(BaseExpression):
    op: Literal[OpEnum.var] = OpEnum.var
    name: 'VariableName'
    scope: Literal['l', 'g'] = 'g'  # Whether to read from the local (l) or global (g) variable file

class SensorValueField(BaseExpression):
    """
    Accesses a field of a SensorValue in the _last_ Outcome.
    """
    op: Literal[OpEnum.svf] = OpEnum.svf
    sensor_id: str
    field: StructKey

class Get(BaseExpression):
    """
    Get an element from a container (Array or Struct).
    """
    op: Literal[OpEnum.get] = OpEnum.get
    container: 'Expression'  # Array- or Struct-valued
    key: StructKey | ArrayIndex  # ArrayIndex or StructKey


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


# %% Array operations - Future
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
            SensorValueField,
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
type SensorId = str
type SensorValue = Struct


def _is_number(x: Value) -> bool:
    # Avoid treating bool as a number, even though bool is a subclass of int
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def evl(
        expression: Expression,
        graph_registers: VariableFile,
        local_variables: VariableFile,
        last_sensor_values: Dict[SensorId, SensorValue],
) -> Value:
    op = expression.op

    # =====================
    # Root
    # =====================
    if op is OpEnum.var:
        name = expression.name
        scope = expression.scope  # 'l' or 'g'

        if scope == "l":
            if name not in local_variables:
                raise KeyError(f"Local variable '{name}' not found")
            return local_variables[name]
        else:
            if name not in graph_registers:
                raise KeyError(f"Graph register '{name}' not found")
            return graph_registers[name]

    if op is OpEnum.svf:
        sensor_id = expression.sensor_id
        field = expression.field

        if sensor_id not in last_sensor_values:
            raise KeyError(f"Sensor '{sensor_id}' not found in last_sensor_values")

        sensor_struct = last_sensor_values[sensor_id]
        if field not in sensor_struct:
            raise KeyError(
                f"Field '{field}' not found on SensorValue for sensor '{sensor_id}'"
            )
        return sensor_struct[field]

    if op is OpEnum.get:
        container_val = evl(
            expression.container,
            graph_registers,
            local_variables,
            last_sensor_values,
        )
        key = expression.key

        if isinstance(container_val, list):
            if not isinstance(key, int):
                raise TypeError(
                    f"get: array index must be int, got '{type(key).__name__}'"
                )
            if key < 0 or key >= len(container_val):
                raise IndexError(f"get: array index '{key}' out of bounds")
            return container_val[key]

        if isinstance(container_val, dict):
            if not isinstance(key, str):
                raise TypeError(
                    f"get: struct key must be str, got '{type(key).__name__}'"
                )
            if key not in container_val:
                raise KeyError(f"get: struct key '{key}' not found")
            return container_val[key]

        raise TypeError(
            f"get: container must be list or dict, got '{type(container_val).__name__}'"
        )

    if op is OpEnum.lit:
        return expression.value

    # =====================
    # Conditional
    # =====================

    if op is OpEnum.if_:
        cond_val = evl(
            expression.cond,
            graph_registers,
            local_variables,
            last_sensor_values,
        )
        if not isinstance(cond_val, bool):
            raise TypeError(
                f"if: condition must be bool, got '{type(cond_val).__name__}'"
            )
        branch = expression.then if cond_val else expression.otherwise
        return evl(branch, graph_registers, local_variables, last_sensor_values)

    # =====================
    # Boolean logic
    # =====================

    if op is OpEnum.not_:
        v = evl(
            expression.operand,
            graph_registers,
            local_variables,
            last_sensor_values,
        )
        if not isinstance(v, bool):
            raise TypeError(
                f"not: operand must be bool, got '{type(v).__name__}'"
            )
        return not v

    if op is OpEnum.and_:
        for arg in expression.args:
            v = evl(arg, graph_registers, local_variables, last_sensor_values)
            if not isinstance(v, bool):
                raise TypeError(
                    f"and: all args must be bool, got '{type(v).__name__}'"
                )
            if not v:
                return False
        return True

    if op is OpEnum.or_:
        for arg in expression.args:
            v = evl(arg, graph_registers, local_variables, last_sensor_values)
            if not isinstance(v, bool):
                raise TypeError(
                    f"or: all args must be bool, got '{type(v).__name__}'"
                )
            if v:
                return True
        return False

    # =====================
    # Comparators
    # =====================

    if op in {OpEnum.eq, OpEnum.ne, OpEnum.gt, OpEnum.ge, OpEnum.lt, OpEnum.le}:
        lhs = evl(expression.lhs, graph_registers, local_variables, last_sensor_values)
        rhs = evl(expression.rhs, graph_registers, local_variables, last_sensor_values)

        if op is OpEnum.eq:
            return lhs == rhs

        if op is OpEnum.ne:
            return lhs != rhs

        # For ordering comparisons, restrict to numbers or strings, same type
        if type(lhs) is not type(rhs):
            raise TypeError(
                f"{op.value}: lhs and rhs must have same type, got "
                f"'{type(lhs).__name__}' and '{type(rhs).__name__}'"
            )

        if not (_is_number(lhs) or isinstance(lhs, str)):
            raise TypeError(
                f"{op.value}: only number or string comparison supported, "
                f"got '{type(lhs).__name__}'"
            )

        if op is OpEnum.gt:
            return lhs > rhs  # type: ignore[operator]
        if op is OpEnum.ge:
            return lhs >= rhs  # type: ignore[operator]
        if op is OpEnum.lt:
            return lhs < rhs  # type: ignore[operator]
        if op is OpEnum.le:
            return lhs <= rhs  # type: ignore[operator]

    # =====================
    # Arithmetic
    # =====================

    if op in {OpEnum.add, OpEnum.sub, OpEnum.mul, OpEnum.div}:
        lhs = evl(expression.lhs, graph_registers, local_variables, last_sensor_values)
        rhs = evl(expression.rhs, graph_registers, local_variables, last_sensor_values)

        if not (_is_number(lhs) and _is_number(rhs)):
            raise TypeError(
                f"{op.value}: operands must be numbers, got "
                f"'{type(lhs).__name__}' and '{type(rhs).__name__}'"
            )

        lhs_num = float(lhs)
        rhs_num = float(rhs)

        if op is OpEnum.add:
            return lhs_num + rhs_num
        if op is OpEnum.sub:
            return lhs_num - rhs_num
        if op is OpEnum.mul:
            return lhs_num * rhs_num
        if op is OpEnum.div:
            if rhs_num == 0:
                raise ZeroDivisionError("div: division by zero")
            return lhs_num / rhs_num

    # =====================
    # Array ops
    # =====================

    if op is OpEnum.slice:
        array_val = evl(
            expression.array,
            graph_registers,
            local_variables,
            last_sensor_values,
        )
        if not isinstance(array_val, list):
            raise TypeError(
                f"slice: array must be list, got '{type(array_val).__name__}'"
            )

        start_val = evl(
            expression.start,
            graph_registers,
            local_variables,
            last_sensor_values,
        )
        if not isinstance(start_val, int):
            raise TypeError(
                f"slice: start must be int, got '{type(start_val).__name__}'"
            )

        if expression.end is None:
            end_index = None
        else:
            end_val = evl(
                expression.end,
                graph_registers,
                local_variables,
                last_sensor_values,
            )
            if not isinstance(end_val, int):
                raise TypeError(
                    f"slice: end must be int, got '{type(end_val).__name__}'"
                )
            end_index = end_val

        return array_val[start_val:end_index]

    if op is OpEnum.map:
        array_val = evl(
            expression.array,
            graph_registers,
            local_variables,
            last_sensor_values,
        )
        if not isinstance(array_val, list):
            raise TypeError(
                f"map: array must be list, got '{type(array_val).__name__}'"
            )

        cur_name = expression.cur or "xcur"
        result: Array = []
        for elem in array_val:
            extended_locals = {
                **local_variables,
                cur_name: elem,
            }
            mapped = evl(
                expression.func,
                graph_registers,
                extended_locals,
                last_sensor_values,
            )
            result.append(mapped)
        return result

    if op is OpEnum.filter:
        array_val = evl(
            expression.array,
            graph_registers,
            local_variables,
            last_sensor_values,
        )
        if not isinstance(array_val, list):
            raise TypeError(
                f"filter: array must be list, got '{type(array_val).__name__}'"
            )

        cur_name = expression.cur or "xcur"
        result: Array = []
        for elem in array_val:
            extended_locals = {
                **local_variables,
                cur_name: elem,
            }
            keep = evl(
                expression.predicate,
                graph_registers,
                extended_locals,
                last_sensor_values,
            )
            if not isinstance(keep, bool):
                raise TypeError(
                    f"filter: predicate must be bool, got '{type(keep).__name__}'"
                )
            if keep:
                result.append(elem)
        return result

    if op is OpEnum.fold:
        array_val = evl(
            expression.array,
            graph_registers,
            local_variables,
            last_sensor_values,
        )
        if not isinstance(array_val, list):
            raise TypeError(
                f"fold: array must be list, got '{type(array_val).__name__}'"
            )

        acc = evl(
            expression.init,
            graph_registers,
            local_variables,
            last_sensor_values,
        )
        acc_name = expression.acc or "xagg"
        cur_name = expression.cur or "xcur"

        for elem in array_val:
            extended_locals = {
                **local_variables,
                acc_name: acc,
                cur_name: elem,
            }
            acc = evl(
                expression.func,
                graph_registers,
                extended_locals,
                last_sensor_values,
            )
        return acc

    # =====================
    # Exhaustiveness guard
    # =====================

    raise ValueError(f"Unsupported expression op: {op!r}")
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
        return evl(correct, graph_registers=gvs)


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

