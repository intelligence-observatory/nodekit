import base64
import datetime
import gzip
import sys
from types import ModuleType
from typing import Any, TypedDict
from uuid import uuid4

import sqlmodel
from fastapi.testclient import TestClient

import nodekit as nk
from nodekit._internal.ops.build_site.types import (
    BaseMechanicalTurkContext,
    MechanicalTurkContext,
    NoPlatformContext,
    ProlificContext,
)
from nodekit.server.values import RunStatus
from nodekit.values import Platform


# %%
def _assert_utc_timestamp(value: str) -> None:
    parsed = datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
    assert parsed.utcoffset() == datetime.timedelta(0)


# %%
def _make_graph() -> nk.Graph:
    return nk.Graph(
        nodes={
            "start": nk.Node(
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            )
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )


def _gzip_graph_json(graph: nk.Graph) -> bytes:
    return gzip.compress(graph.model_dump_json().encode("utf-8"), mtime=0)


def _make_site_submission(
    platform_context: NoPlatformContext | ProlificContext | MechanicalTurkContext | None = None,
) -> nk.SiteSubmission:
    graph = _make_graph()
    trace = nk.Trace(
        graph=graph,
        events=[
            nk.events.TraceStartedEvent(t=0),
            nk.events.NodeStartedEvent(t=1, node_address=["start"]),
            nk.events.ActionTakenEvent(
                t=2,
                node_address=["start"],
                action=nk.actions.WaitAction(),
            ),
            nk.events.NodeEndedEvent(t=3, node_address=["start"]),
            nk.events.TraceEndedEvent(t=4),
        ],
    )
    trace_json_gzip = gzip.compress(trace.model_dump_json().encode("utf-8"), mtime=0)
    return nk.SiteSubmission(
        trace_gzipped_base64=base64.b64encode(trace_json_gzip).decode("ascii"),
        platform_context=platform_context or NoPlatformContext(platform="NoPlatform"),
    )


def _gzip_site_submission_json(site_submission: nk.SiteSubmission) -> bytes:
    return gzip.compress(site_submission.model_dump_json().encode("utf-8"), mtime=0)


class _RunRecruitmentContext(TypedDict):
    recruitment_platform: Platform
    recruiter_study_id: str | None
    recruiter_participant_id: str | None
    recruiter_session_id: str | None


def _recruitment_context(site_submission: nk.SiteSubmission) -> _RunRecruitmentContext:
    platform_context = site_submission.platform_context
    if isinstance(platform_context, ProlificContext):
        return {
            "recruitment_platform": platform_context.platform,
            "recruiter_study_id": platform_context.study_id,
            "recruiter_participant_id": platform_context.prolific_pid,
            "recruiter_session_id": platform_context.session_id,
        }
    if isinstance(platform_context, BaseMechanicalTurkContext):
        return {
            "recruitment_platform": platform_context.platform,
            "recruiter_study_id": platform_context.hit_id,
            "recruiter_participant_id": platform_context.worker_id,
            "recruiter_session_id": platform_context.assignment_id,
        }
    if isinstance(platform_context, NoPlatformContext):
        return {
            "recruitment_platform": platform_context.platform,
            "recruiter_study_id": None,
            "recruiter_participant_id": None,
            "recruiter_session_id": None,
        }
    raise ValueError(f"Unsupported platform context: {type(platform_context).__name__}.")


def _get_records_and_engine() -> tuple[Any, Any]:
    return sys.modules["nodekit_server.records"], sys.modules["nodekit_server.deps"].engine


def _get_bootstrap_user_id() -> Any:
    records, engine = _get_records_and_engine()
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(records.UserRecord).where(
            records.UserRecord.username == "admin"
        )
        user_record = session.exec(statement).one()
        return user_record.user_id


def _create_site_record(user_id: Any) -> Any:
    records, engine = _get_records_and_engine()
    graph = _make_graph()
    site_record = records.SiteRecord(
        site_id=uuid4(),
        user_id=user_id,
        graph_json_gzip=_gzip_graph_json(graph),
        is_archived=False,
    )
    with sqlmodel.Session(engine) as session:
        session.add(site_record)
        session.commit()
        session.refresh(site_record)
        return site_record


def _create_other_user_site_record() -> Any:
    records, engine = _get_records_and_engine()
    other_user = records.UserRecord(
        user_id=uuid4(),
        username=f"other-{uuid4()}",
        is_admin=False,
        is_archived=False,
    )
    graph = _make_graph()
    site_record = records.SiteRecord(
        site_id=uuid4(),
        user_id=other_user.user_id,
        graph_json_gzip=_gzip_graph_json(graph),
        is_archived=False,
    )
    with sqlmodel.Session(engine) as session:
        session.add(other_user)
        session.add(site_record)
        session.commit()
        session.refresh(site_record)
        return site_record


def _create_run_record(
    site_id: Any,
    *,
    status: RunStatus = RunStatus.STARTED,
    is_archived: bool = False,
    site_submission: nk.SiteSubmission | None = None,
) -> Any:
    records, engine = _get_records_and_engine()
    recruitment_context = (
        _recruitment_context(site_submission) if site_submission is not None else {}
    )
    run_record = records.RunRecord(
        run_id=uuid4(),
        site_id=site_id,
        status=status,
        **recruitment_context,
        site_submission_json_gzip=_gzip_site_submission_json(site_submission)
        if site_submission is not None
        else None,
        is_archived=is_archived,
    )
    with sqlmodel.Session(engine) as session:
        session.add(run_record)
        session.commit()
        session.refresh(run_record)
        return run_record


# %%
def test_run_routes_require_auth(server_main: ModuleType) -> None:
    with TestClient(server_main.app) as client:
        list_response = client.get("/runs")
        get_response = client.get(f"/runs/{uuid4()}")

    assert list_response.status_code == 401
    assert get_response.status_code == 401


# %%
def test_run_routes_scope_through_parent_site(authenticated_client: TestClient) -> None:
    user_id = _get_bootstrap_user_id()
    owned_site = _create_site_record(user_id=user_id)
    other_site = _create_other_user_site_record()
    owned_run = _create_run_record(site_id=owned_site.site_id)
    other_run = _create_run_record(site_id=other_site.site_id)

    get_owned_response = authenticated_client.get(f"/runs/{owned_run.run_id}")
    assert get_owned_response.status_code == 200

    get_other_response = authenticated_client.get(f"/runs/{other_run.run_id}")
    assert get_other_response.status_code == 404

    list_response = authenticated_client.get(
        "/runs",
        params=[
            ("run_ids", str(owned_run.run_id)),
            ("run_ids", str(other_run.run_id)),
        ],
    )
    assert list_response.status_code == 200
    assert [item["run_id"] for item in list_response.json()["items"]] == [str(owned_run.run_id)]


# %%
def test_list_runs_filters_and_paginates(authenticated_client: TestClient) -> None:
    user_id = _get_bootstrap_user_id()
    first_site = _create_site_record(user_id=user_id)
    second_site = _create_site_record(user_id=user_id)
    first_run = _create_run_record(site_id=first_site.site_id, status=RunStatus.STARTED)
    prolific_submission = _make_site_submission(
        ProlificContext(
            platform="Prolific",
            completion_code="complete-1",
            prolific_pid="pid-1",
            study_id="study-1",
            session_id="session-1",
        )
    )
    mturk_submission = _make_site_submission(
        MechanicalTurkContext(
            platform="MechanicalTurk",
            assignment_id="assignment-1",
            worker_id="worker-1",
            hit_id="hit-1",
            turk_submit_to="https://workersandbox.mturk.com/mturk/externalSubmit",
        )
    )
    second_run = _create_run_record(
        site_id=first_site.site_id,
        status=RunStatus.SUBMITTED,
        site_submission=prolific_submission,
    )
    third_run = _create_run_record(
        site_id=second_site.site_id,
        status=RunStatus.COMPLETED,
        site_submission=mturk_submission,
    )
    archived_run = _create_run_record(
        site_id=second_site.site_id,
        status=RunStatus.INVALID,
        is_archived=True,
    )

    site_response = authenticated_client.get(
        "/runs",
        params=[("site_id", str(first_site.site_id))],
    )
    assert site_response.status_code == 200
    assert {item["run_id"] for item in site_response.json()["items"]} == {
        str(first_run.run_id),
        str(second_run.run_id),
    }

    status_response = authenticated_client.get(
        "/runs",
        params=[("statuses", RunStatus.COMPLETED.value)],
    )
    assert status_response.status_code == 200
    assert [item["run_id"] for item in status_response.json()["items"]] == [str(third_run.run_id)]

    platform_response = authenticated_client.get(
        "/runs",
        params=[("recruitment_platforms", "Prolific")],
    )
    assert platform_response.status_code == 200
    platform_items = platform_response.json()["items"]
    assert [item["run_id"] for item in platform_items] == [str(second_run.run_id)]
    assert platform_items[0]["recruiter_study_id"] == "study-1"
    assert platform_items[0]["recruiter_participant_id"] == "pid-1"
    assert platform_items[0]["recruiter_session_id"] == "session-1"

    recruiter_context_response = authenticated_client.get(
        "/runs",
        params=[
            ("recruitment_platforms", "MechanicalTurk"),
            ("recruiter_study_ids", "hit-1"),
            ("recruiter_participant_ids", "worker-1"),
            ("recruiter_session_ids", "assignment-1"),
        ],
    )
    assert recruiter_context_response.status_code == 200
    recruiter_context_items = recruiter_context_response.json()["items"]
    assert [item["run_id"] for item in recruiter_context_items] == [str(third_run.run_id)]

    mismatched_context_response = authenticated_client.get(
        "/runs",
        params=[
            ("recruitment_platforms", "MechanicalTurk"),
            ("recruiter_participant_ids", "pid-1"),
        ],
    )
    assert mismatched_context_response.status_code == 200
    assert mismatched_context_response.json()["items"] == []

    default_archived_response = authenticated_client.get(
        "/runs",
        params=[("run_ids", str(archived_run.run_id))],
    )
    assert default_archived_response.status_code == 200
    assert default_archived_response.json()["items"] == []

    include_archived_response = authenticated_client.get(
        "/runs",
        params=[
            ("run_ids", str(archived_run.run_id)),
            ("include_archived", "true"),
        ],
    )
    assert include_archived_response.status_code == 200
    archived_items = include_archived_response.json()["items"]
    assert len(archived_items) == 1
    assert archived_items[0]["is_archived"] is True

    first_page_response = authenticated_client.get(
        "/runs",
        params=[
            ("run_ids", str(first_run.run_id)),
            ("run_ids", str(second_run.run_id)),
            ("max_items", "1"),
        ],
    )
    assert first_page_response.status_code == 200
    first_page = first_page_response.json()
    assert len(first_page["items"]) == 1
    assert first_page["next_page_cursor"] is not None

    second_page_response = authenticated_client.get(
        "/runs",
        params=[
            ("run_ids", str(first_run.run_id)),
            ("run_ids", str(second_run.run_id)),
            ("max_items", "1"),
            ("page_cursor", first_page["next_page_cursor"]),
        ],
    )
    assert second_page_response.status_code == 200
    second_page = second_page_response.json()
    assert len(second_page["items"]) == 1
    assert second_page["next_page_cursor"] is None
    assert {first_page["items"][0]["run_id"], second_page["items"][0]["run_id"]} == {
        str(first_run.run_id),
        str(second_run.run_id),
    }


# %%
def test_get_run_returns_compressed_submission_blob(
    authenticated_client: TestClient,
) -> None:
    user_id = _get_bootstrap_user_id()
    site = _create_site_record(user_id=user_id)
    site_submission = _make_site_submission()
    run = _create_run_record(
        site_id=site.site_id,
        status=RunStatus.SUBMITTED,
        site_submission=site_submission,
    )

    response = authenticated_client.get(f"/runs/{run.run_id}")

    assert response.status_code == 200
    body = response.json()
    assert body["run_id"] == str(run.run_id)
    assert body["status"] == RunStatus.SUBMITTED.value
    assert body["recruitment_platform"] == "NoPlatform"
    assert body["recruiter_study_id"] is None
    assert body["recruiter_participant_id"] is None
    assert body["recruiter_session_id"] is None
    assert "site_submission" not in body
    assert "trace" not in body
    returned_submission = nk.SiteSubmission.model_validate_json(
        gzip.decompress(base64.b64decode(body["site_submission_json_gzip"])).decode("utf-8")
    )
    assert returned_submission == site_submission
    _assert_utc_timestamp(body["timestamp_created"])


# %%
def test_get_run_returns_invalid_stored_submission_blob_without_validation(
    authenticated_client: TestClient,
) -> None:
    user_id = _get_bootstrap_user_id()
    site = _create_site_record(user_id=user_id)
    run = _create_run_record(
        site_id=site.site_id,
        status=RunStatus.SUBMITTED,
    )
    invalid_submission_json_gzip = gzip.compress(b'{"not": "a submission"}', mtime=0)
    records, engine = _get_records_and_engine()
    with sqlmodel.Session(engine) as session:
        run_record = session.get(records.RunRecord, run.run_id)
        assert run_record is not None
        run_record.site_submission_json_gzip = invalid_submission_json_gzip
        session.add(run_record)
        session.commit()

    response = authenticated_client.get(f"/runs/{run.run_id}")

    assert response.status_code == 200
    body = response.json()
    assert "site_submission" not in body
    assert "trace" not in body
    assert base64.b64decode(body["site_submission_json_gzip"]) == invalid_submission_json_gzip


# %%
def test_archive_run_hides_default_list_and_preserves_direct_get(
    authenticated_client: TestClient,
) -> None:
    user_id = _get_bootstrap_user_id()
    site = _create_site_record(user_id=user_id)
    run = _create_run_record(site_id=site.site_id)

    archive_response = authenticated_client.post(
        f"/runs/{run.run_id}/archive",
        json={"run_id": str(run.run_id)},
    )
    assert archive_response.status_code == 200
    assert archive_response.json()["is_archived"] is True

    default_list_response = authenticated_client.get(
        "/runs",
        params=[("run_ids", str(run.run_id))],
    )
    assert default_list_response.status_code == 200
    assert default_list_response.json()["items"] == []

    get_response = authenticated_client.get(f"/runs/{run.run_id}")
    assert get_response.status_code == 200
    assert get_response.json()["is_archived"] is True


# %%
def test_archive_run_rejects_path_body_mismatch(authenticated_client: TestClient) -> None:
    user_id = _get_bootstrap_user_id()
    site = _create_site_record(user_id=user_id)
    run = _create_run_record(site_id=site.site_id)

    response = authenticated_client.post(
        f"/runs/{run.run_id}/archive",
        json={"run_id": "00000000-0000-0000-0000-000000000000"},
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": "Path run_id does not match request body run_id.",
    }
