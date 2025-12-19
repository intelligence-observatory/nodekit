from dataclasses import dataclass

from nodekit._internal.types import expressions as expr
from nodekit._internal.types.actions import Action
from nodekit._internal.types.expressions import Expression, LocalVariableName
from nodekit._internal.types.values import (
    RegisterId,
    Value,
)
from typing import Never, cast


# %% Helpers
def _with_locals(context: EvalContext, **updates: Value) -> EvalContext:
    merged_locals = dict(context.local_variables)
    merged_locals.update(updates)
    return EvalContext(
        graph_registers=context.graph_registers,
        last_action=context.last_action,
        last_subgraph_registers=context.last_subgraph_registers,
        local_variables=merged_locals,
    )


# %% Context
@dataclass(frozen=True)
class EvalContext:
    graph_registers: dict[RegisterId, Value]
    last_action: Action | None
    last_subgraph_registers: dict[RegisterId, Value] | None
    local_variables: dict[LocalVariableName, Value]


# %% Core evaluator
def evaluate_expression(
    expression: Expression,
    context: EvalContext,
) -> Value:
    if isinstance(expression, expr.Reg):
        if expression.id not in context.graph_registers:
            raise ValueError(f"Graph Register '{expression.id}' not found")
        return context.graph_registers[expression.id]

    elif isinstance(expression, expr.ChildReg):
        if context.last_subgraph_registers is None:
            raise ValueError("No last subgraph registers available for 'creg'")
        if expression.id not in context.last_subgraph_registers:
            raise ValueError(f"Child Graph Register '{expression.id}' not found")
        return context.last_subgraph_registers[expression.id]

    elif isinstance(expression, expr.LastAction):
        if context.last_action is None:
            raise ValueError("No last action available for 'la'")
        return cast(Value, context.last_action.action_value)

    elif isinstance(expression, expr.GetDictValue):
        dict_val = evaluate_expression(expression.d, context)
        if not isinstance(dict_val, dict):
            raise ValueError(f"gdv: dict must be object, got '{dict_val}'")

        key_val = evaluate_expression(expression.key, context)
        if not isinstance(key_val, str):
            raise ValueError(f"gdv: key must be string, got '{key_val}'")

        if key_val not in dict_val:
            raise ValueError(f"gdv: key '{key_val}' not found in dict")

        return dict_val[key_val]

    elif isinstance(expression, expr.Lit):
        return expression.value

    elif isinstance(expression, expr.If):
        cond_val = evaluate_expression(expression.cond, context)
        branch = expression.then if cond_val else expression.otherwise
        return evaluate_expression(branch, context)

    elif isinstance(expression, expr.Not):
        operand = evaluate_expression(expression.operand, context)
        return not operand

    elif isinstance(expression, expr.And):
        for arg in expression.args:
            v = evaluate_expression(arg, context)
            if not isinstance(v, bool):
                raise ValueError(f"and: all args must be boolean, got '{v}'")
            if not v:
                return False
        return True

    elif isinstance(expression, expr.Or):
        for arg in expression.args:
            v = evaluate_expression(arg, context)
            if not isinstance(v, bool):
                raise ValueError(f"or: all args must be boolean, got '{v}'")
            if v:
                return True
        return False

    elif isinstance(expression, (expr.Gt, expr.Ge, expr.Lt, expr.Le)):
        lhs = evaluate_expression(expression.lhs, context)
        rhs = evaluate_expression(expression.rhs, context)

        if not (isinstance(lhs, (int, float)) and isinstance(rhs, (int, float))):
            raise ValueError(
                f"{expression.op}: only numeric comparison supported, got '{type(lhs)}'"
            )

        if type(lhs) is not type(rhs):
            raise ValueError(
                f"{expression.op}: lhs and rhs must have same type, got '{type(lhs)}' and '{type(rhs)}'"
            )

        if isinstance(expression, expr.Gt):
            return lhs > rhs
        if isinstance(expression, expr.Ge):
            return lhs >= rhs
        if isinstance(expression, expr.Lt):
            return lhs < rhs
        if isinstance(expression, expr.Le):
            return lhs <= rhs

        _: Never = expression
        raise ValueError(f"Unsupported comparison operator: {expression.op}")

    elif isinstance(expression, (expr.Eq, expr.Ne)):
        lhs = evaluate_expression(expression.lhs, context)
        rhs = evaluate_expression(expression.rhs, context)

        if isinstance(expression, expr.Eq):
            return lhs == rhs
        if isinstance(expression, expr.Ne):
            return lhs != rhs

        _: Never = expression
        raise ValueError(f"Unsupported comparison operator: {expression}")

    elif isinstance(expression, (expr.Add, expr.Sub, expr.Mul, expr.Div)):
        lhs = evaluate_expression(expression.lhs, context)
        rhs = evaluate_expression(expression.rhs, context)

        if not isinstance(lhs, (int, float)) or not isinstance(rhs, (int, float)):
            raise ValueError(
                f"{expression.op}: lhs and rhs must be numbers, got '{type(lhs)}' and '{type(rhs)}'"
            )

        if isinstance(expression, expr.Add):
            return lhs + rhs
        if isinstance(expression, expr.Sub):
            return lhs - rhs
        if isinstance(expression, expr.Mul):
            return lhs * rhs
        if isinstance(expression, expr.Div):
            if rhs == 0:
                raise ValueError("div: division by zero")
            return lhs / rhs

        _: Never = expression
        raise ValueError(f"Unsupported arithmetic operator: {expression.op}")

    else:
        _: Never = expression
        raise ValueError(f"Unsupported expression: {expression}")
