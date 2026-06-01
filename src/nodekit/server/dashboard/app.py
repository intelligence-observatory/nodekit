"""FastAPI stub app for the local NodeKit dashboard."""

from typing import Any
from uuid import UUID

import fastapi
from fastapi.responses import HTMLResponse

from nodekit.server import contracts
from nodekit.server.values import RunId, SiteId

from .cache import _DashboardCache


# %% App factory
def create_dashboard_app(cache: _DashboardCache) -> fastapi.FastAPI:
    """Create the local dashboard stub app."""

    app = fastapi.FastAPI(title="NodeKit Dashboard")

    @app.get("/", response_class=HTMLResponse)
    def index() -> str:
        return _DASHBOARD_HTML

    @app.get("/api/status")
    def status() -> dict[str, Any]:
        return cache.status()

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
    def runs() -> list[dict[str, Any]]:
        items = cache.read_query_items(
            resource="runs",
            query=contracts.ListRunsQuery(max_items=100),
            response_type=contracts.ListRunsResponse,
            stale_kind="run-list",
        )
        if items:
            return items
        return cache.read_items(kind="run", response_type=contracts.ListRunsItem)

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
        return {"refreshed": cache.refresh_all(), "status": cache.status()}

    @app.post("/api/refresh/sites")
    def refresh_sites() -> dict[str, Any]:
        _ensure_client(cache)
        response = cache.refresh_sites()
        return {"count": len(response.items), "status": cache.status()}

    @app.post("/api/refresh/sites/{site_id}")
    def refresh_site(site_id: SiteId) -> dict[str, Any]:
        _ensure_client(cache)
        response = cache.refresh_site(site_id=site_id)
        return response.model_dump(mode="json")

    @app.post("/api/refresh/tags")
    def refresh_tags() -> dict[str, Any]:
        _ensure_client(cache)
        response = cache.refresh_tags()
        return {"count": len(response.items), "status": cache.status()}

    @app.post("/api/refresh/runs")
    def refresh_runs() -> dict[str, Any]:
        _ensure_client(cache)
        response = cache.refresh_runs()
        return {"count": len(response.items), "status": cache.status()}

    @app.post("/api/refresh/runs/{run_id}")
    def refresh_run(run_id: RunId) -> dict[str, Any]:
        _ensure_client(cache)
        response = cache.refresh_run(run_id=run_id)
        return response.model_dump(mode="json")

    return app


# %% Helpers
def _ensure_client(cache: _DashboardCache) -> None:
    if cache.client is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_409_CONFLICT,
            detail="A nodekit.server.Client is required to refresh dashboard data.",
        )


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
      color-scheme: light dark;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f6f7f9;
      color: #182026;
    }
    body {
      margin: 0;
      padding: 24px;
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
      line-height: 1.2;
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
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    section {
      background: #ffffff;
      border: 1px solid #d6dde3;
      border-radius: 8px;
      padding: 16px;
      min-width: 0;
    }
    dl {
      display: grid;
      grid-template-columns: 130px 1fr;
      gap: 8px 12px;
      margin: 0;
      font-size: 13px;
    }
    dt {
      color: #52616d;
    }
    dd {
      margin: 0;
      word-break: break-word;
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
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        background: #11161a;
        color: #edf1f5;
      }
      section, button {
        background: #1a2229;
        border-color: #34434f;
      }
      th, td {
        border-bottom-color: #34434f;
      }
      dt, th {
        color: #aeb9c2;
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>NodeKit Dashboard</h1>
      <button id="refresh" type="button">Refresh</button>
    </header>
    <section>
      <h2>Cache</h2>
      <dl id="status"></dl>
    </section>
    <div class="grid" style="margin-top:16px;">
      <section>
        <h2>Sites</h2>
        <table>
          <thead><tr><th>Site</th><th>Tags</th><th>Cached</th></tr></thead>
          <tbody id="sites"></tbody>
        </table>
      </section>
      <section>
        <h2>Tags</h2>
        <table>
          <thead><tr><th>Name</th><th>Archived</th><th>Cached</th></tr></thead>
          <tbody id="tags"></tbody>
        </table>
      </section>
      <section>
        <h2>Runs</h2>
        <table>
          <thead><tr><th>Run</th><th>Status</th><th>Cached</th></tr></thead>
          <tbody id="runs"></tbody>
        </table>
      </section>
    </div>
  </main>
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
      const [status, sites, tags, runs] = await Promise.all([
        fetch("/api/status").then((r) => r.json()),
        fetch("/api/sites").then((r) => r.json()),
        fetch("/api/tags").then((r) => r.json()),
        fetch("/api/runs").then((r) => r.json()),
      ]);

      const statusEl = document.querySelector("#status");
      statusEl.replaceChildren();
      for (const [key, value] of Object.entries({
        cache_root: status.cache_root,
        scope_key: status.scope_key,
        source_api_url: status.source_api_url || "",
        has_client: String(status.has_client),
        last_refresh_at: status.last_refresh_at || "",
        counts: JSON.stringify(status.counts),
      })) {
        const dt = document.createElement("dt");
        dt.textContent = key;
        const dd = document.createElement("dd");
        dd.textContent = value;
        statusEl.append(dt, dd);
      }

      renderRows("#sites", sites, [
        (row) => row.site_id,
        (row) => (row.tags || []).join(", "),
        cacheText,
      ]);
      renderRows("#tags", tags, [
        (row) => row.name,
        (row) => String(row.is_archived),
        cacheText,
      ]);
      renderRows("#runs", runs, [
        (row) => row.run_id,
        (row) => row.status,
        cacheText,
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
