import pytest

import nodekit as nk
from nodekit._internal.ops.simulation.evaluate_expression import EvalContext, evaluate_expression


@pytest.fixture
def ctx() -> EvalContext:
    return EvalContext(
        graph_registers={
            "r1": 1,
            "mapping": {"k": "v"},
        },
        last_action=nk.actions.KeyAction(action_value="a"),
        last_subgraph_registers={"child": 99},
        local_variables={},
    )


def test_base_lookups(ctx: EvalContext) -> None:
    assert evaluate_expression(nk.expressions.Reg(id="r1"), ctx) == 1
    assert evaluate_expression(nk.expressions.ChildReg(id="child"), ctx) == 99
    assert evaluate_expression(nk.expressions.LastAction(), ctx) == "a"
    assert (
        evaluate_expression(
            nk.expressions.GetDictValue(
                d=nk.expressions.Reg(id="mapping"),
                key=nk.expressions.Lit(value="k"),
            ),
            ctx,
        )
        == "v"
    )


def test_boolean_and_comparison_logic(ctx: EvalContext) -> None:
    assert evaluate_expression(
        nk.expressions.And(
            args=[
                nk.expressions.Lit(value=True),
                nk.expressions.Eq(
                    lhs=nk.expressions.Lit(value=1),
                    rhs=nk.expressions.Lit(value=1),
                ),
            ]
        ),
        ctx,
    )

    assert not evaluate_expression(
        nk.expressions.Or(
            args=[
                nk.expressions.Lit(value=False),
                nk.expressions.Lit(value=False),
            ]
        ),
        ctx,
    )

    with pytest.raises(ValueError, match="and: all args must be boolean"):
        evaluate_expression(
            nk.expressions.And(
                args=[
                    nk.expressions.Lit(value=True),
                    nk.expressions.Lit(value=1),
                ]
            ),
            ctx,
        )

    with pytest.raises(ValueError, match="gt: only numeric comparison supported"):
        evaluate_expression(
            nk.expressions.Gt(
                lhs=nk.expressions.Lit(value=1),
                rhs=nk.expressions.Lit(value="1"),
            ),
            ctx,
        )

    with pytest.raises(ValueError, match="gt: lhs and rhs must have same type"):
        evaluate_expression(
            nk.expressions.Gt(
                lhs=nk.expressions.Lit(value=1),
                rhs=nk.expressions.Lit(value=1.0),
            ),
            ctx,
        )


def test_if_and_not(ctx: EvalContext) -> None:
    assert (
        evaluate_expression(
            nk.expressions.If(
                cond=nk.expressions.Not(operand=nk.expressions.Lit(value=False)),
                then=nk.expressions.Lit(value="yes"),
                otherwise=nk.expressions.Lit(value="no"),
            ),
            ctx,
        )
        == "yes"
    )


def test_arithmetic(ctx: EvalContext) -> None:
    assert (
        evaluate_expression(
            nk.expressions.Add(
                lhs=nk.expressions.Lit(value=2),
                rhs=nk.expressions.Lit(value=3),
            ),
            ctx,
        )
        == 5
    )

    assert (
        evaluate_expression(
            nk.expressions.Mul(
                lhs=nk.expressions.Lit(value=4),
                rhs=nk.expressions.Lit(value=2),
            ),
            ctx,
        )
        == 8
    )

    with pytest.raises(ValueError, match="add: lhs and rhs must be numbers"):
        evaluate_expression(
            nk.expressions.Add(
                lhs=nk.expressions.Lit(value="x"),
                rhs=nk.expressions.Lit(value=1),
            ),
            ctx,
        )

    with pytest.raises(ValueError, match="div: division by zero"):
        evaluate_expression(
            nk.expressions.Div(
                lhs=nk.expressions.Lit(value=3),
                rhs=nk.expressions.Lit(value=0),
            ),
            ctx,
        )
