import pydantic
import pytest

import nodekit as nk


def wait_node() -> nk.Node:
    return nk.Node(
        card=None,
        sensor=nk.sensors.WaitSensor(duration_msec=1),
    )


def test_requires_at_least_one_node():
    with pytest.raises(pydantic.ValidationError, match="at least one node"):
        nk.Graph(nodes={}, transitions={}, start="start")


def test_start_node_exists():
    with pytest.raises(pydantic.ValidationError, match="Start Node missing does not exist"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={"start": nk.transitions.End()},
            start="missing",
        )


def test_each_node_has_transition():
    with pytest.raises(pydantic.ValidationError, match="has no corresponding Transition"):
        nk.Graph(
            nodes={
                "start": wait_node(),
                "done": wait_node(),
            },
            transitions={
                "start": nk.transitions.Go(to="done"),
            },
            start="start",
        )


def test_transition_for_existing_node():
    with pytest.raises(
        pydantic.ValidationError,
        match="Transition found for Node ghost but Node does not exist",
    ):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.End(),
                "ghost": nk.transitions.End(),
            },
            start="start",
        )


def test_go_targets_exist():
    with pytest.raises(pydantic.ValidationError, match="points to non-existent Node missing"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={"start": nk.transitions.Go(to="missing")},
            start="start",
        )


def test_ifthenelse_targets_exist():
    with pytest.raises(pydantic.ValidationError, match="points to non-existent Node missing"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.IfThenElse(
                    if_=nk.expressions.Lit(value=True),
                    then=nk.transitions.Go(to="missing"),
                    else_=nk.transitions.End(),
                )
            },
            start="start",
        )


def test_else_branch_targets_exist():
    with pytest.raises(pydantic.ValidationError, match="points to non-existent Node missing"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.IfThenElse(
                    if_=nk.expressions.Lit(value=True),
                    then=nk.transitions.End(),
                    else_=nk.transitions.Go(to="missing"),
                ),
            },
            start="start",
        )


def test_nested_if_targets_exist():
    with pytest.raises(pydantic.ValidationError, match="points to non-existent Node missing"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={
                "start": nk.transitions.IfThenElse(
                    if_=nk.expressions.Lit(value=True),
                    then=nk.transitions.IfThenElse(
                        if_=nk.expressions.Lit(value=False),
                        then=nk.transitions.Go(to="missing"),
                        else_=nk.transitions.End(),
                    ),
                    else_=nk.transitions.End(),
                ),
            },
            start="start",
        )


def test_orphan_nodes_rejected():
    with pytest.raises(pydantic.ValidationError, match="orphan"):
        nk.Graph(
            nodes={
                "start": wait_node(),
                "orphan": wait_node(),
            },
            transitions={
                "start": nk.transitions.End(),
                "orphan": nk.transitions.End(),
            },
            start="start",
        )


def test_nodes_need_path_to_end():
    with pytest.raises(pydantic.ValidationError, match="path to an End transition"):
        nk.Graph(
            nodes={"start": wait_node()},
            transitions={"start": nk.transitions.Go(to="start")},
            start="start",
        )


def test_valid_graph_passes():
    graph = nk.Graph(
        nodes={
            "start": wait_node(),
            "a": wait_node(),
            "b": wait_node(),
            "end": wait_node(),
        },
        transitions={
            "start": nk.transitions.IfThenElse(
                if_=nk.expressions.Lit(value=True),
                then=nk.transitions.Go(to="a"),
                else_=nk.transitions.Go(to="b"),
            ),
            "a": nk.transitions.Go(to="end"),
            "b": nk.transitions.Go(to="end"),
            "end": nk.transitions.End(),
        },
        start="start",
    )

    assert graph.start == "start"
