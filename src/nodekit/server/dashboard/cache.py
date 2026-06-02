"""Persistent cache for the local NodeKit dashboard."""

import datetime
import hashlib
import json
import os
import shutil
import sqlite3
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path
from typing import Any, TypeVar

import pydantic
from platformdirs import user_cache_path

from nodekit import Graph
from nodekit.server import contracts
from nodekit.server.client import AdminClient, Client
from nodekit.server.pagination import PageResponse
from nodekit.server.values import ApiTokenId, RunId, SiteId, UserId


# %% Constants
CACHE_SCHEMA_VERSION = 1
DASHBOARD_CACHE_ENV_VAR = "NODEKIT_DASHBOARD_CACHE_DIR"
LOCAL_SCOPE_KEY = "local"

STALE_AFTER_SECONDS = {
    "run-list": 30,
    "site-list": 5 * 60,
    "tag-list": 5 * 60,
    "site-detail": 30 * 60,
    "run-detail": 30 * 60,
}

ResponseT = TypeVar("ResponseT", bound=pydantic.BaseModel)
PageItemT = TypeVar("PageItemT", bound=pydantic.BaseModel)


# %% Models
@dataclass(frozen=True)
class _CachedEntry:
    kind: str
    key: str
    contract_type: str
    payload_json: str
    source_api_url: str | None
    fetched_at: datetime.datetime
    cache_schema_version: int


# %% Path helpers
def resolve_dashboard_cache_root(cache_dir: os.PathLike[str] | str | None = None) -> Path:
    """Return the root directory for the dashboard cache."""

    if cache_dir is not None:
        return Path(cache_dir).expanduser().resolve()

    env_cache_dir = os.environ.get(DASHBOARD_CACHE_ENV_VAR)
    if env_cache_dir:
        return Path(env_cache_dir).expanduser().resolve()

    return user_cache_path("nodekit") / "dashboard"


def clear_dashboard_cache(cache_dir: os.PathLike[str] | str | None = None) -> None:
    """Delete the persistent dashboard cache directory."""

    cache_root = resolve_dashboard_cache_root(cache_dir=cache_dir)
    if cache_root.exists():
        shutil.rmtree(cache_root)


def dashboard_scope_key(client: Client | None) -> str:
    """Return a non-secret cache scope key for a client."""

    if client is None:
        return LOCAL_SCOPE_KEY

    api_token_marker = "none"
    if client.api_token is not None:
        api_token_marker = hashlib.sha256(client.api_token.encode("utf-8")).hexdigest()

    payload = _stable_json(
        {
            "api_url": client.api_url.rstrip("/"),
            "api_token_sha256": api_token_marker,
        }
    )
    return f"api-{hashlib.sha256(payload.encode('utf-8')).hexdigest()[:32]}"


# %% Cache
class _DashboardCache:
    """SQLite-backed cache for dashboard API contracts."""

    def __init__(
        self,
        *,
        client: Client | None,
        cache_dir: os.PathLike[str] | str | None = None,
    ):
        self.client = client
        self.cache_root = resolve_dashboard_cache_root(cache_dir=cache_dir)
        self.scope_key = dashboard_scope_key(client=client)
        self.scope_dir = self.cache_root / self.scope_key
        self.db_path = self.scope_dir / "dashboard.sqlite"
        self.source_api_url = None if client is None else client.api_url
        self._initialize()

    def status(self) -> dict[str, Any]:
        with self._connect() as connection:
            rows = connection.execute(
                "SELECT kind, COUNT(*) FROM entries GROUP BY kind ORDER BY kind"
            ).fetchall()
            last_row = connection.execute("SELECT MAX(fetched_at) FROM entries").fetchone()

        last_refresh_at = last_row[0] if last_row is not None else None
        return {
            "cache_root": str(self.cache_root),
            "scope_key": self.scope_key,
            "db_path": str(self.db_path),
            "source_api_url": self.source_api_url,
            "has_client": self.client is not None,
            "cache_schema_version": CACHE_SCHEMA_VERSION,
            "last_refresh_at": last_refresh_at,
            "counts": {kind: count for kind, count in rows},
        }

    def read_item(
        self,
        *,
        kind: str,
        key: str,
        response_type: type[ResponseT],
    ) -> ResponseT | None:
        entry = self._read_entry(kind=kind, key=key)
        if entry is None:
            return None
        return response_type.model_validate_json(entry.payload_json)

    def read_items(
        self,
        *,
        kind: str,
        response_type: type[ResponseT],
    ) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT kind, key, contract_type, payload_json, source_api_url,
                       fetched_at, cache_schema_version
                FROM entries
                WHERE kind = ?
                ORDER BY fetched_at DESC, key
                """,
                (kind,),
            ).fetchall()

        items: list[dict[str, Any]] = []
        for row in rows:
            entry = _entry_from_row(row)
            payload = response_type.model_validate_json(entry.payload_json)
            item = payload.model_dump(mode="json")
            item["_cache"] = self._entry_cache_info(entry=entry, stale_kind=kind)
            items.append(item)
        return items

    def read_items_in_time_window(
        self,
        *,
        kind: str,
        response_type: type[ResponseT],
        timestamp_field: str,
        start_ms: int | None,
        end_ms: int | None,
        stale_kind: str | None = None,
    ) -> list[dict[str, Any]]:
        """Read cached items after cheap JSON time filtering."""

        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT kind, key, contract_type, payload_json, source_api_url,
                       fetched_at, cache_schema_version
                FROM entries
                WHERE kind = ?
                ORDER BY fetched_at DESC, key
                """,
                (kind,),
            ).fetchall()

        items: list[dict[str, Any]] = []
        for row in rows:
            raw_payload = json.loads(row["payload_json"])
            timestamp = raw_payload.get(timestamp_field)
            if not isinstance(timestamp, str):
                continue
            if not _timestamp_in_window(timestamp=timestamp, start_ms=start_ms, end_ms=end_ms):
                continue

            entry = _entry_from_row(row)
            payload = response_type.model_validate(raw_payload)
            item = payload.model_dump(mode="json")
            item["_cache"] = self._entry_cache_info(entry=entry, stale_kind=stale_kind or kind)
            items.append(item)
        return items

    def read_query_items(
        self,
        *,
        resource: str,
        query: contracts.ContractModel,
        response_type: type[PageResponse[PageItemT]],
        stale_kind: str,
    ) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        page_cursor: str | None = None
        seen_cursors: set[str | None] = set()
        while page_cursor not in seen_cursors:
            seen_cursors.add(page_cursor)
            entry = self._read_entry(
                kind=_query_kind(resource=resource),
                key=_query_key(query=query, page_cursor=page_cursor),
            )
            if entry is None:
                break

            page = response_type.model_validate_json(entry.payload_json)
            for item in page.items:
                item_payload = item.model_dump(mode="json")
                item_payload["_cache"] = self._entry_cache_info(
                    entry=entry,
                    stale_kind=stale_kind,
                )
                items.append(item_payload)
            page_cursor = page.next_page_cursor
            if page_cursor is None:
                break
        return items

    def upsert_item(self, *, kind: str, key: str, payload: pydantic.BaseModel) -> None:
        self._write_entry(kind=kind, key=key, payload=payload)

    def refresh_sites(self) -> contracts.ListSitesResponse:
        client = self._require_client()
        query = contracts.ListSitesQuery(max_items=100)
        return self._refresh_pages(
            client=client,
            path="/sites",
            resource="sites",
            query=query,
            response_type=contracts.ListSitesResponse,
            item_kind="site",
            item_key=lambda item: str(item.site_id),
        )

    def refresh_tags(self) -> contracts.ListTagsResponse:
        client = self._require_client()
        query = contracts.ListTagsQuery(max_items=100)
        return self._refresh_pages(
            client=client,
            path="/tags",
            resource="tags",
            query=query,
            response_type=contracts.ListTagsResponse,
            item_kind="tag",
            item_key=lambda item: item.name,
        )

    def refresh_runs(self) -> contracts.ListRunsResponse:
        client = self._require_client()
        query = contracts.ListRunsQuery(max_items=100)
        response = self._refresh_pages(
            client=client,
            path="/runs",
            resource="runs",
            query=query,
            response_type=contracts.ListRunsResponse,
            item_kind="run",
            item_key=lambda item: str(item.run_id),
        )
        for item in response.items:
            self.refresh_run(run_id=item.run_id)
        return response

    def refresh_users(self) -> contracts.ListUsersResponse | None:
        client = self.client
        if not isinstance(client, AdminClient):
            return None

        query = contracts.ListUsersQuery(max_items=100)
        return self._refresh_pages(
            client=client,
            path="/admin/users",
            resource="users",
            query=query,
            response_type=contracts.ListUsersResponse,
            item_kind="user",
            item_key=lambda item: str(item.user_id),
        )

    def refresh_api_tokens(self) -> contracts.ListApiTokensResponse | None:
        client = self.client
        if not isinstance(client, AdminClient):
            return None

        query = contracts.ListApiTokensQuery(max_items=100)
        return self._refresh_pages(
            client=client,
            path="/admin/api-tokens",
            resource="api-tokens",
            query=query,
            response_type=contracts.ListApiTokensResponse,
            item_kind="api-token",
            item_key=lambda item: str(item.api_token_id),
        )

    def refresh_site(self, site_id: SiteId) -> contracts.GetSiteResponse:
        client = self._require_client()
        response = client.get_site(site_id=site_id)
        self.store_site_detail(response)
        return response

    def refresh_run(self, run_id: RunId) -> contracts.GetRunResponse:
        client = self._require_client()
        response = client.get_run(run_id=run_id)
        self.store_run_detail(response)
        return response

    def refresh_all(self) -> dict[str, int]:
        counts: dict[str, int] = {}
        counts["sites"] = len(self.refresh_sites().items)
        counts["tags"] = len(self.refresh_tags().items)
        counts["runs"] = len(self.refresh_runs().items)

        users_response = self.refresh_users()
        if users_response is not None:
            counts["users"] = len(users_response.items)

        api_tokens_response = self.refresh_api_tokens()
        if api_tokens_response is not None:
            counts["api_tokens"] = len(api_tokens_response.items)

        return counts

    def store_site_detail(self, response: contracts.GetSiteResponse) -> None:
        self.upsert_item(kind="site-detail", key=str(response.site_id), payload=response)
        self.upsert_item(
            kind="site",
            key=str(response.site_id),
            payload=_site_detail_to_list_item(response),
        )

    def store_run_detail(self, response: contracts.GetRunResponse) -> None:
        self.upsert_item(kind="run-detail", key=str(response.run_id), payload=response)
        self.upsert_item(
            kind="run",
            key=str(response.run_id),
            payload=_run_detail_to_list_item(response),
        )

    def invalidate_queries(self, resource: str) -> None:
        with self._connect() as connection:
            connection.execute("DELETE FROM entries WHERE kind = ?", (_query_kind(resource),))

    def delete_item(self, *, kind: str, key: str) -> None:
        with self._connect() as connection:
            connection.execute("DELETE FROM entries WHERE kind = ? AND key = ?", (kind, key))

    def update_run_from_summary(self, response: contracts.ArchiveRunResponse) -> None:
        summary = contracts.ListRunsItem(
            run_id=response.run_id,
            site_id=response.site_id,
            status=response.status,
            is_archived=response.is_archived,
            timestamp_created=response.timestamp_created,
        )
        self.upsert_item(kind="run", key=str(response.run_id), payload=summary)

        existing = self.read_item(
            kind="run-detail",
            key=str(response.run_id),
            response_type=contracts.GetRunResponse,
        )
        if existing is not None:
            updated = existing.model_copy(
                update={
                    "status": response.status,
                    "is_archived": response.is_archived,
                    "timestamp_created": response.timestamp_created,
                }
            )
            self.store_run_detail(updated)

    def _refresh_pages(
        self,
        *,
        client: Client,
        path: str,
        resource: str,
        query: contracts.ContractModel,
        response_type: type[PageResponse[PageItemT]],
        item_kind: str,
        item_key: Any,
    ) -> PageResponse[PageItemT]:
        page_cursor = getattr(query, "page_cursor", None)
        all_items: list[PageItemT] = []
        next_page_cursor: str | None = None

        while True:
            page_query = query.model_copy(update={"page_cursor": page_cursor})
            response = client._request("GET", path, response_type, query=page_query)  # noqa: SLF001
            self._write_entry(
                kind=_query_kind(resource=resource),
                key=_query_key(query=query, page_cursor=page_cursor),
                payload=response,
            )
            for item in response.items:
                self.upsert_item(kind=item_kind, key=item_key(item), payload=item)
            all_items.extend(response.items)
            next_page_cursor = response.next_page_cursor
            if next_page_cursor is None:
                break
            page_cursor = next_page_cursor

        return response_type(items=all_items, next_page_cursor=None)

    def _initialize(self) -> None:
        self.scope_dir.mkdir(parents=True, exist_ok=True)
        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS entries (
                    kind TEXT NOT NULL,
                    key TEXT NOT NULL,
                    contract_type TEXT NOT NULL,
                    payload_json TEXT NOT NULL,
                    source_api_url TEXT,
                    fetched_at TEXT NOT NULL,
                    cache_schema_version INTEGER NOT NULL,
                    PRIMARY KEY (kind, key)
                )
                """
            )
            connection.execute(
                """
                CREATE INDEX IF NOT EXISTS ix_entries_kind_fetched_at
                ON entries(kind, fetched_at)
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS meta (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
                """
            )
            connection.execute(
                """
                INSERT OR REPLACE INTO meta(key, value)
                VALUES
                    ('cache_schema_version', ?),
                    ('scope_key', ?),
                    ('source_api_url', ?)
                """,
                (
                    str(CACHE_SCHEMA_VERSION),
                    self.scope_key,
                    self.source_api_url or "",
                ),
            )

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _read_entry(self, *, kind: str, key: str) -> _CachedEntry | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT kind, key, contract_type, payload_json, source_api_url,
                       fetched_at, cache_schema_version
                FROM entries
                WHERE kind = ? AND key = ?
                """,
                (kind, key),
            ).fetchone()

        if row is None:
            return None
        return _entry_from_row(row)

    def _write_entry(self, *, kind: str, key: str, payload: pydantic.BaseModel) -> None:
        fetched_at = _utc_now().isoformat().replace("+00:00", "Z")
        with self._connect() as connection:
            connection.execute(
                """
                INSERT OR REPLACE INTO entries(
                    kind,
                    key,
                    contract_type,
                    payload_json,
                    source_api_url,
                    fetched_at,
                    cache_schema_version
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    kind,
                    key,
                    type(payload).__name__,
                    payload.model_dump_json(),
                    self.source_api_url,
                    fetched_at,
                    CACHE_SCHEMA_VERSION,
                ),
            )

    def _require_client(self) -> Client:
        if self.client is None:
            raise RuntimeError("A nodekit.server.Client is required to refresh dashboard data.")
        return self.client

    def _entry_cache_info(self, *, entry: _CachedEntry, stale_kind: str) -> dict[str, Any]:
        stale_after = STALE_AFTER_SECONDS.get(stale_kind)
        is_stale = False
        if stale_after is not None:
            age = (_utc_now() - entry.fetched_at).total_seconds()
            is_stale = age > stale_after

        return {
            "fetched_at": entry.fetched_at.isoformat().replace("+00:00", "Z"),
            "is_stale": is_stale,
            "stale_after_seconds": stale_after,
        }


# %% Cached client
class _CachedDashboardClient:
    """Private mutation-aware dashboard adapter around a truthful Client."""

    def __init__(self, *, client: Client, cache: _DashboardCache):
        self.client = client
        self.cache = cache

    def create_site(
        self,
        graph: Graph,
        tags: Iterable[str] = (),
    ) -> contracts.CreateSiteResponse:
        response = self.client.create_site(graph=graph, tags=tags)
        self.cache.store_site_detail(
            contracts.GetSiteResponse(
                site_id=response.site_id,
                user_id=response.user_id,
                url=response.url,
                tags=response.tags,
                is_archived=response.is_archived,
                timestamp_created=response.timestamp_created,
                graph=response.graph,
                assets=response.assets,
            )
        )
        self.cache.invalidate_queries("sites")
        return response

    def archive_site(self, site_id: SiteId) -> contracts.ArchiveSiteResponse:
        response = self.client.archive_site(site_id=site_id)
        self._store_site_summary(response)
        self.cache.invalidate_queries("sites")
        return response

    def add_site_tags(
        self,
        site_id: SiteId,
        tags: Iterable[str],
    ) -> contracts.AddSiteTagsResponse:
        response = self.client.add_site_tags(site_id=site_id, tags=tags)
        self._store_site_summary(response)
        self.cache.invalidate_queries("sites")
        return response

    def remove_site_tags(
        self,
        site_id: SiteId,
        tags: Iterable[str],
    ) -> contracts.RemoveSiteTagsResponse:
        response = self.client.remove_site_tags(site_id=site_id, tags=tags)
        self._store_site_summary(response)
        self.cache.invalidate_queries("sites")
        return response

    def create_tag(self, name: str) -> contracts.CreateTagResponse:
        response = self.client.create_tag(name=name)
        self.cache.upsert_item(
            kind="tag",
            key=response.name,
            payload=contracts.ListTagsItem(
                name=response.name,
                is_archived=response.is_archived,
                timestamp_created=response.timestamp_created,
            ),
        )
        self.cache.invalidate_queries("tags")
        return response

    def rename_tag(self, name: str, new_name: str) -> contracts.RenameTagResponse:
        response = self.client.rename_tag(name=name, new_name=new_name)
        self.cache.delete_item(kind="tag", key=name)
        self.cache.upsert_item(
            kind="tag",
            key=response.name,
            payload=contracts.ListTagsItem(
                name=response.name,
                is_archived=response.is_archived,
                timestamp_created=response.timestamp_created,
            ),
        )
        self.cache.invalidate_queries("tags")
        self.cache.invalidate_queries("sites")
        return response

    def archive_tag(self, name: str) -> contracts.ArchiveTagResponse:
        response = self.client.archive_tag(name=name)
        self.cache.upsert_item(
            kind="tag",
            key=response.name,
            payload=contracts.ListTagsItem(
                name=response.name,
                is_archived=response.is_archived,
                timestamp_created=response.timestamp_created,
            ),
        )
        self.cache.invalidate_queries("tags")
        self.cache.invalidate_queries("sites")
        return response

    def archive_run(self, run_id: RunId) -> contracts.ArchiveRunResponse:
        response = self.client.archive_run(run_id=run_id)
        self.cache.update_run_from_summary(response)
        self.cache.invalidate_queries("runs")
        return response

    def create_user(
        self,
        username: str,
        is_admin: bool = False,
    ) -> contracts.CreateUserResponse:
        client = self._require_admin_client()
        response = client.create_user(username=username, is_admin=is_admin)
        self.cache.upsert_item(
            kind="user",
            key=str(response.user_id),
            payload=contracts.ListUsersItem(
                user_id=response.user_id,
                username=response.username,
                is_admin=response.is_admin,
                is_archived=response.is_archived,
                timestamp_created=response.timestamp_created,
            ),
        )
        self.cache.invalidate_queries("users")
        return response

    def create_api_token(
        self,
        name: str,
        user_id: UserId | None = None,
    ) -> contracts.CreateApiTokenResponse:
        client = self._require_admin_client()
        response = client.create_api_token(name=name, user_id=user_id)
        self.cache.upsert_item(
            kind="api-token",
            key=str(response.api_token_id),
            payload=contracts.ListApiTokensItem(
                api_token_id=response.api_token_id,
                user_id=response.user_id,
                name=response.name,
                is_revoked=response.is_revoked,
                timestamp_created=response.timestamp_created,
            ),
        )
        self.cache.invalidate_queries("api-tokens")
        return response

    def revoke_api_token(
        self,
        api_token_id: ApiTokenId,
    ) -> contracts.RevokeApiTokenResponse:
        client = self._require_admin_client()
        response = client.revoke_api_token(api_token_id=api_token_id)
        self.cache.upsert_item(
            kind="api-token",
            key=str(response.api_token_id),
            payload=contracts.ListApiTokensItem(
                api_token_id=response.api_token_id,
                user_id=response.user_id,
                name=response.name,
                is_revoked=response.is_revoked,
                timestamp_created=response.timestamp_created,
            ),
        )
        self.cache.invalidate_queries("api-tokens")
        return response

    def _store_site_summary(
        self,
        response: contracts.ArchiveSiteResponse
        | contracts.AddSiteTagsResponse
        | contracts.RemoveSiteTagsResponse,
    ) -> None:
        summary = contracts.ListSitesItem(
            site_id=response.site_id,
            user_id=response.user_id,
            url=response.url,
            tags=response.tags,
            is_archived=response.is_archived,
            timestamp_created=response.timestamp_created,
        )
        self.cache.upsert_item(kind="site", key=str(response.site_id), payload=summary)

        existing = self.cache.read_item(
            kind="site-detail",
            key=str(response.site_id),
            response_type=contracts.GetSiteResponse,
        )
        if existing is not None:
            updated = existing.model_copy(
                update={
                    "url": response.url,
                    "tags": response.tags,
                    "is_archived": response.is_archived,
                    "timestamp_created": response.timestamp_created,
                }
            )
            self.cache.store_site_detail(updated)

    def _require_admin_client(self) -> AdminClient:
        if not isinstance(self.client, AdminClient):
            raise RuntimeError("A nodekit.server.AdminClient is required for admin operations.")
        return self.client


# %% Helpers
def _entry_from_row(row: sqlite3.Row) -> _CachedEntry:
    fetched_at = datetime.datetime.fromisoformat(str(row["fetched_at"]).replace("Z", "+00:00"))
    return _CachedEntry(
        kind=row["kind"],
        key=row["key"],
        contract_type=row["contract_type"],
        payload_json=row["payload_json"],
        source_api_url=row["source_api_url"],
        fetched_at=fetched_at,
        cache_schema_version=row["cache_schema_version"],
    )


def _query_kind(resource: str) -> str:
    return f"query:{resource}"


def _query_key(*, query: contracts.ContractModel, page_cursor: str | None) -> str:
    data = query.model_dump(mode="json", exclude_none=True)
    data.pop("page_cursor", None)
    return _stable_json({"query": data, "page_cursor": page_cursor})


def _stable_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"))


def _timestamp_in_window(*, timestamp: str, start_ms: int | None, end_ms: int | None) -> bool:
    try:
        timestamp_ms = int(
            datetime.datetime.fromisoformat(timestamp.replace("Z", "+00:00")).timestamp() * 1000
        )
    except ValueError:
        return False
    return (start_ms is None or timestamp_ms >= start_ms) and (
        end_ms is None or timestamp_ms <= end_ms
    )


def _utc_now() -> datetime.datetime:
    return datetime.datetime.now(datetime.UTC)


def _site_detail_to_list_item(response: contracts.GetSiteResponse) -> contracts.ListSitesItem:
    return contracts.ListSitesItem(
        site_id=response.site_id,
        user_id=response.user_id,
        url=response.url,
        tags=response.tags,
        is_archived=response.is_archived,
        timestamp_created=response.timestamp_created,
    )


def _run_detail_to_list_item(response: contracts.GetRunResponse) -> contracts.ListRunsItem:
    return contracts.ListRunsItem(
        run_id=response.run_id,
        site_id=response.site_id,
        status=response.status,
        is_archived=response.is_archived,
        timestamp_created=response.timestamp_created,
    )
