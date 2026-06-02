"""FastAPI app for the local NodeKit dashboard."""

import datetime
from collections.abc import Sequence
from pathlib import Path
from typing import Any, Callable
from uuid import UUID

import fastapi
import httpx
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles

from nodekit.values import Platform
from nodekit.server import contracts
from nodekit.server.values import RunId, RunStatus, SiteId

from .cache import _DashboardCache


# %% App factory
def create_dashboard_app(
    cache: _DashboardCache,
    *,
    static_dir: Path | None = None,
) -> fastapi.FastAPI:
    """Create the local dashboard app."""

    app = fastapi.FastAPI(title="NodeKit Dashboard")
    resolved_static_dir = static_dir or Path(__file__).parent / "_static"
    static_index_path = resolved_static_dir / "index.html"
    if static_index_path.exists():
        app.mount(
            "/dashboard-static",
            StaticFiles(directory=resolved_static_dir),
            name="dashboard-static",
        )

    @app.get("/", response_class=HTMLResponse, response_model=None)
    def index() -> Response:
        if static_index_path.exists():
            return FileResponse(static_index_path)
        return HTMLResponse(_DASHBOARD_HTML)

    @app.get("/api/status")
    def status() -> dict[str, Any]:
        return cache.status()

    @app.get("/api/health", response_model=None)
    def health() -> Response:
        checked_at = datetime.datetime.now(datetime.UTC).isoformat()
        if cache.client is None:
            return JSONResponse({"status": "disconnected", "checked_at": checked_at})
        try:
            cache.client.get_health()
        except httpx.HTTPError as exc:
            return JSONResponse(
                status_code=fastapi.status.HTTP_502_BAD_GATEWAY,
                content={
                    "status": "unreachable",
                    "message": str(exc),
                    "checked_at": checked_at,
                },
            )
        return JSONResponse({"status": "ok", "checked_at": checked_at})

    @app.get("/api/sites")
    def sites() -> list[dict[str, Any]]:
        items = cache.read_query_items(
            resource="sites",
            query=contracts.ListSitesQuery(max_items=100),
            response_type=contracts.ListSitesResponse,
            stale_kind="site-list",
        )
        if items:
            return items
        return cache.read_items(kind="site", response_type=contracts.ListSitesItem)

    @app.get("/api/sites/{site_id}")
    def site_detail(site_id: UUID) -> dict[str, Any] | None:
        item = cache.read_item(
            kind="site-detail",
            key=str(site_id),
            response_type=contracts.GetSiteResponse,
        )
        if item is None:
            return None
        return item.model_dump(mode="json")

    @app.get("/api/tags")
    def tags() -> list[dict[str, Any]]:
        items = cache.read_query_items(
            resource="tags",
            query=contracts.ListTagsQuery(max_items=100),
            response_type=contracts.ListTagsResponse,
            stale_kind="tag-list",
        )
        if items:
            return items
        return cache.read_items(kind="tag", response_type=contracts.ListTagsItem)

    @app.get("/api/runs")
    def runs(
        start_ms: int | None = None,
        end_ms: int | None = None,
        recruitment_platforms: list[Platform] | None = fastapi.Query(default=None),
        recruiter_study_ids: list[str] | None = fastapi.Query(default=None),
        recruiter_participant_ids: list[str] | None = fastapi.Query(default=None),
        recruiter_session_ids: list[str] | None = fastapi.Query(default=None),
    ) -> list[dict[str, Any]]:
        if start_ms is not None or end_ms is not None:
            return _enrich_run_items(
                cache,
                _filter_run_items(
                    _visible_run_items(
                        cache.read_items_in_time_window(
                            kind="run",
                            response_type=contracts.ListRunsItem,
                            timestamp_field="timestamp_created",
                            start_ms=start_ms,
                            end_ms=end_ms,
                            stale_kind="run-list",
                        )
                    ),
                    recruitment_platforms=recruitment_platforms,
                    recruiter_study_ids=recruiter_study_ids,
                    recruiter_participant_ids=recruiter_participant_ids,
                    recruiter_session_ids=recruiter_session_ids,
                ),
            )

        items = cache.read_query_items(
            resource="runs",
            query=contracts.ListRunsQuery(max_items=100),
            response_type=contracts.ListRunsResponse,
            stale_kind="run-list",
        )
        if items:
            return _enrich_run_items(
                cache,
                _filter_run_items(
                    _visible_run_items(items),
                    recruitment_platforms=recruitment_platforms,
                    recruiter_study_ids=recruiter_study_ids,
                    recruiter_participant_ids=recruiter_participant_ids,
                    recruiter_session_ids=recruiter_session_ids,
                ),
            )
        return _enrich_run_items(
            cache,
            _filter_run_items(
                _visible_run_items(
                    cache.read_items(kind="run", response_type=contracts.ListRunsItem),
                ),
                recruitment_platforms=recruitment_platforms,
                recruiter_study_ids=recruiter_study_ids,
                recruiter_participant_ids=recruiter_participant_ids,
                recruiter_session_ids=recruiter_session_ids,
            ),
        )

    @app.get("/api/runs/{run_id}")
    def run_detail(run_id: UUID) -> dict[str, Any] | None:
        item = cache.read_item(
            kind="run-detail",
            key=str(run_id),
            response_type=contracts.GetRunResponse,
        )
        if item is None:
            return None
        return item.model_dump(mode="json")

    @app.post("/api/refresh")
    def refresh_all() -> dict[str, Any]:
        _ensure_client(cache)
        return _refresh_response(
            lambda: {"refreshed": cache.refresh_all(), "status": cache.status()}
        )

    @app.post("/api/refresh/sites")
    def refresh_sites() -> dict[str, Any]:
        _ensure_client(cache)
        return _refresh_response(
            lambda: {"count": len(cache.refresh_sites().items), "status": cache.status()}
        )

    @app.post("/api/refresh/sites/{site_id}")
    def refresh_site(site_id: SiteId) -> dict[str, Any]:
        _ensure_client(cache)
        return _refresh_response(
            lambda: cache.refresh_site(site_id=site_id).model_dump(mode="json")
        )

    @app.post("/api/refresh/tags")
    def refresh_tags() -> dict[str, Any]:
        _ensure_client(cache)
        return _refresh_response(
            lambda: {"count": len(cache.refresh_tags().items), "status": cache.status()}
        )

    @app.post("/api/refresh/runs")
    def refresh_runs() -> dict[str, Any]:
        _ensure_client(cache)
        return _refresh_response(
            lambda: {"count": len(cache.refresh_runs().items), "status": cache.status()}
        )

    @app.post("/api/refresh/runs/{run_id}")
    def refresh_run(run_id: RunId) -> dict[str, Any]:
        _ensure_client(cache)
        return _refresh_response(lambda: cache.refresh_run(run_id=run_id).model_dump(mode="json"))

    return app


# %% Helpers
def _ensure_client(cache: _DashboardCache) -> None:
    if cache.client is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_409_CONFLICT,
            detail="A nodekit.server.Client is required to refresh dashboard data.",
        )


def _refresh_response(callback: Callable[[], Any]) -> Any:
    try:
        return callback()
    except httpx.HTTPError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_502_BAD_GATEWAY,
            detail={
                "error": "refresh_failed",
                "message": str(exc),
            },
        ) from exc


def _enrich_run_items(
    cache: _DashboardCache,
    items: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    enriched: list[dict[str, Any]] = []
    for item in items:
        next_item = dict(item)
        detail = cache.read_item(
            kind="run-detail",
            key=str(item["run_id"]),
            response_type=contracts.GetRunResponse,
        )
        if detail is None and _should_hydrate_run_detail(cache=cache, item=item):
            try:
                detail = cache.refresh_run(run_id=UUID(str(item["run_id"])))
            except httpx.HTTPError:
                detail = None
        summary = _run_summary(detail)
        if summary["platform_label"] is None:
            summary["platform_label"] = item.get("recruitment_platform")
        next_item.update(summary)
        enriched.append(next_item)
    return enriched


def _visible_run_items(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [item for item in items if not item.get("is_archived", False)]


def _filter_run_items(
    items: list[dict[str, Any]],
    *,
    recruitment_platforms: list[Platform] | None,
    recruiter_study_ids: list[str] | None,
    recruiter_participant_ids: list[str] | None,
    recruiter_session_ids: list[str] | None,
) -> list[dict[str, Any]]:
    return [
        item
        for item in items
        if _matches_filter(item, "recruitment_platform", recruitment_platforms)
        and _matches_filter(item, "recruiter_study_id", recruiter_study_ids)
        and _matches_filter(item, "recruiter_participant_id", recruiter_participant_ids)
        and _matches_filter(item, "recruiter_session_id", recruiter_session_ids)
    ]


def _matches_filter(
    item: dict[str, Any],
    key: str,
    allowed_values: Sequence[str] | None,
) -> bool:
    return allowed_values is None or item.get(key) in set(allowed_values)


def _should_hydrate_run_detail(cache: _DashboardCache, item: dict[str, Any]) -> bool:
    if cache.client is None:
        return False
    return item.get("status") in {
        RunStatus.SUBMITTED.value,
        RunStatus.COMPLETED.value,
        RunStatus.INVALID.value,
    }


def _run_summary(detail: contracts.GetRunResponse | None) -> dict[str, Any]:
    empty_summary = {
        "trace_available": None,
        "event_count": None,
        "duration_msec": None,
        "platform_label": None,
    }
    if detail is None:
        return empty_summary

    try:
        site_submission = detail.site_submission
    except Exception:
        return empty_summary

    trace = site_submission.trace if site_submission is not None else None

    event_times = [
        event.t
        for event in (trace.events if trace is not None else ())
        if isinstance(event.t, int | float)
    ]
    duration_msec = max(event_times) - min(event_times) if len(event_times) >= 2 else None
    platform_context = site_submission.platform_context if site_submission is not None else None
    platform = getattr(platform_context, "platform", None)
    return {
        "trace_available": trace is not None,
        "event_count": len(trace.events) if trace is not None else None,
        "duration_msec": duration_msec,
        "platform_label": str(platform) if platform is not None else None,
    }


# %% HTML
_DASHBOARD_HTML = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NodeKit Dashboard</title>
  <style>
    :root {
      font-family: Inter, sans-serif;
      background: #f6f7f9;
      color: #182026;
    }
    body {
      margin: 0;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 20px;
      border-bottom: 1px solid #d8e0e5;
      background: #fff;
    }
    h1 {
      margin: 0;
      font-size: 16px;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 16px;
    }
    button {
      appearance: none;
      border: 1px solid #9aa8b4;
      background: #ffffff;
      color: inherit;
      border-radius: 6px;
      padding: 8px 12px;
      font: inherit;
      cursor: pointer;
    }
    button.primary {
      border-color: #88d4b5;
      background: #88d4b5;
    }
    section {
      background: #ffffff;
      border: 1px solid #d6dde3;
      border-radius: 8px;
      padding: 16px;
      min-width: 0;
      margin: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th, td {
      text-align: left;
      border-bottom: 1px solid #e1e6ea;
      padding: 8px 6px;
      vertical-align: top;
    }
    th {
      color: #52616d;
      font-weight: 600;
    }
    .muted {
      color: #60707c;
      font-size: 12px;
    }
    .chart-empty {
      display: grid;
      min-height: 220px;
      place-items: center;
      color: #60707c;
      border: 1px dashed #d8e0e5;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>NodeKit Dashboard</h1>
      <div id="source" class="muted">Cache-only shell</div>
    </div>
    <div>
      <span id="refreshed" class="muted"></span>
      <button id="refresh" class="primary" type="button">Refresh</button>
    </div>
  </header>
  <section>
    <h2>Run Volume</h2>
    <div class="chart-empty">Build dashboard assets for the interactive histogram.</div>
  </section>
  <section>
    <h2>Runs</h2>
    <table>
          <thead><tr><th>Run</th><th>Status</th><th>Site</th></tr></thead>
      <tbody id="runs"></tbody>
    </table>
  </section>
  <script>
    const refreshButton = document.querySelector("#refresh");

    function cell(text) {
      const td = document.createElement("td");
      td.textContent = text ?? "";
      return td;
    }

    function cacheText(item) {
      const cache = item._cache;
      if (!cache) return "";
      return `${cache.is_stale ? "stale" : "fresh"} ${cache.fetched_at}`;
    }

    function renderRows(selector, rows, columns) {
      const body = document.querySelector(selector);
      body.replaceChildren();
      if (!rows.length) {
        const tr = document.createElement("tr");
        const td = cell("No cached data");
        td.colSpan = columns.length;
        tr.append(td);
        body.append(tr);
        return;
      }
      for (const row of rows) {
        const tr = document.createElement("tr");
        for (const column of columns) tr.append(cell(column(row)));
        body.append(tr);
      }
    }

    async function load() {
      const [status, runs] = await Promise.all([
        fetch("/api/status").then((r) => r.json()),
        fetch("/api/runs").then((r) => r.json()),
      ]);

      document.querySelector("#source").textContent = status.source_api_url
        ? `Source: ${status.source_api_url}`
        : "Cache-only shell";
      document.querySelector("#refreshed").textContent = status.last_refresh_at
        ? `Last refreshed ${new Date(status.last_refresh_at).toLocaleString([], { timeZoneName: "short" })}`
        : "No refresh recorded";
      renderRows("#runs", runs, [
        (row) => row.run_id,
        (row) => row.status,
        (row) => row.site_id,
      ]);
    }

    refreshButton.addEventListener("click", async () => {
      refreshButton.disabled = true;
      try {
        const response = await fetch("/api/refresh", { method: "POST" });
        if (!response.ok) {
          const body = await response.json();
          alert(body.detail || "Refresh failed");
        }
        await load();
      } finally {
        refreshButton.disabled = false;
      }
    });

    load();
  </script>
</body>
</html>
"""
