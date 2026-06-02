import base64
import datetime
import gzip
import re
import sys
from pathlib import Path
from types import ModuleType
from typing import Any
from urllib.parse import parse_qs, urlparse
from uuid import UUID, uuid4

import sqlmodel
from fastapi.testclient import TestClient

import nodekit as nk
from nodekit._internal.ops.build_site.types import (
    MechanicalTurkContext,
    NoPlatformContext,
    ProlificContext,
)
from nodekit._internal.types.assets import FileSystemPath, URL
from nodekit._internal.utils.get_browser_bundle import get_browser_bundle
from nodekit._internal.utils.iter_assets import iter_assets
from nodekit.server.values import RunStatus


ASSET_DIR = Path(__file__).parents[1] / "assets"


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


def _create_site(
    authenticated_client: TestClient,
    graph: nk.Graph | None = None,
) -> dict[str, Any]:
    graph = graph or _make_graph()
    response = authenticated_client.post(
        "/sites",
        json={
            "conditions": {
                "default": {
                    "graph": graph.model_dump(mode="json"),
                    "allocation_weight": 1,
                }
            },
            "tags": [],
        },
    )
    response.raise_for_status()
    return response.json()


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


def _get_records_and_engine() -> tuple[Any, Any]:
    return sys.modules["nodekit_server.records"], sys.modules["nodekit_server.deps"].engine


def _run_id_from_submit_url(submit_url: str) -> UUID:
    path_parts = urlparse(submit_url).path.split("/")
    assert path_parts[:4] == ["", "s", path_parts[2], "runs"]
    assert path_parts[5:] == ["submit"]
    return UUID(path_parts[4])


def _start_no_platform_site(
    client: TestClient,
    site_id: str,
    participant_id: str = "participant-1",
) -> Any:
    return client.get(
        f"/s/{site_id}",
        params=[("nodekitParticipantId", participant_id)],
        follow_redirects=False,
    )


def _run_records_for_site(site_id: str) -> list[Any]:
    records, engine = _get_records_and_engine()
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(records.RunRecord).where(
            records.RunRecord.site_id == UUID(site_id)
        )
        statement = statement.order_by(
            records.RunRecord.timestamp_created, records.RunRecord.run_id
        )
        return list(session.exec(statement).all())


def _assignment_records_for_site(site_id: str) -> list[Any]:
    records, engine = _get_records_and_engine()
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(records.SiteAssignmentRecord).where(
            records.SiteAssignmentRecord.site_id == UUID(site_id)
        )
        statement = statement.order_by(
            records.SiteAssignmentRecord.timestamp_created,
            records.SiteAssignmentRecord.participant_id,
        )
        return list(session.exec(statement).all())


def _upload_graph_assets(client: TestClient, graph: nk.Graph) -> None:
    for asset in iter_assets(graph=graph):
        assert isinstance(asset.locator, FileSystemPath)
        asset_path = asset.locator.path
        client.post(
            "/assets",
            data={
                "sha256": asset.sha256,
                "media_type": asset.media_type,
            },
            files={
                "file": (
                    asset_path.name,
                    asset_path.read_bytes(),
                    asset.media_type,
                )
            },
        ).raise_for_status()


# %%
def test_runtime_routes_serve_hashed_bundles(server_main: ModuleType) -> None:
    browser_bundle = get_browser_bundle()

    with TestClient(server_main.app) as client:
        js_response = client.get(f"/runtime/nodekit.{browser_bundle.js_sha256}.js")
        css_response = client.get(f"/runtime/nodekit.{browser_bundle.css_sha256}.css")
        missing_response = client.get(f"/runtime/nodekit.{'0' * 64}.js")

    assert js_response.status_code == 200
    assert js_response.headers["cache-control"] == "public, max-age=31536000, immutable"
    assert js_response.headers["content-type"].startswith("application/javascript")
    assert browser_bundle.js[:80] in js_response.text

    assert css_response.status_code == 200
    assert css_response.headers["cache-control"] == "public, max-age=31536000, immutable"
    assert css_response.headers["content-type"].startswith("text/css")
    assert browser_bundle.css[:80] in css_response.text

    assert missing_response.status_code == 404


# %%
def test_asset_resolver_returns_uploaded_asset_without_auth(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    asset_path = ASSET_DIR / "fixation-cross.svg"
    asset = nk.assets.Image.from_path(asset_path)

    authenticated_client.post(
        "/assets",
        data={
            "sha256": asset.sha256,
            "media_type": asset.media_type,
        },
        files={
            "file": (
                asset_path.name,
                asset_path.read_bytes(),
                asset.media_type,
            )
        },
    ).raise_for_status()

    with TestClient(server_main.app) as client:
        asset_response = client.get(f"/assets/{asset.sha256}")
        missing_response = client.get(f"/assets/{'0' * 64}")

    assert asset_response.status_code == 200
    assert asset_response.content == asset_path.read_bytes()
    assert asset_response.headers["content-type"].startswith(asset.media_type)
    assert missing_response.status_code == 404


# %%
def test_site_redirect_creates_started_run_and_adds_run_submit_url(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)

    with TestClient(server_main.app) as client:
        bare_response = client.get(
            f"/s/{site['site_id']}",
            params=[
                ("cohort", "pilot"),
                ("nodekitSubmitTo", "https://old.example/submit"),
            ],
            follow_redirects=False,
        )
        assert bare_response.status_code == 307
        bare_location = urlparse(bare_response.headers["location"])
        bare_query = parse_qs(bare_location.query)
        assert bare_location.path == f"/s/{site['site_id']}"
        assert bare_query["cohort"] == ["pilot"]
        assert "nodekitSubmitTo" not in bare_query
        [nodekit_participant_id] = bare_query["nodekitParticipantId"]
        UUID(nodekit_participant_id)
        assert _run_records_for_site(site["site_id"]) == []

        response = client.get(
            f"/s/{site['site_id']}",
            params=[
                ("cohort", "pilot"),
                ("nodekitParticipantId", nodekit_participant_id),
            ],
            follow_redirects=False,
        )

    assert response.status_code == 307
    location = response.headers["location"]
    parsed_location = urlparse(location)
    query = parse_qs(parsed_location.query)
    assert parsed_location.path == (
        f"/site-artifacts/sites/{site['site_id']}/conditions/default/index.html"
    )
    assert query["cohort"] == ["pilot"]
    assert query["nodekitParticipantId"] == [nodekit_participant_id]
    [submit_url] = query["nodekitSubmitTo"]
    run_id = _run_id_from_submit_url(submit_url)
    assert submit_url == f"http://testserver/s/{site['site_id']}/runs/{run_id}/submit"

    [run_record] = _run_records_for_site(site["site_id"])
    assert run_record.run_id == run_id
    assert run_record.status == RunStatus.STARTED
    assert run_record.recruitment_platform == "NoPlatform"
    assert run_record.recruiter_study_id is None
    assert run_record.recruiter_participant_id == nodekit_participant_id
    assert run_record.recruiter_session_id is None
    assert run_record.site_submission_json_gzip is None
    assert run_record.timestamp_submitted is None


# %%
def test_site_condition_assignment_balances_weights_and_reuses_participants(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    response = authenticated_client.post(
        "/sites",
        json={
            "conditions": {
                "control": {
                    "graph": _make_graph().model_dump(mode="json"),
                    "allocation_weight": 1,
                },
                "treatment": {
                    "graph": _make_graph().model_dump(mode="json"),
                    "allocation_weight": 2,
                },
            },
            "tags": [],
        },
    )
    response.raise_for_status()
    site = response.json()

    participants = [f"participant-{index}" for index in range(6)]
    with TestClient(server_main.app) as client:
        for participant_id in participants:
            start_response = _start_no_platform_site(
                client=client,
                site_id=site["site_id"],
                participant_id=participant_id,
            )
            assert start_response.status_code == 307

        repeat_response = _start_no_platform_site(
            client=client,
            site_id=site["site_id"],
            participant_id=participants[0],
        )
        assert repeat_response.status_code == 307

    assignment_records = _assignment_records_for_site(site["site_id"])
    assert len(assignment_records) == 6
    assignment_counts = {
        condition_id: sum(
            assignment.condition_id == condition_id for assignment in assignment_records
        )
        for condition_id in ("control", "treatment")
    }
    assert assignment_counts == {"control": 2, "treatment": 4}

    run_records = _run_records_for_site(site["site_id"])
    assert len(run_records) == 7
    first_assignment = next(
        assignment
        for assignment in assignment_records
        if assignment.participant_id == participants[0]
    )
    first_participant_runs = [
        run for run in run_records if run.recruiter_participant_id == participants[0]
    ]
    assert len(first_participant_runs) == 2
    assert {run.condition_id for run in first_participant_runs} == {first_assignment.condition_id}


# %%
def test_site_redirect_infers_prolific_started_run(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)

    with TestClient(server_main.app) as client:
        response = client.get(
            f"/s/{site['site_id']}",
            params=[
                ("PROLIFIC_PID", "participant-1"),
                ("STUDY_ID", "study-1"),
                ("SESSION_ID", "session-1"),
                ("prolificCompletionCode", "complete-1"),
                ("nodekitParticipantId", "ignored-nodekit-participant"),
            ],
            follow_redirects=False,
        )

    assert response.status_code == 307
    query = parse_qs(urlparse(response.headers["location"]).query)
    assert query["PROLIFIC_PID"] == ["participant-1"]
    assert query["STUDY_ID"] == ["study-1"]
    assert query["SESSION_ID"] == ["session-1"]
    assert query["prolificCompletionCode"] == ["complete-1"]
    [run_record] = _run_records_for_site(site["site_id"])
    assert run_record.status == RunStatus.STARTED
    assert run_record.recruitment_platform == "Prolific"
    assert run_record.recruiter_study_id == "study-1"
    assert run_record.recruiter_participant_id == "participant-1"
    assert run_record.recruiter_session_id == "session-1"


# %%
def test_site_redirect_infers_mturk_started_run(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)
    cases = [
        ("https://www.mturk.com/mturk/externalSubmit", "MechanicalTurk"),
        ("https://workersandbox.mturk.com/mturk/externalSubmit", "MechanicalTurkSandbox"),
    ]

    for index, (turk_submit_to, _expected_platform) in enumerate(cases):
        with TestClient(server_main.app) as client:
            response = client.get(
                f"/s/{site['site_id']}",
                params=[
                    ("assignmentId", f"assignment-{index}"),
                    ("hitId", f"hit-{index}"),
                    ("workerId", f"worker-{index}"),
                    ("turkSubmitTo", turk_submit_to),
                    ("nodekitParticipantId", "ignored-nodekit-participant"),
                ],
                follow_redirects=False,
            )

        assert response.status_code == 307

    run_records = _run_records_for_site(site["site_id"])
    assert {
        (
            run.recruitment_platform,
            run.recruiter_study_id,
            run.recruiter_participant_id,
            run.recruiter_session_id,
        )
        for run in run_records
    } == {
        ("MechanicalTurk", "hit-0", "worker-0", "assignment-0"),
        ("MechanicalTurkSandbox", "hit-1", "worker-1", "assignment-1"),
    }


# %%
def test_mturk_preview_redirect_creates_no_run(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)

    with TestClient(server_main.app) as client:
        response = client.get(
            f"/s/{site['site_id']}",
            params=[("assignmentId", "ASSIGNMENT_ID_NOT_AVAILABLE")],
            follow_redirects=False,
        )

    assert response.status_code == 307
    query = parse_qs(urlparse(response.headers["location"]).query)
    assert "nodekitSubmitTo" not in query
    assert _run_records_for_site(site["site_id"]) == []


# %%
def test_bad_platform_start_params_return_400(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)

    with TestClient(server_main.app) as client:
        missing_prolific_response = client.get(
            f"/s/{site['site_id']}",
            params=[("PROLIFIC_PID", "participant-1")],
            follow_redirects=False,
        )
        mixed_platform_response = client.get(
            f"/s/{site['site_id']}",
            params=[
                ("PROLIFIC_PID", "participant-1"),
                ("STUDY_ID", "study-1"),
                ("SESSION_ID", "session-1"),
                ("prolificCompletionCode", "complete-1"),
                ("assignmentId", "assignment-1"),
            ],
            follow_redirects=False,
        )
        unknown_mturk_host_response = client.get(
            f"/s/{site['site_id']}",
            params=[
                ("assignmentId", "assignment-1"),
                ("hitId", "hit-1"),
                ("workerId", "worker-1"),
                ("turkSubmitTo", "https://example.com/submit"),
            ],
            follow_redirects=False,
        )

    assert missing_prolific_response.status_code == 400
    assert mixed_platform_response.status_code == 400
    assert unknown_mturk_host_response.status_code == 400
    assert _run_records_for_site(site["site_id"]) == []


# %%
def test_filesystem_artifact_site_redirect_preserves_query_and_freezes_runtime(
    authenticated_client: TestClient,
    graph_with_assets: nk.Graph,
    server_main: ModuleType,
) -> None:
    _upload_graph_assets(authenticated_client, graph_with_assets)
    site = _create_site(authenticated_client, graph=graph_with_assets)

    records, engine = _get_records_and_engine()
    with sqlmodel.Session(engine) as session:
        site_record = session.get(records.SiteRecord, UUID(site["site_id"]))
        assert site_record is not None
        condition_record = session.get(
            records.SiteConditionRecord,
            (UUID(site["site_id"]), "default"),
        )
        assert condition_record is not None
        assert condition_record.site_artifact_storage_key == (
            f"sites/{site['site_id']}/conditions/default/index.html"
        )
        assert condition_record.site_artifact_url == (
            f"/site-artifacts/sites/{site['site_id']}/conditions/default/index.html"
        )
        assert condition_record.runtime_js_sha256 is not None
        assert condition_record.runtime_css_sha256 is not None

    artifact_path = (
        server_main.settings.site_store_dir
        / "sites"
        / site["site_id"]
        / "conditions"
        / "default"
        / "index.html"
    )
    html = artifact_path.read_text()
    browser_bundle = get_browser_bundle()
    assert f"/site-artifacts/runtime/nodekit.{browser_bundle.js_sha256}.js" in html
    assert f"/site-artifacts/runtime/nodekit.{browser_bundle.css_sha256}.css" in html
    assert f'src="/runtime/nodekit.{browser_bundle.js_sha256}.js"' not in html

    match = re.search(r"const graphGzB64 = `(?P<payload>.*?)`;", html, re.S)
    assert match is not None
    graph_gzip = base64.b64decode(re.sub(r"\s+", "", match.group("payload")))
    frozen_graph = nk.Graph.model_validate_json(gzip.decompress(graph_gzip).decode("utf-8"))
    for asset in iter_assets(frozen_graph):
        assert isinstance(asset.locator, URL)
        assert asset.locator.url == f"http://testserver/assets/{asset.sha256}"

    with TestClient(server_main.app) as client:
        response = client.get(
            f"/s/{site['site_id']}",
            params=[
                ("PROLIFIC_PID", "participant-1"),
                ("STUDY_ID", "study-1"),
                ("SESSION_ID", "session-1"),
                ("prolificCompletionCode", "complete-1"),
                ("batch", "one"),
                ("batch", "two"),
                ("nodekitSubmitTo", "https://old.example/submit"),
            ],
            follow_redirects=False,
        )

    assert response.status_code == 307
    parsed_location = urlparse(response.headers["location"])
    query = parse_qs(parsed_location.query)
    assert parsed_location.path == (
        f"/site-artifacts/sites/{site['site_id']}/conditions/default/index.html"
    )
    assert query["PROLIFIC_PID"] == ["participant-1"]
    assert query["STUDY_ID"] == ["study-1"]
    assert query["SESSION_ID"] == ["session-1"]
    assert query["prolificCompletionCode"] == ["complete-1"]
    assert query["batch"] == ["one", "two"]
    [submit_url] = query["nodekitSubmitTo"]
    run_id = _run_id_from_submit_url(submit_url)
    assert submit_url == f"http://testserver/s/{site['site_id']}/runs/{run_id}/submit"


# %%
def test_site_without_frozen_artifact_does_not_fall_back_to_dynamic_render(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)
    records, engine = _get_records_and_engine()
    with sqlmodel.Session(engine) as session:
        condition_record = session.get(
            records.SiteConditionRecord,
            (UUID(site["site_id"]), "default"),
        )
        assert condition_record is not None
        condition_record.site_artifact_url = None
        session.add(condition_record)
        session.commit()

    with TestClient(server_main.app) as client:
        response = client.get(
            f"/s/{site['site_id']}",
            params=[("nodekitSubmitTo", f"/s/{site['site_id']}/submit")],
        )

    assert response.status_code == 500
    assert response.json() == {"detail": "Site Condition is missing a frozen artifact URL."}


# %%
def test_missing_and_archived_site_return_404(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)
    authenticated_client.post(
        f"/sites/{site['site_id']}/archive",
        json={"site_id": site["site_id"]},
    ).raise_for_status()

    with TestClient(server_main.app) as client:
        archived_get_response = client.get(
            f"/s/{site['site_id']}",
        )
        archived_submit_response = client.post(
            f"/s/{site['site_id']}/runs/{uuid4()}/submit",
            json=_make_site_submission().model_dump(mode="json"),
        )
        missing_get_response = client.get(
            "/s/00000000-0000-0000-0000-000000000000",
        )

    assert archived_get_response.status_code == 404
    assert archived_submit_response.status_code == 404
    assert missing_get_response.status_code == 404


# %%
def test_submit_run_updates_started_run(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)
    site_submission = _make_site_submission()

    with TestClient(server_main.app) as client:
        start_response = client.get(f"/s/{site['site_id']}", follow_redirects=False)
        assert start_response.status_code == 307
        participant_query = parse_qs(urlparse(start_response.headers["location"]).query)
        [nodekit_participant_id] = participant_query["nodekitParticipantId"]
        artifact_response = _start_no_platform_site(
            client=client,
            site_id=site["site_id"],
            participant_id=nodekit_participant_id,
        )
        assert artifact_response.status_code == 307
        artifact_query = parse_qs(urlparse(artifact_response.headers["location"]).query)
        run_id = _run_id_from_submit_url(artifact_query["nodekitSubmitTo"][0])
        response = client.post(
            f"/s/{site['site_id']}/runs/{run_id}/submit",
            json=site_submission.model_dump(mode="json"),
        )

    assert response.status_code == 200
    body = response.json()
    assert body["site_id"] == site["site_id"]
    assert body["status"] == RunStatus.SUBMITTED.value
    assert body["recruitment_platform"] == "NoPlatform"
    assert body["recruiter_study_id"] is None
    assert body["recruiter_participant_id"] == nodekit_participant_id
    assert body["recruiter_session_id"] is None
    assert body["is_archived"] is False
    _assert_utc_timestamp(body["timestamp_created"])
    _assert_utc_timestamp(body["timestamp_submitted"])

    records, engine = _get_records_and_engine()
    with sqlmodel.Session(engine) as session:
        run_record = session.get(records.RunRecord, run_id)
        assert run_record is not None
        assert run_record.site_id == UUID(site["site_id"])
        assert run_record.status == RunStatus.SUBMITTED
        assert run_record.recruitment_platform == "NoPlatform"
        assert run_record.recruiter_study_id is None
        assert run_record.recruiter_participant_id == nodekit_participant_id
        assert run_record.recruiter_session_id is None
        assert run_record.site_submission_json_gzip is not None
        assert run_record.timestamp_submitted is not None
        stored_submission = nk.SiteSubmission.model_validate_json(
            gzip.decompress(run_record.site_submission_json_gzip).decode("utf-8")
        )
        assert stored_submission == site_submission

    get_run_response = authenticated_client.get(f"/runs/{body['run_id']}")
    assert get_run_response.status_code == 200
    returned_submission = nk.SiteSubmission.model_validate_json(
        gzip.decompress(
            base64.b64decode(get_run_response.json()["site_submission_json_gzip"])
        ).decode("utf-8")
    )
    assert returned_submission == site_submission


# %%
def test_run_specific_submit_rejects_missing_wrong_site_and_duplicate_runs(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    first_site = _create_site(authenticated_client)
    second_site = _create_site(authenticated_client)
    site_submission = _make_site_submission()

    with TestClient(server_main.app) as client:
        start_response = _start_no_platform_site(client=client, site_id=first_site["site_id"])
        assert start_response.status_code == 307
        start_query = parse_qs(urlparse(start_response.headers["location"]).query)
        run_id = _run_id_from_submit_url(start_query["nodekitSubmitTo"][0])
        missing_run_response = client.post(
            f"/s/{first_site['site_id']}/runs/{uuid4()}/submit",
            json=site_submission.model_dump(mode="json"),
        )
        wrong_site_response = client.post(
            f"/s/{second_site['site_id']}/runs/{run_id}/submit",
            json=site_submission.model_dump(mode="json"),
        )
        first_submit_response = client.post(
            f"/s/{first_site['site_id']}/runs/{run_id}/submit",
            json=site_submission.model_dump(mode="json"),
        )
        duplicate_submit_response = client.post(
            f"/s/{first_site['site_id']}/runs/{run_id}/submit",
            json=site_submission.model_dump(mode="json"),
        )
        old_submit_response = client.post(
            f"/s/{first_site['site_id']}/submit",
            json=site_submission.model_dump(mode="json"),
        )

    assert missing_run_response.status_code == 404
    assert wrong_site_response.status_code == 404
    assert first_submit_response.status_code == 200
    assert duplicate_submit_response.status_code == 409
    assert old_submit_response.status_code == 404


# %%
def test_submit_run_stores_recruitment_context(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)
    cases = [
        (
            _make_site_submission(
                ProlificContext(
                    platform="Prolific",
                    completion_code="complete-1",
                    prolific_pid="pid-1",
                    study_id="study-1",
                    session_id="session-1",
                )
            ),
            {
                "recruitment_platform": "Prolific",
                "recruiter_study_id": "study-1",
                "recruiter_participant_id": "pid-1",
                "recruiter_session_id": "session-1",
            },
        ),
        (
            _make_site_submission(
                MechanicalTurkContext(
                    platform="MechanicalTurk",
                    assignment_id="assignment-1",
                    worker_id="worker-1",
                    hit_id="hit-1",
                    turk_submit_to="https://workersandbox.mturk.com/mturk/externalSubmit",
                )
            ),
            {
                "recruitment_platform": "MechanicalTurk",
                "recruiter_study_id": "hit-1",
                "recruiter_participant_id": "worker-1",
                "recruiter_session_id": "assignment-1",
            },
        ),
    ]

    with TestClient(server_main.app) as client:
        responses = []
        for site_submission, _expected in cases:
            start_response = _start_no_platform_site(client=client, site_id=site["site_id"])
            assert start_response.status_code == 307
            start_query = parse_qs(urlparse(start_response.headers["location"]).query)
            run_id = _run_id_from_submit_url(start_query["nodekitSubmitTo"][0])
            responses.append(
                client.post(
                    f"/s/{site['site_id']}/runs/{run_id}/submit",
                    json=site_submission.model_dump(mode="json"),
                )
            )

    records, engine = _get_records_and_engine()
    for response, (_site_submission, expected) in zip(responses, cases, strict=True):
        assert response.status_code == 200
        body = response.json()
        assert {key: body[key] for key in expected} == expected
        with sqlmodel.Session(engine) as session:
            run_record = session.get(records.RunRecord, UUID(body["run_id"]))
            assert run_record is not None
            assert run_record.recruitment_platform == expected["recruitment_platform"]
            assert run_record.recruiter_study_id == expected["recruiter_study_id"]
            assert run_record.recruiter_participant_id == expected["recruiter_participant_id"]
            assert run_record.recruiter_session_id == expected["recruiter_session_id"]
