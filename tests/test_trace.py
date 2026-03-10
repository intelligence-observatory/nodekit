import re

import pydantic
import pytest

import nodekit as nk
from nodekit._internal.version import VERSION


def test_accepts_older_compatible_nodekit_version():
    trace = nk.Trace(
        nodekit_version="0.2.5",
        events=[nk.events.TraceStartedEvent(t=0)],
    )

    assert trace.nodekit_version == "0.2.5"


def test_rejects_newer_nodekit_version():
    with pytest.raises(
        pydantic.ValidationError,
        match=re.escape(
            f"Serialized NodeKit version 0.2.7 is newer than runtime version {VERSION}"
        ),
    ):
        nk.Trace(
            nodekit_version="0.2.7",
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
