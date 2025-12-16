from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping, TypeGuard, cast

from nodekit._internal.types import expressions as expr
from nodekit._internal.types.actions import Action
from nodekit._internal.types.expressions import Expression, LocalVariableName
from nodekit._internal.types.values import RegisterId, Value


# %% Context
@dataclass(frozen=True)
class EvalContext:
    graph_registers: Mapping[RegisterId, Value]
    last_action: Action | None
    last_subgraph_registers: Mapping[RegisterId, Value] | None
    local_variables: Mapping[LocalVariableName, Value]


# %% Helpers
def _js_type(value: Value) -> str:
    if isinstance(value, bool):
        return "boolean"
    if isinstance(value, (int, float)):
        return "number"
    if isinstance(value, str):
        return "string"
    return "object"


def _is_number(value: Value) -> TypeGuard[int | float]:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _with_locals(context: EvalContext, **updates: Value) -> EvalContext:
    merged_locals = dict(context.local_variables)
    merged_locals.update(updates)
    return EvalContext(
        graph_registers=context.graph_registers,
        last_action=context.last_action,
        last_subgraph_registers=context.last_subgraph_registers,
        local_variables=merged_locals,
    )


def _strict_equal(lhs: Value, rhs: Value) -> bool:
    lhs_type = _js_type(lhs)
    rhs_type = _js_type(rhs)
    if lhs_type != rhs_type:
        return False
    return lhs == rhs


# %% Core evaluator
def evaluate_expression(
    expression: Expression,
    context: EvalContext,
) -> Value:
    match expression:
        case expr.Reg():
            if expression.id not in context.graph_registers:
                raise ValueError(f"Graph Register '{expression.id}' not found")
            return context.graph_registers[expression.id]

        case expr.ChildReg():
            if context.last_subgraph_registers is None:
                raise ValueError("No last subgraph registers available for 'creg'")
            if expression.id not in context.last_subgraph_registers:
                raise ValueError(f"Child Graph Register '{expression.id}' not found")
            return context.last_subgraph_registers[expression.id]

        case expr.Local():
            if expression.name not in context.local_variables:
                raise ValueError(f"Local variable '{expression.name}' not found")
            return context.local_variables[expression.name]

        case expr.LastAction():
            if context.last_action is None:
                raise ValueError("No last action available for 'la'")
            return context.last_action.action_value

        case expr.GetListItem():
            list_val = evaluate_expression(expression.list, context)
            if not isinstance(list_val, list):
                raise ValueError(f"gli: list must be array, got '{_js_type(list_val)}'")

            index_val = evaluate_expression(expression.index, context)
            if not _is_number(index_val):
                raise ValueError(f"gli: index must be number, got '{_js_type(index_val)}'")
            index_num = cast(int | float, index_val)
            index_int = int(index_num)
            if index_int < 0 or index_int >= len(list_val):
                raise ValueError(
                    f"gli: index out of bounds, got index {index_int} for list of length {len(list_val)}"
                )
            return list_val[index_int]

        case expr.GetDictValue():
            dict_val = evaluate_expression(expression.d, context)
            if not isinstance(dict_val, dict):
                raise ValueError(f"gdv: dict must be object, got '{_js_type(dict_val)}'")

            key_val = evaluate_expression(expression.key, context)
            if not isinstance(key_val, str):
                raise ValueError(f"gdv: key must be string, got '{_js_type(key_val)}'")

            if key_val not in dict_val:
                raise ValueError(f"gdv: key '{key_val}' not found in dict")

            return dict_val[key_val]

        case expr.Lit():
            return expression.value

        case expr.If():
            cond_val = evaluate_expression(expression.cond, context)
            branch = expression.then if cond_val else expression.otherwise
            return evaluate_expression(branch, context)

        case expr.Not():
            operand = evaluate_expression(expression.operand, context)
            return not operand

        case expr.And():
            for arg in expression.args:
                v = evaluate_expression(arg, context)
                if not isinstance(v, bool):
                    raise ValueError(f"and: all args must be boolean, got '{_js_type(v)}'")
                if not v:
                    return False
            return True

        case expr.Or():
            for arg in expression.args:
                v = evaluate_expression(arg, context)
                if not isinstance(v, bool):
                    raise ValueError(f"or: all args must be boolean, got '{_js_type(v)}'")
                if v:
                    return True
            return False

        case expr.Gt() | expr.Ge() | expr.Lt() | expr.Le():
            lhs = evaluate_expression(expression.lhs, context)
            rhs = evaluate_expression(expression.rhs, context)

            lhs_type = _js_type(lhs)
            rhs_type = _js_type(rhs)
            if lhs_type != rhs_type:
                raise ValueError(
                    f"{expression.op}: lhs and rhs must have same type, got '{lhs_type}' and '{rhs_type}'"
                )

            if not (_is_number(lhs) or isinstance(lhs, str)):
                raise ValueError(
                    f"{expression.op}: only number or string comparison supported, got '{lhs_type}'"
                )

            if expression.op == "gt":
                return lhs > rhs
            if expression.op == "ge":
                return lhs >= rhs
            if expression.op == "lt":
                return lhs < rhs
            return lhs <= rhs

        case expr.Eq():
            lhs = evaluate_expression(expression.lhs, context)
            rhs = evaluate_expression(expression.rhs, context)
            return _strict_equal(lhs, rhs)

        case expr.Ne():
            lhs = evaluate_expression(expression.lhs, context)
            rhs = evaluate_expression(expression.rhs, context)
            return not _strict_equal(lhs, rhs)

        case expr.Add() | expr.Sub() | expr.Mul() | expr.Div():
            lhs = evaluate_expression(expression.lhs, context)
            rhs = evaluate_expression(expression.rhs, context)

            if not (_is_number(lhs) and _is_number(rhs)):
                raise ValueError(
                    f"{expression.op}: operands must be numbers, got '{_js_type(lhs)}' and '{_js_type(rhs)}'"
                )

            if expression.op == "add":
                return lhs + rhs
            if expression.op == "sub":
                return lhs - rhs
            if expression.op == "mul":
                return lhs * rhs
            if rhs == 0:
                raise ValueError("div: division by zero")
            return lhs / rhs

        case expr.Append():
            array_val = evaluate_expression(expression.array, context)
            if not isinstance(array_val, list):
                raise ValueError(f"append: array must be array, got '{_js_type(array_val)}'")

            value_val = evaluate_expression(expression.value, context)
            return [*array_val, value_val]

        case expr.Concat():
            array_val = evaluate_expression(expression.array, context)
            if not isinstance(array_val, list):
                raise ValueError(f"concat: array must be array, got '{_js_type(array_val)}'")

            value_val = evaluate_expression(expression.value, context)
            if not isinstance(value_val, list):
                raise ValueError(f"concat: value must be array, got '{_js_type(value_val)}'")

            return [*array_val, *value_val]

        case expr.Slice():
            array_val = evaluate_expression(expression.array, context)
            if not isinstance(array_val, list):
                raise ValueError(f"slice: array must be array, got '{_js_type(array_val)}'")

            start_val = evaluate_expression(expression.start, context)
            if not _is_number(start_val):
                raise ValueError(f"slice: start must be number, got '{_js_type(start_val)}'")
            start_num = cast(int | float, start_val)

            end_val: int | None = None
            if expression.end is not None:
                ev_end = evaluate_expression(expression.end, context)
                if not _is_number(ev_end):
                    raise ValueError(f"slice: end must be number, got '{_js_type(ev_end)}'")
                end_num = cast(int | float, ev_end)
                end_val = int(end_num)

            return array_val[int(start_num) : end_val]

        case expr.Map():
            array_val = evaluate_expression(expression.array, context)
            if not isinstance(array_val, list):
                raise ValueError(f"map: array must be array, got '{_js_type(array_val)}'")

            return [
                evaluate_expression(
                    expression.func,
                    _with_locals(context, **{expression.cur: elem}),
                )
                for elem in array_val
            ]

        case expr.Filter():
            array_val = evaluate_expression(expression.array, context)
            if not isinstance(array_val, list):
                raise ValueError(f"filter: array must be array, got '{_js_type(array_val)}'")

            result: list[Value] = []
            for elem in array_val:
                keep = evaluate_expression(
                    expression.predicate,
                    _with_locals(context, **{expression.cur: elem}),
                )
                if not isinstance(keep, bool):
                    raise ValueError(f"filter: predicate must be boolean, got '{_js_type(keep)}'")
                if keep:
                    result.append(elem)
            return result

        case expr.Fold():
            array_val = evaluate_expression(expression.array, context)
            if not isinstance(array_val, list):
                raise ValueError(f"fold: array must be array, got '{_js_type(array_val)}'")

            acc = evaluate_expression(expression.init, context)

            for elem in array_val:
                acc = evaluate_expression(
                    expression.func,
                    _with_locals(context, **{expression.acc: acc, expression.cur: elem}),
                )
            return acc

        case _:
            raise ValueError(f"Unsupported expression op: {expression.op}")
