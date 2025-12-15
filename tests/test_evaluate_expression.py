import pytest

import nodekit as nk
from nodekit._internal.ops.simulation.evaluate_expression import (
    EvalContext,
    evaluate_expression,
)


@pytest.fixture
def ctx() -> EvalContext:
    return EvalContext(
        graph_registers={
            "r1": 1,
            "numbers": [1, 2, 3],
            "mapping": {"k": "v"},
        },
        last_action=nk.actions.KeyAction(action_value="a"),
        last_subgraph_registers={"child": 99},
        local_variables={"local": 7},
    )


def test_base_lookups(ctx: EvalContext) -> None:
    assert evaluate_expression(nk.expressions.Reg(id="r1"), ctx) == 1
    assert evaluate_expression(nk.expressions.ChildReg(id="child"), ctx) == 99
    assert evaluate_expression(nk.expressions.Local(name="local"), ctx) == 7
    assert evaluate_expression(nk.expressions.LastAction(), ctx) == "a"
    assert (
        evaluate_expression(
            nk.expressions.GetListItem(
                list=nk.expressions.Reg(id="numbers"),
                index=nk.expressions.Lit(value=1),
            ),
            ctx,
        )
        == 2
    )
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
                    rhs=nk.expressions.Lit(value=1.0),
                ),
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

    with pytest.raises(ValueError, match="gt: lhs and rhs must have same type"):
        evaluate_expression(
            nk.expressions.Gt(
                lhs=nk.expressions.Lit(value=1),
                rhs=nk.expressions.Lit(value="1"),
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


def test_array_ops(ctx: EvalContext) -> None:
    assert evaluate_expression(
        nk.expressions.Append(
            array=nk.expressions.Reg(id="numbers"),
            value=nk.expressions.Lit(value=4),
        ),
        ctx,
    ) == [1, 2, 3, 4]

    assert evaluate_expression(
        nk.expressions.Concat(
            array=nk.expressions.Reg(id="numbers"),
            value=nk.expressions.Lit(value=[4, 5]),
        ),
        ctx,
    ) == [1, 2, 3, 4, 5]

    assert evaluate_expression(
        nk.expressions.Slice(
            array=nk.expressions.Reg(id="numbers"),
            start=nk.expressions.Lit(value=1),
            end=nk.expressions.Lit(value=3),
        ),
        ctx,
    ) == [2, 3]


def test_higher_order_array_ops(ctx: EvalContext) -> None:
    assert evaluate_expression(
        nk.expressions.Map(
            array=nk.expressions.Lit(value=[1, 2, 3]),
            cur="cur",
            func=nk.expressions.Mul(
                lhs=nk.expressions.Local(name="cur"),
                rhs=nk.expressions.Lit(value=2),
            ),
        ),
        ctx,
    ) == [2, 4, 6]

    assert evaluate_expression(
        nk.expressions.Filter(
            array=nk.expressions.Lit(value=[1, 2, 3]),
            cur="cur",
            predicate=nk.expressions.Gt(
                lhs=nk.expressions.Local(name="cur"),
                rhs=nk.expressions.Lit(value=1),
            ),
        ),
        ctx,
    ) == [2, 3]

    assert evaluate_expression(
        nk.expressions.Fold(
            array=nk.expressions.Lit(value=[1, 2, 3]),
            init=nk.expressions.Lit(value=0),
            acc="acc",
            cur="cur",
            func=nk.expressions.Add(
                lhs=nk.expressions.Local(name="acc"),
                rhs=nk.expressions.Local(name="cur"),
            ),
        ),
        ctx,
    ) == 6
