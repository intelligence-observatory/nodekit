import pydantic
import pytest

import nodekit as nk


def wait_node() -> nk.Node:
    return nk.Node(stimulus=None, sensor=nk.sensors.WaitSensor(duration_msec=1))


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


def test_switch_on_expression_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.Switch(
                    on=nk.expressions.Reg(id="missing"),
                    cases={1: nk.transitions.Go(to="start")},
                    default=nk.transitions.End(),
                )
            },
            start="start",
            registers={"r1": 0},
        )


def test_switch_case_updates_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.Switch(
                    on=nk.expressions.Lit(value=1),
                    cases={
                        1: nk.transitions.Go(
                            to="start",
                            register_updates={"r1": nk.expressions.Reg(id="missing")},
                        )
                    },
                    default=nk.transitions.End(),
                )
            },
            start="start",
            registers={"r1": 0},
        )


def test_switch_default_updates_checked():
    with pytest.raises(pydantic.ValidationError, match="undefined registers"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.Switch(
                    on=nk.expressions.Lit(value=1),
                    cases={},
                    default=nk.transitions.Go(
                        to="start",
                        register_updates={"r1": nk.expressions.Reg(id="missing")},
                    ),
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
            "start": nk.transitions.Switch(
                on=nk.expressions.Reg(id="r1"),
                cases={
                    0: nk.transitions.Go(
                        to="end",
                        register_updates={
                            "r1": nk.expressions.Reg(id="r1"),
                            "r2": nk.expressions.Lit(value=2),
                        },
                    ),
                },
                default=nk.transitions.Go(
                    to="end",
                    register_updates={"r2": nk.expressions.Reg(id="r1")},
                ),
            ),
            "end": nk.transitions.End(
                register_updates={"r2": nk.expressions.Reg(id="r2")}
            ),
        },
        start="start",
        registers={"r1": 0, "r2": 0},
    )

    assert graph.registers["r1"] == 0
