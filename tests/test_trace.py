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


def test_accepts_older_compatible_nodekit_version():
    older = compatible_older_version()
    trace = nk.Trace(
        nodekit_version=older,
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
            events=[nk.events.TraceStartedEvent(t=0)],
        )


def test_rejects_incompatible_major_nodekit_version():
    with pytest.raises(
        pydantic.ValidationError,
        match=r"Incompatible NodeKit major version: expected 0\.x, got 1\.0\.0",
    ):
        nk.Trace(
            nodekit_version="1.0.0",
            events=[nk.events.TraceStartedEvent(t=0)],
        )


def test_rejects_invalid_nodekit_version_string():
    with pytest.raises(pydantic.ValidationError, match="Invalid NodeKit version: not-a-version"):
        nk.Trace(
            nodekit_version="not-a-version",
            events=[nk.events.TraceStartedEvent(t=0)],
        )


def test_accepts_older_prerelease_when_runtime_is_final():
    trace = nk.Trace(
        nodekit_version="0.2.6.dev1",
        events=[nk.events.TraceStartedEvent(t=0)],
    )

    assert trace.nodekit_version == "0.2.6.dev1"


def test_rejects_final_release_when_runtime_is_prerelease(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr("nodekit._internal.version.VERSION", "0.2.6.dev1")

    with pytest.raises(
        pydantic.ValidationError,
        match=re.escape(
            "Serialized NodeKit version 0.2.6 is newer than runtime version 0.2.6.dev1"
        ),
    ):
        nk.Trace(
            nodekit_version="0.2.6",
            events=[nk.events.TraceStartedEvent(t=0)],
        )


def test_rejects_newer_prerelease_when_runtime_is_prerelease(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr("nodekit._internal.version.VERSION", "0.2.6.dev1")

    with pytest.raises(
        pydantic.ValidationError,
        match=re.escape(
            "Serialized NodeKit version 0.2.6.dev2 is newer than runtime version 0.2.6.dev1"
        ),
    ):
        nk.Trace(
            nodekit_version="0.2.6.dev2",
            events=[nk.events.TraceStartedEvent(t=0)],
        )
