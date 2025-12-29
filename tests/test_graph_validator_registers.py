import pydantic
import pytest

import nodekit as nk


def wait_node() -> nk.Node:
    return nk.Node(card=None, sensor=nk.sensors.WaitSensor(duration_msec=1))


def test_go_updates_require_known_register_targets():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.Go(
                    to="start",
                    register_updates={"missing": nk.expressions.Lit(value=0)},
                )
            },
            start="start",
            registers={"r1": 0},
        )


def test_go_rhs_references_must_exist():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.Go(
                    to="start",
                    register_updates={"r1": nk.expressions.Reg(id="missing")},
                )
            },
            start="start",
            registers={"r1": 0},
        )


def test_end_updates_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.End(
                    register_updates={"r1": nk.expressions.ChildReg(id="missing")}
                )
            },
            start="start",
            registers={"r1": 0},
        )


def test_if_condition_register_refs_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.IfThenElse(
                    if_=nk.expressions.Reg(id="missing"),
                    then=nk.transitions.Go(to="start"),
                    else_=nk.transitions.End(),
                )
            },
            start="start",
            registers={"r1": 0},
        )


def test_if_branch_updates_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.IfThenElse(
                    if_=nk.expressions.Lit(value=True),
                    then=nk.transitions.Go(
                        to="start",
                        register_updates={"r1": nk.expressions.Reg(id="missing")},
                    ),
                    else_=nk.transitions.End(),
                )
            },
            start="start",
            registers={"r1": 0},
        )


def test_if_condition_child_register_refs_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.IfThenElse(
                    if_=nk.expressions.ChildReg(id="missing"),
                    then=nk.transitions.Go(to="start"),
                    else_=nk.transitions.End(),
                ),
            },
            start="start",
            registers={"r1": 0},
        )


def test_if_else_branch_updates_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.IfThenElse(
                    if_=nk.expressions.Lit(value=True),
                    then=nk.transitions.End(),
                    else_=nk.transitions.Go(
                        to="start",
                        register_updates={"r1": nk.expressions.Reg(id="missing")},
                    ),
                ),
            },
            start="start",
            registers={"r1": 0},
        )


def test_if_else_branch_child_register_updates_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.IfThenElse(
                    if_=nk.expressions.Lit(value=False),
                    then=nk.transitions.End(),
                    else_=nk.transitions.Go(
                        to="start",
                        register_updates={"r1": nk.expressions.ChildReg(id="missing")},
                    ),
                ),
            },
            start="start",
            registers={"r1": 0},
        )


def test_container_and_list_expression_refs_in_updates():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.Go(
                    to="start",
                    register_updates={
                        "r1": nk.expressions.GetDictValue(
                            d=nk.expressions.Reg(id="missing"),
                            key=nk.expressions.Lit(value="k"),
                        ),
                        "r2": nk.expressions.GetDictValue(
                            d=nk.expressions.ChildReg(id="missing2"),
                            key=nk.expressions.Lit(value="k"),
                        ),
                    },
                )
            },
            start="start",
            registers={"r1": 0, "r2": 0},
        )


def test_nested_expression_refs_in_updates_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.Go(
                    to="start",
                    register_updates={
                        "r1": nk.expressions.If(
                            cond=nk.expressions.Gt(
                                lhs=nk.expressions.Reg(id="missing"),
                                rhs=nk.expressions.Reg(id="also_missing"),
                            ),
                            then=nk.expressions.Add(
                                lhs=nk.expressions.ChildReg(id="missing2"),
                                rhs=nk.expressions.Lit(value=1),
                            ),
                            otherwise=nk.expressions.Sub(
                                lhs=nk.expressions.Reg(id="missing3"),
                                rhs=nk.expressions.Reg(id="missing4"),
                            ),
                        ),
                    },
                )
            },
            start="start",
            registers={"r1": 0},
        )


def test_valid_register_updates_pass():
    graph = nk.Graph(
        nodes={
            "start": wait_node(),
            "end": wait_node(),
        },
        transitions={
            "start": nk.transitions.IfThenElse(
                if_=nk.expressions.Eq(
                    lhs=nk.expressions.Reg(id="r1"),
                    rhs=nk.expressions.Lit(value=0),
                ),
                then=nk.transitions.Go(
                    to="end",
                    register_updates={
                        "r1": nk.expressions.Reg(id="r1"),
                        "r2": nk.expressions.Lit(value=2),
                    },
                ),
                else_=nk.transitions.Go(
                    to="end",
                    register_updates={"r2": nk.expressions.Reg(id="r1")},
                ),
            ),
            "end": nk.transitions.End(
                register_updates={
                    "r2": nk.expressions.Reg(id="r2"),
                    "r3": nk.expressions.Reg(id="r1"),
                }
            ),
        },
        start="start",
        registers={"r1": 0, "r2": 0, "r3": 0},
    )

    assert graph.registers["r1"] == 0
