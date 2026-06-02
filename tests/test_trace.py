import re

import pydantic
import pytest
from packaging.version import Version

import nodekit as nk
from nodekit._internal.version import VERSION


def compatible_older_version() -> str:
    current = Version(VERSION)
    if current.micro > 0:
        return f"{current.major}.{current.minor}.{current.micro - 1}"
    if current.minor > 0:
        return f"{current.major}.{current.minor - 1}.0"
    if current > Version(f"{current.major}.0.0.dev0"):
        return f"{current.major}.0.0.dev0"
    raise ValueError(f"No older same-major version exists for {VERSION}")


def newer_same_major_version() -> str:
    current = Version(VERSION)
    return f"{current.major}.{current.minor}.{current.micro + 1}"


def final_release_version() -> str:
    return Version(VERSION).base_version


def prerelease_runtime_version() -> str:
    return f"{final_release_version()}.dev1"


def newer_prerelease_version() -> str:
    return f"{final_release_version()}.dev2"


def minimal_graph(nodekit_version: str | None = None) -> nk.Graph:
    kwargs = {}
    if nodekit_version is not None:
        kwargs["nodekit_version"] = nodekit_version

    return nk.Graph(
        start="start",
        nodes={
            "start": nk.Node(sensor=nk.sensors.WaitSensor(duration_msec=1)),
        },
        transitions={
            "start": nk.transitions.End(),
        },
        **kwargs,
    )


def test_accepts_older_compatible_nodekit_version():
    older = compatible_older_version()
    trace = nk.Trace(
        nodekit_version=older,
        graph=minimal_graph(),
        events=[nk.events.TraceStartedEvent(t=0)],
    )

    assert trace.nodekit_version == older


def test_rejects_newer_nodekit_version():
    newer = newer_same_major_version()
    with pytest.raises(
        pydantic.ValidationError,
        match=re.escape(
            f"Serialized NodeKit version {newer} is newer than runtime version {VERSION}"
        ),
    ):
        nk.Trace(
            nodekit_version=newer,
            graph=minimal_graph(),
            events=[nk.events.TraceStartedEvent(t=0)],
        )


def test_rejects_incompatible_major_nodekit_version():
    with pytest.raises(
        pydantic.ValidationError,
        match=r"Incompatible NodeKit major version: expected 0\.x, got 1\.0\.0",
    ):
        nk.Trace(
            nodekit_version="1.0.0",
            graph=minimal_graph(),
            events=[nk.events.TraceStartedEvent(t=0)],
        )


def test_rejects_invalid_nodekit_version_string():
    with pytest.raises(pydantic.ValidationError, match="Invalid NodeKit version: not-a-version"):
        nk.Trace(
            nodekit_version="not-a-version",
            graph=minimal_graph(),
            events=[nk.events.TraceStartedEvent(t=0)],
        )


def test_accepts_older_prerelease_when_runtime_is_final(monkeypatch: pytest.MonkeyPatch):
    final_runtime = final_release_version()
    older_prerelease = prerelease_runtime_version()

    assert Version(older_prerelease) < Version(final_runtime)

    monkeypatch.setattr("nodekit._internal.version.VERSION", final_runtime)

    trace = nk.Trace(
        nodekit_version=older_prerelease,
        graph=minimal_graph(),
        events=[nk.events.TraceStartedEvent(t=0)],
    )

    assert trace.nodekit_version == older_prerelease


def test_rejects_final_release_when_runtime_is_prerelease(monkeypatch: pytest.MonkeyPatch):
    prerelease_runtime = prerelease_runtime_version()
    final_release = final_release_version()

    assert Version(final_release) > Version(prerelease_runtime)

    monkeypatch.setattr("nodekit._internal.version.VERSION", prerelease_runtime)

    with pytest.raises(
        pydantic.ValidationError,
        match=re.escape(
            f"Serialized NodeKit version {final_release} is newer than runtime version {prerelease_runtime}"
        ),
    ):
        nk.Trace(
            nodekit_version=final_release,
            graph=minimal_graph(nodekit_version=prerelease_runtime),
            events=[nk.events.TraceStartedEvent(t=0)],
        )


def test_rejects_newer_prerelease_when_runtime_is_prerelease(monkeypatch: pytest.MonkeyPatch):
    prerelease_runtime = prerelease_runtime_version()
    newer_prerelease = newer_prerelease_version()

    assert Version(newer_prerelease) > Version(prerelease_runtime)

    monkeypatch.setattr("nodekit._internal.version.VERSION", prerelease_runtime)

    with pytest.raises(
        pydantic.ValidationError,
        match=re.escape(
            f"Serialized NodeKit version {newer_prerelease} is newer than runtime version {prerelease_runtime}"
        ),
    ):
        nk.Trace(
            nodekit_version=newer_prerelease,
            graph=minimal_graph(nodekit_version=prerelease_runtime),
            events=[nk.events.TraceStartedEvent(t=0)],
        )


def test_requires_graph():
    with pytest.raises(pydantic.ValidationError, match="graph"):
        nk.Trace.model_validate(
            {
                "events": [
                    {
                        "event_type": "TraceStartedEvent",
                        "t": 0,
                    }
                ],
            }
        )


def test_preserves_event_order_instead_of_sorting_by_time():
    trace = nk.Trace(
        graph=minimal_graph(),
        events=[
            nk.events.TraceStartedEvent(t=1),
            nk.events.TraceEndedEvent(t=0),
        ],
    )

    assert [event.event_type for event in trace.events] == [
        nk.events.EventTypeEnum.TraceStartedEvent,
        nk.events.EventTypeEnum.TraceEndedEvent,
    ]


def test_graph_events_validate_and_roundtrip():
    event_adapter = pydantic.TypeAdapter(nk.events.Event)

    started = event_adapter.validate_python(
        {
            "event_type": "GraphStartedEvent",
            "t": 1,
            "graph_address": [],
        }
    )
    ended = event_adapter.validate_python(
        {
            "event_type": "GraphEndedEvent",
            "t": 2,
            "graph_address": ["trial"],
        }
    )

    assert isinstance(started, nk.events.GraphStartedEvent)
    assert isinstance(ended, nk.events.GraphEndedEvent)

    trace = nk.Trace(
        graph=minimal_graph(),
        events=[
            nk.events.TraceStartedEvent(t=0),
            started,
            ended,
            nk.events.TraceEndedEvent(t=3),
        ],
    )

    roundtripped = nk.Trace.model_validate_json(trace.model_dump_json())

    assert roundtripped.events == trace.events


def test_list_steps_pairs_node_lifecycle_events():
    graph = minimal_graph()
    first_action = nk.actions.WaitAction()
    second_action = nk.actions.WaitAction()

    trace = nk.Trace(
        graph=graph,
        events=[
            nk.events.TraceStartedEvent(t=0),
            nk.events.NodeStartedEvent(t=1, node_address=["start"]),
            nk.events.PointerSampledEvent(t=2, x=0, y=0, kind="move"),
            nk.events.ActionTakenEvent(t=3, node_address=["start"], action=first_action),
            nk.events.NodeEndedEvent(t=4, node_address=["start"]),
            nk.events.NodeStartedEvent(t=5, node_address=["start"]),
            nk.events.ActionTakenEvent(t=6, node_address=["start"], action=second_action),
            nk.events.NodeEndedEvent(t=7, node_address=["start"]),
            nk.events.TraceEndedEvent(t=8),
        ],
    )

    assert trace.list_steps() == [
        nk.StepRecord(
            step_index=0,
            node_address=["start"],
            action=first_action,
            t_start=1,
            t_action=3,
            t_end=4,
        ),
        nk.StepRecord(
            step_index=1,
            node_address=["start"],
            action=second_action,
            t_start=5,
            t_action=6,
            t_end=7,
        ),
    ]


def test_list_steps_rejects_node_start_before_action():
    trace = nk.Trace(
        graph=minimal_graph(),
        events=[
            nk.events.TraceStartedEvent(t=0),
            nk.events.NodeStartedEvent(t=1, node_address=["start"]),
            nk.events.NodeStartedEvent(t=2, node_address=["start"]),
            nk.events.TraceEndedEvent(t=3),
        ],
    )

    with pytest.raises(ValueError, match="NodeStartedEvent before the active Node ended"):
        trace.list_steps()


def test_list_steps_rejects_action_without_node_start():
    trace = nk.Trace(
        graph=minimal_graph(),
        events=[
            nk.events.TraceStartedEvent(t=0),
            nk.events.ActionTakenEvent(
                t=1,
                node_address=["start"],
                action=nk.actions.WaitAction(),
            ),
            nk.events.TraceEndedEvent(t=2),
        ],
    )

    with pytest.raises(ValueError, match="ActionTakenEvent without an active Node"):
        trace.list_steps()


def test_list_steps_rejects_node_end_before_action():
    trace = nk.Trace(
        graph=minimal_graph(),
        events=[
            nk.events.TraceStartedEvent(t=0),
            nk.events.NodeStartedEvent(t=1, node_address=["start"]),
            nk.events.NodeEndedEvent(t=2, node_address=["start"]),
            nk.events.TraceEndedEvent(t=3),
        ],
    )

    with pytest.raises(ValueError, match="NodeEndedEvent before ActionTakenEvent"):
        trace.list_steps()


def test_list_steps_rejects_mismatched_node_address():
    trace = nk.Trace(
        graph=minimal_graph(),
        events=[
            nk.events.TraceStartedEvent(t=0),
            nk.events.NodeStartedEvent(t=1, node_address=["start"]),
            nk.events.ActionTakenEvent(
                t=2,
                node_address=["other"],
                action=nk.actions.WaitAction(),
            ),
            nk.events.TraceEndedEvent(t=3),
        ],
    )

    with pytest.raises(ValueError, match="different Node than the active Node"):
        trace.list_steps()
