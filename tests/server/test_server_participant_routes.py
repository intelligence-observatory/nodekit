import base64
import datetime
import gzip
import re
import sys
from pathlib import Path
from types import ModuleType
from typing import Any
from urllib.parse import parse_qs, urlparse
from uuid import UUID

import sqlmodel
from fastapi.testclient import TestClient
from fastapi.staticfiles import StaticFiles

import nodekit as nk
from nodekit._internal.ops.build_site.types import NoPlatformContext
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
            "graph": graph.model_dump(mode="json"),
            "tags": [],
        },
    )
    response.raise_for_status()
    return response.json()


def _make_site_submission() -> nk.SiteSubmission:
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
        platform_context=NoPlatformContext(platform="NoPlatform"),
    )


def _get_records_and_engine() -> tuple[Any, Any]:
    return sys.modules["nodekit_server.records"], sys.modules["nodekit_server.deps"].engine


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
def test_site_redirect_adds_submit_url_and_preserves_query_params(
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
            ],
            follow_redirects=False,
        )

    assert response.status_code == 307
    location = response.headers["location"]
    parsed_location = urlparse(location)
    query = parse_qs(parsed_location.query)
    assert query["PROLIFIC_PID"] == ["participant-1"]
    assert query["STUDY_ID"] == ["study-1"]
    assert query["nodekitSubmitTo"] == [f"http://testserver/s/{site['site_id']}/submit"]


# %%
def test_site_html_contains_graph_payload_and_runtime_urls(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    graph = _make_graph()
    site = _create_site(authenticated_client, graph=graph)
    browser_bundle = get_browser_bundle()

    with TestClient(server_main.app) as client:
        response = client.get(
            f"/s/{site['site_id']}",
            params=[("nodekitSubmitTo", f"/s/{site['site_id']}/submit")],
        )

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/html")
    assert f"/runtime/nodekit.{browser_bundle.js_sha256}.js" in response.text
    assert f"/runtime/nodekit.{browser_bundle.css_sha256}.css" in response.text

    match = re.search(r"const graphGzB64 = `(?P<payload>.*?)`;", response.text, re.S)
    assert match is not None
    graph_gzip = base64.b64decode(re.sub(r"\s+", "", match.group("payload")))
    response_graph = nk.Graph.model_validate_json(gzip.decompress(graph_gzip).decode("utf-8"))
    assert response_graph == graph


# %%
def test_filesystem_artifact_site_redirect_preserves_query_and_freezes_runtime(
    authenticated_client: TestClient,
    graph_with_assets: nk.Graph,
    server_main: ModuleType,
    tmp_path: Path,
) -> None:
    previous_backend = server_main.settings.site_hosting_backend
    previous_store_dir = server_main.settings.site_store_dir
    site_store_dir = tmp_path / "site-store"
    site_store_dir.mkdir(parents=True)
    server_main.settings.site_hosting_backend = "filesystem"
    server_main.settings.site_store_dir = site_store_dir
    server_main.app.mount(
        "/site-artifacts",
        StaticFiles(directory=site_store_dir),
        name="test-site-artifacts",
    )

    try:
        _upload_graph_assets(authenticated_client, graph_with_assets)
        site = _create_site(authenticated_client, graph=graph_with_assets)

        records, engine = _get_records_and_engine()
        with sqlmodel.Session(engine) as session:
            site_record = session.get(records.SiteRecord, UUID(site["site_id"]))
            assert site_record is not None
            assert site_record.site_artifact_storage_key == f"sites/{site['site_id']}/index.html"
            assert site_record.site_artifact_url == (
                f"/site-artifacts/sites/{site['site_id']}/index.html"
            )
            assert site_record.runtime_js_sha256 is not None
            assert site_record.runtime_css_sha256 is not None

        artifact_path = site_store_dir / "sites" / site["site_id"] / "index.html"
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
                    ("batch", "one"),
                    ("batch", "two"),
                    ("nodekitSubmitTo", "https://old.example/submit"),
                ],
                follow_redirects=False,
            )

        assert response.status_code == 307
        parsed_location = urlparse(response.headers["location"])
        query = parse_qs(parsed_location.query)
        assert parsed_location.path == f"/site-artifacts/sites/{site['site_id']}/index.html"
        assert query["PROLIFIC_PID"] == ["participant-1"]
        assert query["batch"] == ["one", "two"]
        assert query["nodekitSubmitTo"] == [f"http://testserver/s/{site['site_id']}/submit"]
    finally:
        server_main.settings.site_hosting_backend = previous_backend
        server_main.settings.site_store_dir = previous_store_dir


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
            params=[("nodekitSubmitTo", f"/s/{site['site_id']}/submit")],
        )
        archived_submit_response = client.post(
            f"/s/{site['site_id']}/submit",
            json=_make_site_submission().model_dump(mode="json"),
        )
        missing_get_response = client.get(
            "/s/00000000-0000-0000-0000-000000000000",
            params=[("nodekitSubmitTo", "/s/00000000-0000-0000-0000-000000000000/submit")],
        )

    assert archived_get_response.status_code == 404
    assert archived_submit_response.status_code == 404
    assert missing_get_response.status_code == 404


# %%
def test_submit_run_accepts_bare_site_submission_and_creates_run(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    site = _create_site(authenticated_client)
    site_submission = _make_site_submission()

    with TestClient(server_main.app) as client:
        response = client.post(
            f"/s/{site['site_id']}/submit",
            json=site_submission.model_dump(mode="json"),
        )

    assert response.status_code == 200
    body = response.json()
    assert body["site_id"] == site["site_id"]
    assert body["status"] == RunStatus.SUBMITTED.value
    assert body["is_archived"] is False
    _assert_utc_timestamp(body["timestamp_created"])

    records, engine = _get_records_and_engine()
    with sqlmodel.Session(engine) as session:
        run_record = session.get(records.RunRecord, UUID(body["run_id"]))
        assert run_record is not None
        assert run_record.site_id == UUID(site["site_id"])
        assert run_record.status == RunStatus.SUBMITTED
        assert run_record.site_submission_json_gzip is not None
        stored_submission = nk.SiteSubmission.model_validate_json(
            gzip.decompress(run_record.site_submission_json_gzip).decode("utf-8")
        )
        assert stored_submission == site_submission

    get_run_response = authenticated_client.get(f"/runs/{body['run_id']}")
    assert get_run_response.status_code == 200
    assert get_run_response.json()["site_submission"] == site_submission.model_dump(mode="json")
