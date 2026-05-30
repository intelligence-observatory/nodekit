import re

import pydantic
import pytest
from packaging.version import Version

import nodekit as nk
from nodekit._internal.version import VERSION


def compatible_older_version() -> str:
    current = Version(VERSION)
    return f"{current.major}.{current.minor}.{max(current.micro - 1, 0)}"


def newer_same_major_version() -> str:
    current = Version(VERSION)
    return f"{current.major}.{current.minor}.{current.micro + 1}"


def final_release_version() -> str:
    return Version(VERSION).base_version


def prerelease_runtime_version() -> str:
    return f"{final_release_version()}.dev1"


def newer_prerelease_version() -> str:
    return f"{final_release_version()}.dev2"


def minimal_graph() -> nk.Graph:
    return nk.Graph(
        start="start",
        nodes={
            "start": nk.Node(sensor=nk.sensors.WaitSensor(duration_msec=1)),
        },
        transitions={
            "start": nk.transitions.End(),
        },
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
            graph=minimal_graph(),
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
            graph=minimal_graph(),
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
