import pydantic
import pytest

import nodekit as nk


def test_reg_and_childreg_collected():
    assert nk._internal.types.graph._get_reg_references(  # type: ignore[attr-defined]
        nk.expressions.Reg(id="r1")
    ) == {"r1"}
    assert nk._internal.types.graph._get_reg_references(  # type: ignore[attr-defined]
        nk.expressions.ChildReg(id="r2")
    ) == {"r2"}


def test_non_reg_atoms_ignored():
    for expr in (
        nk.expressions.Local(name="x"),
        nk.expressions.LastAction(),
        nk.expressions.Lit(value=123),
    ):
        assert nk._internal.types.graph._get_reg_references(expr) == set()  # type: ignore[attr-defined]


def test_unary_and_binary_ops_union():
    not_expr = nk.expressions.Not(operand=nk.expressions.Reg(id="r1"))
    assert nk._internal.types.graph._get_reg_references(not_expr) == {"r1"}  # type: ignore[attr-defined]

    cmp_expr = nk.expressions.Eq(
        lhs=nk.expressions.Reg(id="r1"),
        rhs=nk.expressions.ChildReg(id="r2"),
    )
    assert nk._internal.types.graph._get_reg_references(cmp_expr) == {"r1", "r2"}  # type: ignore[attr-defined]


def test_if_and_variadic_ops_union():
    if_expr = nk.expressions.If(
        cond=nk.expressions.Reg(id="c"),
        then=nk.expressions.Reg(id="t"),
        otherwise=nk.expressions.ChildReg(id="o"),
    )
    assert nk._internal.types.graph._get_reg_references(if_expr) == {"c", "t", "o"}  # type: ignore[attr-defined]

    or_expr = nk.expressions.Or(args=[nk.expressions.Reg(id="r1"), nk.expressions.Reg(id="r2")])
    assert nk._internal.types.graph._get_reg_references(or_expr) == {"r1", "r2"}  # type: ignore[attr-defined]


def test_container_and_list_ops():
    gli = nk.expressions.GetListItem(
        list=nk.expressions.Reg(id="r1"),
        index=nk.expressions.Lit(value=0),
    )
    assert nk._internal.types.graph._get_reg_references(gli) == {"r1"}  # type: ignore[attr-defined]

    gdv = nk.expressions.GetDictValue(
        d=nk.expressions.ChildReg(id="r2"),
        key=nk.expressions.Lit(value="k"),
    )
    assert nk._internal.types.graph._get_reg_references(gdv) == {"r2"}  # type: ignore[attr-defined]

    slice_no_end = nk.expressions.Slice(
        array=nk.expressions.Reg(id="r1"),
        start=nk.expressions.Reg(id="r2"),
        end=None,
    )
    assert nk._internal.types.graph._get_reg_references(slice_no_end) == {"r1", "r2"}  # type: ignore[attr-defined]

    slice_with_end = nk.expressions.Slice(
        array=nk.expressions.Reg(id="r1"),
        start=nk.expressions.Reg(id="r2"),
        end=nk.expressions.ChildReg(id="r3"),
    )
    assert nk._internal.types.graph._get_reg_references(slice_with_end) == {"r1", "r2", "r3"}  # type: ignore[attr-defined]

    map_expr = nk.expressions.Map(
        array=nk.expressions.Reg(id="r1"),
        cur="cur",
        func=nk.expressions.ChildReg(id="r2"),
    )
    assert nk._internal.types.graph._get_reg_references(map_expr) == {"r1", "r2"}  # type: ignore[attr-defined]

    filter_expr = nk.expressions.Filter(
        array=nk.expressions.Lit(value=[]),
        cur="cur",
        predicate=nk.expressions.Reg(id="r3"),
    )
    assert nk._internal.types.graph._get_reg_references(filter_expr) == {"r3"}  # type: ignore[attr-defined]

    fold_expr = nk.expressions.Fold(
        array=nk.expressions.Reg(id="r4"),
        init=nk.expressions.ChildReg(id="r5"),
        acc="acc",
        cur="cur",
        func=nk.expressions.Reg(id="r6"),
    )
    assert nk._internal.types.graph._get_reg_references(fold_expr) == {"r4", "r5", "r6"}  # type: ignore[attr-defined]


def test_unhandled_expression_type_raises():

    class DummyExpr(pydantic.BaseModel):
        op: str = "dummy"

    with pytest.raises(TypeError):
        nk._internal.types.graph._get_reg_references(DummyExpr())  # type: ignore[attr-defined]
