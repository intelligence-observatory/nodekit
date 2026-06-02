import base64
import datetime
import gzip
from pathlib import Path
from typing import Any
from uuid import uuid4

import httpx
from fastapi.testclient import TestClient

import nodekit as nk
from nodekit._internal.ops.build_site.types import NoPlatformContext
from nodekit.server.dashboard.app import create_dashboard_app
from nodekit.server.dashboard.cache import (
    _DashboardCache,
    clear_dashboard_cache,
    dashboard_scope_key,
    resolve_dashboard_cache_root,
)
import nodekit.server as nk_server
import nodekit.server.contracts as contracts
from nodekit.server.values import RunStatus


TIMESTAMP_CREATED = datetime.datetime(2026, 5, 31, tzinfo=datetime.UTC).isoformat()


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


def _json_response(payload: dict[str, Any]) -> httpx.Response:
    return httpx.Response(200, json=payload)


# %%
def test_dashboard_cache_path_resolution(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    env_cache_root = tmp_path / "env-cache"
    explicit_cache_root = tmp_path / "explicit-cache"

    monkeypatch.setenv("NODEKIT_DASHBOARD_CACHE_DIR", str(env_cache_root))
    assert resolve_dashboard_cache_root() == env_cache_root.resolve()
    assert resolve_dashboard_cache_root(explicit_cache_root) == explicit_cache_root.resolve()

    cache = _DashboardCache(client=None, cache_dir=explicit_cache_root)
    assert cache.db_path == explicit_cache_root.resolve() / "local" / "dashboard.sqlite"

    clear_dashboard_cache(cache_dir=explicit_cache_root)
    assert not explicit_cache_root.exists()


def test_dashboard_ops_are_available_under_nodekit_server() -> None:
    assert nk.server.start_dashboard is nk.start_dashboard
    assert nk.server.clear_dashboard_cache is nk.clear_dashboard_cache


def test_dashboard_cache_scope_isolates_clients_and_never_writes_raw_token(
    tmp_path: Path,
) -> None:
    graph = _make_graph()
    site_id = uuid4()
    user_id = uuid4()
    run_id = uuid4()
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(request.url.path)
        if request.url.path == "/sites":
            return _json_response(
                {
                    "items": [
                        {
                            "site_id": str(site_id),
                            "user_id": str(user_id),
                            "url": f"https://nodekit.example/s/{site_id}",
                            "tags": ["pilot"],
                            "is_archived": False,
                            "timestamp_created": TIMESTAMP_CREATED,
                        }
                    ],
                    "next_page_cursor": None,
                }
            )
        if request.url.path == "/tags":
            return _json_response(
                {
                    "items": [
                        {
                            "name": "pilot",
                            "is_archived": False,
                            "timestamp_created": TIMESTAMP_CREATED,
                        }
                    ],
                    "next_page_cursor": None,
                }
            )
        if request.url.path == "/runs":
            return _json_response(
                {
                    "items": [
                        {
                            "run_id": str(run_id),
                            "site_id": str(site_id),
                            "status": RunStatus.SUBMITTED.value,
                            "is_archived": False,
                            "timestamp_created": TIMESTAMP_CREATED,
                        }
                    ],
                    "next_page_cursor": None,
                }
            )
        if request.url.path == f"/runs/{run_id}":
            return _json_response(
                {
                    "run_id": str(run_id),
                    "site_id": str(site_id),
                    "status": RunStatus.SUBMITTED.value,
                    "is_archived": False,
                    "timestamp_created": TIMESTAMP_CREATED,
                    "site_submission": None,
                    "trace": None,
                }
            )
        if request.url.path == f"/sites/{site_id}":
            return _json_response(
                {
                    "site_id": str(site_id),
                    "user_id": str(user_id),
                    "url": f"https://nodekit.example/s/{site_id}",
                    "tags": ["pilot"],
                    "is_archived": False,
                    "timestamp_created": TIMESTAMP_CREATED,
                    "graph": graph.model_dump(mode="json"),
                    "assets": [],
                }
            )
        raise AssertionError(request.url)

    first_client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret-token-one",
        transport=httpx.MockTransport(handler),
    )
    second_client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret-token-two",
        transport=httpx.MockTransport(handler),
    )

    first_cache = _DashboardCache(client=first_client, cache_dir=tmp_path)
    second_cache = _DashboardCache(client=second_client, cache_dir=tmp_path)

    assert dashboard_scope_key(first_client) != dashboard_scope_key(second_client)
    assert first_cache.db_path != second_cache.db_path

    first_cache.refresh_all()
    first_cache.refresh_site(site_id=site_id)
    assert calls == ["/sites", "/tags", "/runs", f"/runs/{run_id}", f"/sites/{site_id}"]
    assert (
        first_cache.read_item(
            kind="run-detail",
            key=str(run_id),
            response_type=contracts.GetRunResponse,
        )
        is not None
    )

    for path in tmp_path.rglob("*"):
        assert "secret-token-one" not in str(path)
        if path.is_file():
            assert b"secret-token-one" not in path.read_bytes()


def test_dashboard_cache_round_trips_site_and_run_detail(
    tmp_path: Path,
) -> None:
    graph = _make_graph()
    site_id = uuid4()
    user_id = uuid4()
    run_id = uuid4()
    site_submission = _make_site_submission(graph)

    cache = _DashboardCache(client=None, cache_dir=tmp_path)
    cache.store_site_detail(
        contracts.GetSiteResponse(
            site_id=site_id,
            user_id=user_id,
            url=f"https://nodekit.example/s/{site_id}",
            tags=("pilot",),
            is_archived=False,
            timestamp_created=datetime.datetime.fromisoformat(TIMESTAMP_CREATED),
            graph=graph,
            assets=(),
        )
    )
    cache.store_run_detail(
        contracts.GetRunResponse(
            run_id=run_id,
            site_id=site_id,
            status=RunStatus.SUBMITTED,
            is_archived=False,
            timestamp_created=datetime.datetime.fromisoformat(TIMESTAMP_CREATED),
            site_submission=site_submission,
            trace=site_submission.trace,
        )
    )

    cached_site = cache.read_item(
        kind="site-detail",
        key=str(site_id),
        response_type=contracts.GetSiteResponse,
    )
    cached_run = cache.read_item(
        kind="run-detail",
        key=str(run_id),
        response_type=contracts.GetRunResponse,
    )

    assert cached_site is not None
    assert cached_site.graph == graph
    assert cached_run is not None
    assert cached_run.site_submission == site_submission
    assert cached_run.trace == site_submission.trace


def test_dashboard_stub_does_not_contact_server_until_manual_refresh(
    tmp_path: Path,
) -> None:
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(request.url.path)
        if request.url.path in {"/sites", "/tags", "/runs"}:
            return _json_response({"items": [], "next_page_cursor": None})
        raise AssertionError(request.url)

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )
    cache = _DashboardCache(client=client, cache_dir=tmp_path)
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        response = dashboard_client.get("/")
        assert response.status_code == 200
        assert "NodeKit Dashboard" in response.text

        for path in ("/api/status", "/api/sites", "/api/tags", "/api/runs"):
            response = dashboard_client.get(path)
            assert response.status_code == 200

        assert calls == []

        response = dashboard_client.post("/api/refresh")
        assert response.status_code == 200

    assert calls == ["/sites", "/tags", "/runs"]


def test_dashboard_serves_built_static_assets_without_contacting_server(
    tmp_path: Path,
) -> None:
    calls: list[str] = []
    static_dir = tmp_path / "static"
    assets_dir = static_dir / "assets"
    assets_dir.mkdir(parents=True)
    (static_dir / "index.html").write_text(
        '<!doctype html><script type="module" src="/dashboard-static/assets/app.js"></script>'
    )
    (assets_dir / "app.js").write_text("globalThis.__nodekitDashboardLoaded = true;")

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(request.url.path)
        return _json_response({"items": [], "next_page_cursor": None})

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )
    cache = _DashboardCache(client=client, cache_dir=tmp_path)
    app = create_dashboard_app(cache=cache, static_dir=static_dir)

    with TestClient(app) as dashboard_client:
        index_response = dashboard_client.get("/")
        asset_response = dashboard_client.get("/dashboard-static/assets/app.js")

    assert index_response.status_code == 200
    assert "/dashboard-static/assets/app.js" in index_response.text
    assert asset_response.status_code == 200
    assert calls == []


def test_dashboard_health_endpoint_reports_disconnected_without_client(
    tmp_path: Path,
) -> None:
    cache = _DashboardCache(client=None, cache_dir=tmp_path)
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        response = dashboard_client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "disconnected"
    assert "checked_at" in response.json()


def test_dashboard_health_endpoint_proxies_client_health(
    tmp_path: Path,
) -> None:
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(request.url.path)
        if request.url.path == "/health":
            return _json_response({"status": "ok"})
        raise AssertionError(request.url)

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )
    cache = _DashboardCache(client=client, cache_dir=tmp_path)
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        response = dashboard_client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert calls == ["/health"]


def test_dashboard_health_endpoint_reports_unreachable(
    tmp_path: Path,
) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("could not connect", request=request)

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )
    cache = _DashboardCache(client=client, cache_dir=tmp_path)
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        response = dashboard_client.get("/api/health")

    assert response.status_code == 502
    assert response.json()["status"] == "unreachable"
    assert "could not connect" in response.json()["message"]


def test_dashboard_manual_refresh_returns_structured_gateway_error(
    tmp_path: Path,
) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("could not connect", request=request)

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )
    cache = _DashboardCache(client=client, cache_dir=tmp_path)
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        response = dashboard_client.post("/api/refresh")

    assert response.status_code == 502
    assert response.json()["detail"]["error"] == "refresh_failed"


def test_dashboard_runs_endpoint_excludes_archived_cached_runs(
    tmp_path: Path,
) -> None:
    site_id = uuid4()
    visible_run_id = uuid4()
    archived_run_id = uuid4()
    cache = _DashboardCache(client=None, cache_dir=tmp_path)
    for run_id, is_archived in (
        (visible_run_id, False),
        (archived_run_id, True),
    ):
        cache.upsert_item(
            kind="run",
            key=str(run_id),
            payload=contracts.ListRunsItem(
                run_id=run_id,
                site_id=site_id,
                status=RunStatus.SUBMITTED,
                is_archived=is_archived,
                timestamp_created=datetime.datetime.fromisoformat(TIMESTAMP_CREATED),
            ),
        )
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        response = dashboard_client.get("/api/runs")

    assert response.status_code == 200
    assert [item["run_id"] for item in response.json()] == [str(visible_run_id)]


def test_dashboard_runs_endpoint_includes_cached_detail_summary(
    tmp_path: Path,
) -> None:
    graph = _make_graph()
    site_id = uuid4()
    run_id = uuid4()
    site_submission = _make_site_submission(graph)
    cache = _DashboardCache(client=None, cache_dir=tmp_path)
    cache.store_run_detail(
        contracts.GetRunResponse(
            run_id=run_id,
            site_id=site_id,
            status=RunStatus.SUBMITTED,
            is_archived=False,
            timestamp_created=datetime.datetime.fromisoformat(TIMESTAMP_CREATED),
            site_submission=site_submission,
            trace=site_submission.trace,
        )
    )
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        response = dashboard_client.get("/api/runs")

    assert response.status_code == 200
    [run] = response.json()
    assert run["run_id"] == str(run_id)
    assert run["trace_available"] is True
    assert run["event_count"] == 5
    assert run["duration_msec"] == 4
    assert run["platform_label"] == "NoPlatform"


def test_dashboard_runs_endpoint_hydrates_missing_submitted_detail(
    tmp_path: Path,
) -> None:
    graph = _make_graph()
    site_id = uuid4()
    run_id = uuid4()
    site_submission = _make_site_submission(graph)
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(request.url.path)
        if request.url.path == f"/runs/{run_id}":
            return _json_response(
                {
                    "run_id": str(run_id),
                    "site_id": str(site_id),
                    "status": RunStatus.SUBMITTED.value,
                    "is_archived": False,
                    "timestamp_created": TIMESTAMP_CREATED,
                    "site_submission": site_submission.model_dump(mode="json"),
                    "trace": site_submission.trace.model_dump(mode="json"),
                }
            )
        raise AssertionError(request.url)

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )
    cache = _DashboardCache(client=client, cache_dir=tmp_path)
    cache.upsert_item(
        kind="run",
        key=str(run_id),
        payload=contracts.ListRunsItem(
            run_id=run_id,
            site_id=site_id,
            status=RunStatus.SUBMITTED,
            is_archived=False,
            timestamp_created=datetime.datetime.fromisoformat(TIMESTAMP_CREATED),
        ),
    )
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        response = dashboard_client.get("/api/runs")

    assert response.status_code == 200
    [run] = response.json()
    assert calls == [f"/runs/{run_id}"]
    assert run["trace_available"] is True
    assert run["event_count"] == 5
    assert run["duration_msec"] == 4


def test_dashboard_manual_refresh_caches_admin_metadata(
    tmp_path: Path,
) -> None:
    user_id = uuid4()
    api_token_id = uuid4()

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path in {"/sites", "/tags", "/runs"}:
            return _json_response({"items": [], "next_page_cursor": None})
        if request.url.path == "/admin/users":
            return _json_response(
                {
                    "items": [
                        {
                            "user_id": str(user_id),
                            "username": "researcher",
                            "is_admin": False,
                            "is_archived": False,
                            "timestamp_created": TIMESTAMP_CREATED,
                        }
                    ],
                    "next_page_cursor": None,
                }
            )
        if request.url.path == "/admin/api-tokens":
            return _json_response(
                {
                    "items": [
                        {
                            "api_token_id": str(api_token_id),
                            "user_id": str(user_id),
                            "name": "dashboard-token",
                            "is_revoked": False,
                            "timestamp_created": TIMESTAMP_CREATED,
                        }
                    ],
                    "next_page_cursor": None,
                }
            )
        raise AssertionError(request.url)

    client = nk_server.AdminClient(
        api_url="https://nodekit.example",
        api_token="admin-secret",
        transport=httpx.MockTransport(handler),
    )
    cache = _DashboardCache(client=client, cache_dir=tmp_path)

    counts = cache.refresh_all()

    assert counts == {
        "sites": 0,
        "tags": 0,
        "runs": 0,
        "users": 1,
        "api_tokens": 1,
    }
    assert cache.read_items(kind="user", response_type=contracts.ListUsersItem)[0]["username"] == (
        "researcher"
    )
    serialized_cache = b"".join(path.read_bytes() for path in tmp_path.rglob("*") if path.is_file())
    assert b"admin-secret" not in serialized_cache
    api_token_items = cache.read_items(kind="api-token", response_type=contracts.ListApiTokensItem)
    assert "token" not in api_token_items[0]
