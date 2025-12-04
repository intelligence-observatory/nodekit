from __future__ import annotations

from typing import Dict

from nodekit._internal.types.actions.actions import Action
from nodekit._internal.types.expressions.expressions import (
    Expression,
    LocalVariableName,
)
from nodekit._internal.types.value import List, RegisterId, Value
import pydantic


class EvalContext(pydantic.BaseModel):
    graph_registers: Dict[RegisterId, Value]
    local_variables: Dict[LocalVariableName, Value]
    last_action: Action


def _is_number(x: Value) -> bool:
    # Avoid treating bool as a number, even though bool is a subclass of int
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def evl(expression: Expression, context: EvalContext) -> Value:
    op = expression.op

    # =====================
    # Root
    # =====================
    if op == "reg":
        register_id = expression.id
        if register_id not in context.graph_registers:
            raise KeyError(f"Graph register '{register_id}' not found")
        return context.graph_registers[register_id]

    if op == "local":
        name = expression.name
        if name not in context.local_variables:
            raise KeyError(f"Local variable '{name}' not found")
        return context.local_variables[name]
    if op == "la":
        return context.last_action
    if op == "gli":
        list_val = evl(expression.list, context)
        if not isinstance(list_val, list):
            raise TypeError(f"gli: list must be list, got '{type(list_val).__name__}'")
        index_val = evl(expression.index, context)
        if not isinstance(index_val, int):
            raise TypeError(f"gli: index must be int, got '{type(index_val).__name__}'")
        if index_val < 0 or index_val >= len(list_val):
            raise IndexError(f"gli: index '{index_val}' out of bounds")
        return list_val[index_val]
    if op == "gdv":
        dict_val = evl(expression.dict, context)
        if not isinstance(dict_val, dict):
            raise TypeError(f"gdv: dict must be dict, got '{type(dict_val).__name__}'")
        key_val = evl(expression.key, context)
        if not isinstance(key_val, str):
            raise TypeError(f"gdv: key must be str, got '{type(key_val).__name__}'")
        if key_val not in dict_val:
            raise KeyError(f"gdv: key '{key_val}' not found")
        return dict_val[key_val]
    if op == "lit":
        return expression.value

    # =====================
    # Conditional
    # =====================
    if op == "if":
        cond_val = evl(expression.cond, context)
        if not isinstance(cond_val, bool):
            raise TypeError(
                f"if: condition must be bool, got '{type(cond_val).__name__}'"
            )
        branch = expression.then if cond_val else expression.otherwise
        return evl(branch, context)

    # =====================
    # Boolean logic
    # =====================
    if op == "not":
        v = evl(expression.operand, context)
        if not isinstance(v, bool):
            raise TypeError(f"not: operand must be bool, got '{type(v).__name__}'")
        return not v

    if op == "and":
        for arg in expression.args:
            v = evl(arg, context)
            if not isinstance(v, bool):
                raise TypeError(f"and: all args must be bool, got '{type(v).__name__}'")
            if not v:
                return False
        return True

    if op == "or":
        for arg in expression.args:
            v = evl(arg, context)
            if not isinstance(v, bool):
                raise TypeError(f"or: all args must be bool, got '{type(v).__name__}'")
            if v:
                return True
        return False

    # =====================
    # Comparators
    # =====================
    if op in {"eq", "ne", "gt", "ge", "lt", "le"}:
        lhs = evl(expression.lhs, context)
        rhs = evl(expression.rhs, context)

        if op == "eq":
            return lhs == rhs
        if op == "ne":
            return lhs != rhs

        if type(lhs) is not type(rhs):
            raise TypeError(
                f"{op}: lhs and rhs must have same type, got '{type(lhs).__name__}' and '{type(rhs).__name__}'"
            )
        if not (_is_number(lhs) or isinstance(lhs, str)):
            raise TypeError(
                f"{op}: only number or string comparison supported, got '{type(lhs).__name__}'"
            )

        if op == "gt":
            return lhs > rhs  # type: ignore[operator]
        if op == "ge":
            return lhs >= rhs  # type: ignore[operator]
        if op == "lt":
            return lhs < rhs  # type: ignore[operator]
        if op == "le":
            return lhs <= rhs  # type: ignore[operator]

    # =====================
    # Arithmetic
    # =====================
    if op in {"add", "sub", "mul", "div"}:
        lhs = evl(expression.lhs, context)
        rhs = evl(expression.rhs, context)

        if not (_is_number(lhs) and _is_number(rhs)):
            raise TypeError(
                f"{op}: operands must be numbers, got '{type(lhs).__name__}' and '{type(rhs).__name__}'"
            )

        lhs_num = float(lhs)
        rhs_num = float(rhs)

        if op == "add":
            return lhs_num + rhs_num
        if op == "sub":
            return lhs_num - rhs_num
        if op == "mul":
            return lhs_num * rhs_num
        if op == "div":
            if rhs_num == 0:
                raise ZeroDivisionError("div: division by zero")
            return lhs_num / rhs_num

    # =====================
    # Array ops
    # =====================
    if op == "append":
        array_val = evl(expression.array, context)
        if not isinstance(array_val, list):
            raise TypeError(
                f"append: array must be list, got '{type(array_val).__name__}'"
            )
        value_val = evl(expression.value, context)
        return [*array_val, value_val]

    if op == "concat":
        array_val = evl(expression.array, context)
        if not isinstance(array_val, list):
            raise TypeError(
                f"concat: array must be list, got '{type(array_val).__name__}'"
            )
        value_val = evl(expression.value, context)
        if not isinstance(value_val, list):
            raise TypeError(
                f"concat: value must be list, got '{type(value_val).__name__}'"
            )
        return [*array_val, *value_val]

    if op == "slice":
        array_val = evl(expression.array, context)
        if not isinstance(array_val, list):
            raise TypeError(
                f"slice: array must be list, got '{type(array_val).__name__}'"
            )

        start_val = evl(expression.start, context)
        if not isinstance(start_val, int):
            raise TypeError(
                f"slice: start must be int, got '{type(start_val).__name__}'"
            )

        if expression.end is None:
            end_index = None
        else:
            end_val = evl(expression.end, context)
            if not isinstance(end_val, int):
                raise TypeError(
                    f"slice: end must be int, got '{type(end_val).__name__}'"
                )
            end_index = end_val

        return array_val[start_val:end_index]

    if op == "map":
        array_val = evl(expression.array, context)
        if not isinstance(array_val, list):
            raise TypeError(
                f"map: array must be list, got '{type(array_val).__name__}'"
            )

        cur_name = expression.cur
        base_locals = context.local_variables

        return [
            evl(
                expression.func,
                context.model_copy(
                    update={
                        "local_variables": {**base_locals, cur_name: elem},
                    }
                ),
            )
            for elem in array_val
        ]

    if op == "filter":
        array_val = evl(expression.array, context)
        if not isinstance(array_val, list):
            raise TypeError(
                f"filter: array must be list, got '{type(array_val).__name__}'"
            )

        cur_name = expression.cur
        base_locals = context.local_variables

        result: List = []
        for elem in array_val:
            keep = evl(
                expression.predicate,
                context.model_copy(
                    update={
                        "local_variables": {**base_locals, cur_name: elem},
                    }
                ),
            )
            if not isinstance(keep, bool):
                raise TypeError(
                    f"filter: predicate must be bool, got '{type(keep).__name__}'"
                )
            if keep:
                result.append(elem)
        return result

    if op == "fold":
        array_val = evl(expression.array, context)
        if not isinstance(array_val, list):
            raise TypeError(
                f"fold: array must be list, got '{type(array_val).__name__}'"
            )

        acc = evl(expression.init, context)
        acc_name = expression.acc
        cur_name = expression.cur
        base_locals = context.local_variables

        for elem in array_val:
            acc = evl(
                expression.func,
                context.model_copy(
                    update={
                        "local_variables": {
                            **base_locals,
                            acc_name: acc,
                            cur_name: elem,
                        },
                    }
                ),
            )
        return acc

    raise ValueError(f"Unsupported expression op: {op!r}")
