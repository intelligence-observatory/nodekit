import datetime
import importlib.util
import sys
from pathlib import Path

from fastapi.testclient import TestClient

from nodekit.server.dashboard.app import create_dashboard_app
from nodekit.server.dashboard.cache import _DashboardCache
from nodekit.server.values import RunStatus


_SCRIPT_PATH = Path(__file__).parents[1] / "scripts" / "view_mock_dashboard.py"
_SCRIPT_SPEC = importlib.util.spec_from_file_location("view_mock_dashboard", _SCRIPT_PATH)
assert _SCRIPT_SPEC is not None
assert _SCRIPT_SPEC.loader is not None
view_mock_dashboard = importlib.util.module_from_spec(_SCRIPT_SPEC)
sys.modules["view_mock_dashboard"] = view_mock_dashboard
_SCRIPT_SPEC.loader.exec_module(view_mock_dashboard)


# %%
def test_mock_dashboard_data_generation_is_deterministic() -> None:
    now = datetime.datetime(2026, 6, 1, 12, 0, tzinfo=datetime.UTC)

    first = view_mock_dashboard.generate_mock_dashboard_data(
        site_count=5,
        run_count=100,
        seed=7,
        now=now,
    )
    second = view_mock_dashboard.generate_mock_dashboard_data(
        site_count=5,
        run_count=100,
        seed=7,
        now=now,
    )

    assert [site.site_id for site in first.sites] == [site.site_id for site in second.sites]
    assert [run.run_id for run in first.runs] == [run.run_id for run in second.runs]
    assert [run.timestamp_created for run in first.runs] == [
        run.timestamp_created for run in second.runs
    ]
    assert len(first.sites) == 5
    assert len(first.runs) == 100
    assert {run.status for run in first.runs} == {
        RunStatus.STARTED,
        RunStatus.SUBMITTED,
        RunStatus.COMPLETED,
        RunStatus.INVALID,
    }
    assert any(run.is_archived for run in first.runs)
    assert any(run.timestamp_created >= now - datetime.timedelta(hours=12) for run in first.runs)
    assert any(run.timestamp_created < now - datetime.timedelta(days=7) for run in first.runs)


def test_mock_dashboard_cache_seeding_exposes_enriched_visible_runs(tmp_path) -> None:
    now = datetime.datetime(2026, 6, 1, 12, 0, tzinfo=datetime.UTC)
    data = view_mock_dashboard.generate_mock_dashboard_data(
        site_count=6,
        run_count=120,
        seed=0,
        now=now,
    )
    archived_run_ids = {str(run.run_id) for run in data.runs if run.is_archived}
    cache = _DashboardCache(
        client=view_mock_dashboard.create_mock_dashboard_client(data),
        cache_dir=tmp_path,
    )
    view_mock_dashboard.seed_mock_dashboard_cache(cache=cache, data=data)
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        health_response = dashboard_client.get("/api/health")
        runs_response = dashboard_client.get("/api/runs")

    assert health_response.status_code == 200
    assert health_response.json()["status"] == "ok"
    assert runs_response.status_code == 200
    runs = runs_response.json()
    assert runs
    assert not archived_run_ids.intersection({run["run_id"] for run in runs})
    assert any(run["duration_msec"] is not None for run in runs)
    assert any(run["event_count"] is not None for run in runs)
    assert any(run["platform_label"] == "Prolific" for run in runs)
    assert any(run["platform_label"] == "MechanicalTurk" for run in runs)


def test_mock_dashboard_manual_refresh_uses_mock_transport(tmp_path) -> None:
    now = datetime.datetime(2026, 6, 1, 12, 0, tzinfo=datetime.UTC)
    data = view_mock_dashboard.generate_mock_dashboard_data(
        site_count=4,
        run_count=125,
        seed=1,
        now=now,
    )
    visible_run_count = sum(not run.is_archived for run in data.runs)
    cache = _DashboardCache(
        client=view_mock_dashboard.create_mock_dashboard_client(data),
        cache_dir=tmp_path,
    )
    app = create_dashboard_app(cache=cache)

    with TestClient(app) as dashboard_client:
        refresh_response = dashboard_client.post("/api/refresh")
        runs_response = dashboard_client.get("/api/runs")

    assert refresh_response.status_code == 200
    assert refresh_response.json()["refreshed"] == {
        "sites": 4,
        "tags": len(data.tags),
        "runs": visible_run_count,
    }
    assert runs_response.status_code == 200
    assert len(runs_response.json()) == visible_run_count
