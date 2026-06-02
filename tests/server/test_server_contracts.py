import base64
import datetime
import gzip
from uuid import uuid4

import pydantic
import pytest

import nodekit as nk
from nodekit._internal.ops.build_site.types import NoPlatformContext
import nodekit.server.contracts as contracts
from nodekit.server.values import RunStatus


TIMESTAMP_CREATED = datetime.datetime(2026, 5, 31, tzinfo=datetime.UTC)


# %%
def _make_graph() -> nk.Graph:
    return nk.Graph(
        nodes={
            "start": nk.Node(
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )


def _make_site_submission(graph: nk.Graph) -> nk.SiteSubmission:
    trace = nk.Trace(
        graph=graph,
        events=[
            nk.events.TraceStartedEvent(t=0),
            nk.events.TraceEndedEvent(t=1),
        ],
    )
    trace_json_gzip = gzip.compress(trace.model_dump_json().encode("utf-8"), mtime=0)
    return nk.SiteSubmission(
        trace_gzipped_base64=base64.b64encode(trace_json_gzip).decode("ascii"),
        platform_context=NoPlatformContext(platform="NoPlatform"),
    )


def _json_gzip_b64(json_value: str) -> str:
    return base64.b64encode(gzip.compress(json_value.encode("utf-8"), mtime=0)).decode("ascii")


# %%
def test_get_site_response_serializes_blob_and_validates_graph_lazily() -> None:
    graph = _make_graph()
    response = contracts.GetSiteResponse(
        site_id=uuid4(),
        user_id=uuid4(),
        url="https://nodekit.example/s/site",
        is_archived=False,
        timestamp_created=TIMESTAMP_CREATED,
        graph_json_gzip=_json_gzip_b64(graph.model_dump_json()),
    )

    dumped = response.model_dump(mode="json")
    assert "graph_json_gzip" in dumped
    assert "graph" not in dumped
    assert response.model_dump_json()
    assert response.graph == graph
    assert response.graph is response.graph


def test_get_run_response_serializes_blob_and_validates_submission_lazily() -> None:
    graph = _make_graph()
    site_submission = _make_site_submission(graph)
    response = contracts.GetRunResponse(
        run_id=uuid4(),
        site_id=uuid4(),
        status=RunStatus.SUBMITTED,
        is_archived=False,
        timestamp_created=TIMESTAMP_CREATED,
        site_submission_json_gzip=_json_gzip_b64(site_submission.model_dump_json()),
    )

    dumped = response.model_dump(mode="json")
    assert "site_submission_json_gzip" in dumped
    assert "site_submission" not in dumped
    assert "trace" not in dumped
    assert response.model_dump_json()
    assert response.site_submission == site_submission
    assert response.site_submission is response.site_submission


def test_lazy_blob_properties_raise_validation_error_for_invalid_payloads() -> None:
    site_response = contracts.GetSiteResponse(
        site_id=uuid4(),
        user_id=uuid4(),
        url="https://nodekit.example/s/site",
        is_archived=False,
        timestamp_created=TIMESTAMP_CREATED,
        graph_json_gzip=_json_gzip_b64('{"not": "a graph"}'),
    )
    run_response = contracts.GetRunResponse(
        run_id=uuid4(),
        site_id=uuid4(),
        status=RunStatus.SUBMITTED,
        is_archived=False,
        timestamp_created=TIMESTAMP_CREATED,
        site_submission_json_gzip=_json_gzip_b64('{"not": "a submission"}'),
    )

    with pytest.raises(pydantic.ValidationError):
        _ = site_response.graph
    with pytest.raises(pydantic.ValidationError):
        _ = run_response.site_submission
