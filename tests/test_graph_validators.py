import re

import pydantic
import pytest
from packaging.version import Version

import nodekit as nk
from nodekit._internal.version import VERSION


def wait_node() -> nk.Node:
    return nk.Node(
        card=None,
        sensor=nk.sensors.WaitSensor(duration_msec=1),
    )


def compatible_older_version() -> str:
    current = Version(VERSION)
    return f"{current.major}.{current.minor}.{max(current.micro - 1, 0)}"


def newer_same_major_version() -> str:
    current = Version(VERSION)
    return f"{current.major}.{current.minor}.{current.micro + 1}"


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


def test_accepts_older_compatible_nodekit_version():
    older = compatible_older_version()
    graph = nk.Graph(
        nodekit_version=older,
        nodes={"start": wait_node()},
        transitions={"start": nk.transitions.End()},
        start="start",
    )

    assert graph.nodekit_version == older


def test_rejects_newer_nodekit_version():
    newer = newer_same_major_version()
    with pytest.raises(
        pydantic.ValidationError,
        match=re.escape(
            f"Serialized NodeKit version {newer} is newer than runtime version {VERSION}"
        ),
    ):
        nk.Graph(
            nodekit_version=newer,
            nodes={"start": wait_node()},
            transitions={"start": nk.transitions.End()},
            start="start",
        )


def test_rejects_incompatible_major_nodekit_version():
    with pytest.raises(
        pydantic.ValidationError,
        match=r"Incompatible NodeKit major version: expected 0\.x, got 1\.0\.0",
    ):
        nk.Graph(
            nodekit_version="1.0.0",
            nodes={"start": wait_node()},
            transitions={"start": nk.transitions.End()},
            start="start",
        )


def test_rejects_invalid_nodekit_version_string():
    with pytest.raises(pydantic.ValidationError, match="Invalid NodeKit version: not-a-version"):
        nk.Graph(
            nodekit_version="not-a-version",
            nodes={"start": wait_node()},
            transitions={"start": nk.transitions.End()},
            start="start",
        )


def test_accepts_older_prerelease_when_runtime_is_final():
    graph = nk.Graph(
        nodekit_version="0.2.6.dev1",
        nodes={"start": wait_node()},
        transitions={"start": nk.transitions.End()},
        start="start",
    )

    assert graph.nodekit_version == "0.2.6.dev1"


def test_rejects_final_release_when_runtime_is_prerelease(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr("nodekit._internal.version.VERSION", "0.2.6.dev1")

    with pytest.raises(
        pydantic.ValidationError,
        match=re.escape(
            "Serialized NodeKit version 0.2.6 is newer than runtime version 0.2.6.dev1"
        ),
    ):
        nk.Graph(
            nodekit_version="0.2.6",
            nodes={"start": wait_node()},
            transitions={"start": nk.transitions.End()},
            start="start",
        )


def test_rejects_newer_prerelease_when_runtime_is_prerelease(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr("nodekit._internal.version.VERSION", "0.2.6.dev1")

    with pytest.raises(
        pydantic.ValidationError,
        match=re.escape(
            "Serialized NodeKit version 0.2.6.dev2 is newer than runtime version 0.2.6.dev1"
        ),
    ):
        nk.Graph(
            nodekit_version="0.2.6.dev2",
            nodes={"start": wait_node()},
            transitions={"start": nk.transitions.End()},
            start="start",
        )
