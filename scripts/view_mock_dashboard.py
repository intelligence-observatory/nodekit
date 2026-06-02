"""Launch the local dashboard with deterministic mock server data."""

from __future__ import annotations

import base64
import datetime
import gzip
import os
import random
import tempfile
from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, TypedDict
from uuid import UUID, uuid5

import httpx

import nodekit as nk
import nodekit.server as nk_server
import nodekit.server.contracts as contracts
from nodekit._internal.ops.build_site.types import (
    BaseMechanicalTurkContext,
    MechanicalTurkContext,
    NoPlatformContext,
    ProlificContext,
)
from nodekit._internal.types.events import Event
from nodekit.server.dashboard.cache import _DashboardCache
from nodekit.server.values import RunStatus
from nodekit.values import Platform


# %% Constants
MOCK_API_URL = "https://mock.nodekit.local"
MOCK_API_TOKEN = "mock-dashboard-token"
MOCK_USER_NAMESPACE = UUID("5f1096d0-4d4e-4bc3-a05b-29e690b044dd")
MOCK_SITE_NAMESPACE = UUID("f3d9b0db-425f-4e23-aa51-69ef5f183ee4")
MOCK_RUN_NAMESPACE = UUID("66cad706-c801-4f4b-9e57-23d7140306c9")
DEFAULT_SITE_COUNT = 200
DEFAULT_RUN_COUNT = 15000
DEFAULT_SEED = 0
DEFAULT_ARCHIVED_RUN_FRACTION = 0.05
TAG_POOL = (
    "pilot",
    "cor-task",
    "attention",
    "prolific",
    "v1",
    "qa",
    "memory",
    "screening",
    "production",
    "mobile",
)
STATUS_WEIGHTS = (
    (RunStatus.SUBMITTED, 0.66),
    (RunStatus.COMPLETED, 0.16),
    (RunStatus.STARTED, 0.12),
    (RunStatus.INVALID, 0.06),
)


# %% Models
@dataclass(frozen=True)
class MockDashboardData:
    """Generated mock data used by the local dashboard dev launcher."""

    sites: tuple[contracts.GetSiteResponse, ...]
    tags: tuple[contracts.ListTagsItem, ...]
    runs: tuple[contracts.GetRunResponse, ...]


class _RunRecruitmentContext(TypedDict):
    recruitment_platform: Platform
    recruiter_study_id: str | None
    recruiter_participant_id: str | None
    recruiter_session_id: str | None


# %% Launcher
def main() -> None:
    """Generate mock dashboard data and start the local dashboard."""

    site_count = _read_positive_int_env("MOCK_DASHBOARD_SITES", DEFAULT_SITE_COUNT)
    run_count = _read_nonnegative_int_env("MOCK_DASHBOARD_RUNS", DEFAULT_RUN_COUNT)
    seed = _read_int_env("MOCK_DASHBOARD_SEED", DEFAULT_SEED)
    cache_dir = os.environ.get("MOCK_DASHBOARD_CACHE_DIR")

    if cache_dir:
        _run_mock_dashboard(
            cache_dir=Path(cache_dir).expanduser(),
            site_count=site_count,
            run_count=run_count,
            seed=seed,
        )
        return

    with tempfile.TemporaryDirectory(prefix="nodekit-mock-dashboard-") as temp_cache_dir:
        _run_mock_dashboard(
            cache_dir=Path(temp_cache_dir),
            site_count=site_count,
            run_count=run_count,
            seed=seed,
        )


def _run_mock_dashboard(
    *,
    cache_dir: Path,
    site_count: int,
    run_count: int,
    seed: int,
) -> None:
    now = datetime.datetime.now(datetime.UTC)
    data = generate_mock_dashboard_data(
        site_count=site_count,
        run_count=run_count,
        seed=seed,
        now=now,
    )
    client = create_mock_dashboard_client(data)
    cache = _DashboardCache(client=client, cache_dir=cache_dir)
    seed_mock_dashboard_cache(cache=cache, data=data)

    print(f"NodeKit mock dashboard: {len(data.sites)} sites, {len(data.runs)} runs, seed {seed}")
    nk.server.start_dashboard(client=client, cache_dir=cache_dir, open_browser=False)


# %% Mock data
def generate_mock_dashboard_data(
    *,
    site_count: int = DEFAULT_SITE_COUNT,
    run_count: int = DEFAULT_RUN_COUNT,
    seed: int = DEFAULT_SEED,
    now: datetime.datetime | None = None,
) -> MockDashboardData:
    """Generate deterministic dashboard contracts for local development."""

    if site_count < 1:
        raise ValueError("site_count must be at least 1.")
    if run_count < 0:
        raise ValueError("run_count must be non-negative.")

    now = _ensure_utc(now or datetime.datetime.now(datetime.UTC))
    rng = random.Random(seed)
    user_id = uuid5(MOCK_USER_NAMESPACE, f"user-{seed}")
    graph = _make_graph()
    sites = tuple(
        _make_site(index=index, seed=seed, rng=rng, user_id=user_id, graph=graph, now=now)
        for index in range(site_count)
    )
    tags = _make_tags(sites=sites, now=now)
    runs = tuple(
        _make_run(
            index=index,
            seed=seed,
            rng=rng,
            sites=sites,
            graph=graph,
            now=now,
        )
        for index in range(run_count)
    )
    runs = tuple(sorted(runs, key=lambda run: (run.timestamp_created, run.run_id), reverse=True))
    return MockDashboardData(sites=sites, tags=tags, runs=runs)


def seed_mock_dashboard_cache(
    *,
    cache: _DashboardCache,
    data: MockDashboardData,
) -> None:
    """Write mock data into the real dashboard cache."""

    for site in data.sites:
        cache.store_site_detail(site)
    for tag in data.tags:
        cache.upsert_item(kind="tag", key=tag.name, payload=tag)
    for run in data.runs:
        cache.store_run_detail(run)


def create_mock_dashboard_client(data: MockDashboardData) -> nk_server.Client:
    """Create a NodeKit server client backed by an in-process mock transport."""

    return nk_server.Client(
        api_url=MOCK_API_URL,
        api_token=MOCK_API_TOKEN,
        transport=httpx.MockTransport(_make_transport_handler(data)),
    )


# %% Transport
def _make_transport_handler(data: MockDashboardData) -> Callable[[httpx.Request], httpx.Response]:
    site_by_id = {str(site.site_id): site for site in data.sites}
    run_by_id = {str(run.run_id): run for run in data.runs}

    def handler(request: httpx.Request) -> httpx.Response:
        path = request.url.path.rstrip("/") or "/"
        if request.method == "GET" and path == "/health":
            return _json_response({"status": "ok"})
        if request.method == "GET" and path == "/sites":
            items = _filter_sites(data.sites, request)
            return _page_response(
                request=request,
                items=[_site_detail_to_list_item(site).model_dump(mode="json") for site in items],
            )
        if request.method == "GET" and path == "/tags":
            return _page_response(
                request=request,
                items=[tag.model_dump(mode="json") for tag in _filter_tags(data.tags, request)],
            )
        if request.method == "GET" and path == "/runs":
            items = _filter_runs(data.runs, request)
            return _page_response(
                request=request,
                items=[_run_detail_to_list_item(run).model_dump(mode="json") for run in items],
            )
        if request.method == "GET" and path.startswith("/sites/"):
            site_id = path.removeprefix("/sites/")
            site = site_by_id.get(site_id)
            if site is not None:
                return _json_response(site.model_dump(mode="json"))
        if request.method == "GET" and path.startswith("/runs/"):
            run_id = path.removeprefix("/runs/")
            run = run_by_id.get(run_id)
            if run is not None:
                return _json_response(run.model_dump(mode="json"))
        return httpx.Response(404, json={"detail": "Not found."}, request=request)

    return handler


def _filter_sites(
    sites: Sequence[contracts.GetSiteResponse],
    request: httpx.Request,
) -> list[contracts.GetSiteResponse]:
    params = request.url.params
    include_archived = _query_bool(params.get("include_archived"))
    site_ids = set(params.get_list("site_ids"))
    tags = set(params.get_list("tags"))
    return [
        site
        for site in sites
        if (include_archived or not site.is_archived)
        and (not site_ids or str(site.site_id) in site_ids)
        and (not tags or tags.issubset(site.tags))
    ]


def _filter_tags(
    tags: Sequence[contracts.ListTagsItem],
    request: httpx.Request,
) -> list[contracts.ListTagsItem]:
    params = request.url.params
    include_archived = _query_bool(params.get("include_archived"))
    names = set(params.get_list("names"))
    return [
        tag
        for tag in tags
        if (include_archived or not tag.is_archived) and (not names or tag.name in names)
    ]


def _filter_runs(
    runs: Sequence[contracts.GetRunResponse],
    request: httpx.Request,
) -> list[contracts.GetRunResponse]:
    params = request.url.params
    include_archived = _query_bool(params.get("include_archived"))
    run_ids = set(params.get_list("run_ids"))
    site_id = params.get("site_id")
    statuses = set(params.get_list("statuses"))
    recruitment_platforms = set(params.get_list("recruitment_platforms"))
    recruiter_study_ids = set(params.get_list("recruiter_study_ids"))
    recruiter_participant_ids = set(params.get_list("recruiter_participant_ids"))
    recruiter_session_ids = set(params.get_list("recruiter_session_ids"))
    return [
        run
        for run in runs
        if (include_archived or not run.is_archived)
        and (not run_ids or str(run.run_id) in run_ids)
        and (site_id is None or str(run.site_id) == site_id)
        and (not statuses or run.status.value in statuses)
        and (not recruitment_platforms or run.recruitment_platform in recruitment_platforms)
        and (not recruiter_study_ids or run.recruiter_study_id in recruiter_study_ids)
        and (
            not recruiter_participant_ids
            or run.recruiter_participant_id in recruiter_participant_ids
        )
        and (not recruiter_session_ids or run.recruiter_session_id in recruiter_session_ids)
    ]


def _page_response(
    *,
    request: httpx.Request,
    items: list[dict[str, object]],
) -> httpx.Response:
    max_items = int(request.url.params.get("max_items", "100"))
    start = int(request.url.params.get("page_cursor", "0") or "0")
    end = start + max_items
    next_page_cursor = str(end) if end < len(items) else None
    return _json_response(
        {
            "items": items[start:end],
            "next_page_cursor": next_page_cursor,
        }
    )


# %% Builders
def _make_site(
    *,
    index: int,
    seed: int,
    rng: random.Random,
    user_id: UUID,
    graph: nk.Graph,
    now: datetime.datetime,
) -> contracts.GetSiteResponse:
    tag_count = rng.randint(2, 4)
    tags = tuple(sorted(rng.sample(TAG_POOL, tag_count)))
    site_id = uuid5(MOCK_SITE_NAMESPACE, f"{seed}:site:{index}")
    timestamp_created = now - datetime.timedelta(days=rng.randint(1, 45), hours=rng.randint(0, 23))
    return contracts.GetSiteResponse(
        site_id=site_id,
        user_id=user_id,
        url=f"{MOCK_API_URL}/s/{site_id}",
        conditions=(
            contracts.SiteConditionDetailItem(
                condition_id="default",
                allocation_weight=1,
                graph_json_gzip=_json_gzip_b64(graph.model_dump_json()),
                assets=(),
            ),
        ),
        tags=tags,
        is_archived=False,
        timestamp_created=timestamp_created,
    )


def _make_tags(
    *,
    sites: Iterable[contracts.GetSiteResponse],
    now: datetime.datetime,
) -> tuple[contracts.ListTagsItem, ...]:
    names = sorted({tag for site in sites for tag in site.tags})
    return tuple(
        contracts.ListTagsItem(
            name=name,
            is_archived=False,
            timestamp_created=now - datetime.timedelta(days=60),
        )
        for name in names
    )


def _make_run(
    *,
    index: int,
    seed: int,
    rng: random.Random,
    sites: Sequence[contracts.GetSiteResponse],
    graph: nk.Graph,
    now: datetime.datetime,
) -> contracts.GetRunResponse:
    site = sites[index % len(sites)] if index < len(sites) else rng.choice(sites)
    status = _status_for_index(index=index, rng=rng)
    timestamp_created = _timestamp_for_index(index=index, rng=rng, now=now)
    is_archived = rng.random() < DEFAULT_ARCHIVED_RUN_FRACTION
    run_id = uuid5(MOCK_RUN_NAMESPACE, f"{seed}:run:{index}")
    duration_msec = rng.randint(8_000, 420_000)
    event_count = rng.randint(5, 24)
    trace = _make_trace(graph=graph, duration_msec=duration_msec, event_count=event_count)
    site_submission = _make_site_submission(
        trace=trace,
        index=index,
        seed=seed,
    )
    recruitment_context = _recruitment_context(site_submission)
    return contracts.GetRunResponse(
        run_id=run_id,
        site_id=site.site_id,
        condition_id=site.conditions[0].condition_id,
        status=status,
        **recruitment_context,
        is_archived=is_archived,
        timestamp_created=timestamp_created,
        site_submission_json_gzip=_json_gzip_b64(site_submission.model_dump_json()),
    )


def _json_gzip_b64(json_value: str) -> str:
    return base64.b64encode(gzip.compress(json_value.encode("utf-8"), mtime=0)).decode("ascii")


def _status_for_index(*, index: int, rng: random.Random) -> RunStatus:
    statuses = tuple(status for status, _weight in STATUS_WEIGHTS)
    if index < len(statuses):
        return statuses[index]
    threshold = rng.random()
    cumulative = 0.0
    for status, weight in STATUS_WEIGHTS:
        cumulative += weight
        if threshold <= cumulative:
            return status
    return RunStatus.SUBMITTED


def _timestamp_for_index(
    *,
    index: int,
    rng: random.Random,
    now: datetime.datetime,
) -> datetime.datetime:
    anchors = (
        datetime.timedelta(hours=2),
        datetime.timedelta(hours=18),
        datetime.timedelta(days=3),
        datetime.timedelta(days=20),
    )
    if index < len(anchors):
        return now - anchors[index]

    max_seconds = 30 * 24 * 60 * 60
    age_seconds = int((rng.random() ** 2) * max_seconds)
    return now - datetime.timedelta(seconds=age_seconds)


def _make_graph() -> nk.Graph:
    return nk.Graph(
        nodes={
            "start": nk.Node(sensor=nk.sensors.WaitSensor(duration_msec=1)),
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )


def _make_trace(
    *,
    graph: nk.Graph,
    duration_msec: int,
    event_count: int,
) -> nk.Trace:
    events: list[Event] = [
        nk.events.TraceStartedEvent(t=0),
        nk.events.NodeStartedEvent(t=1, node_address=["start"]),
        nk.events.ActionTakenEvent(
            t=max(2, duration_msec // 2),
            node_address=["start"],
            action=nk.actions.WaitAction(),
        ),
        nk.events.NodeEndedEvent(t=duration_msec - 1, node_address=["start"]),
    ]
    filler_count = max(0, event_count - 5)
    for offset in range(filler_count):
        events.append(
            nk.events.PointerSampledEvent(
                t=2 + offset,
                x=0,
                y=0,
                kind="move",
            )
        )
    events.append(nk.events.TraceEndedEvent(t=duration_msec))
    return nk.Trace(graph=graph, events=events)


def _make_site_submission(
    *,
    trace: nk.Trace,
    index: int,
    seed: int,
) -> nk.SiteSubmission:
    trace_json_gzip = gzip.compress(trace.model_dump_json().encode("utf-8"), mtime=0)
    match index % 3:
        case 0:
            platform_context = NoPlatformContext(platform="NoPlatform")
        case 1:
            platform_context = ProlificContext(
                platform="Prolific",
                completion_code=f"NODEKIT-{seed}-{index}",
                prolific_pid=f"pid-{seed}-{index}",
                study_id=f"study-{seed}",
                session_id=f"session-{seed}-{index}",
            )
        case _:
            platform_context = MechanicalTurkContext(
                platform="MechanicalTurk",
                assignment_id=f"assignment-{seed}-{index}",
                worker_id=f"worker-{seed}-{index}",
                hit_id=f"hit-{seed}",
                turk_submit_to="https://workersandbox.mturk.com/mturk/externalSubmit",
            )
    return nk.SiteSubmission(
        trace_gzipped_base64=base64.b64encode(trace_json_gzip).decode("ascii"),
        platform_context=platform_context,
    )


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


def _site_detail_to_list_item(response: contracts.GetSiteResponse) -> contracts.ListSitesItem:
    return contracts.ListSitesItem(
        site_id=response.site_id,
        user_id=response.user_id,
        url=response.url,
        conditions=response.conditions,
        tags=response.tags,
        is_archived=response.is_archived,
        timestamp_created=response.timestamp_created,
    )


def _run_detail_to_list_item(response: contracts.GetRunResponse) -> contracts.ListRunsItem:
    return contracts.ListRunsItem(
        run_id=response.run_id,
        site_id=response.site_id,
        condition_id=response.condition_id,
        status=response.status,
        recruitment_platform=response.recruitment_platform,
        recruiter_study_id=response.recruiter_study_id,
        recruiter_participant_id=response.recruiter_participant_id,
        recruiter_session_id=response.recruiter_session_id,
        is_archived=response.is_archived,
        timestamp_created=response.timestamp_created,
    )


# %% Helpers
def _json_response(payload: dict[str, object]) -> httpx.Response:
    return httpx.Response(200, json=payload)


def _query_bool(value: str | None) -> bool:
    return value in {"1", "true", "True", "yes", "on"}


def _ensure_utc(value: datetime.datetime) -> datetime.datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=datetime.UTC)
    return value.astimezone(datetime.UTC)


def _read_int_env(name: str, default: int) -> int:
    value = os.environ.get(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError as exc:
        raise ValueError(f"{name} must be an integer.") from exc


def _read_positive_int_env(name: str, default: int) -> int:
    value = _read_int_env(name, default)
    if value < 1:
        raise ValueError(f"{name} must be at least 1.")
    return value


def _read_nonnegative_int_env(name: str, default: int) -> int:
    value = _read_int_env(name, default)
    if value < 0:
        raise ValueError(f"{name} must be non-negative.")
    return value


if __name__ == "__main__":
    main()
