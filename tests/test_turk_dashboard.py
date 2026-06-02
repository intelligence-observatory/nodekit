import datetime
import socket
import time
from decimal import Decimal
from pathlib import Path
from typing import Literal, cast

import httpx
import pytest
from fastapi.testclient import TestClient

from nodekit.experimental.turk.dashboard import create_dashboard_app, start_dashboard
from nodekit.experimental.turk.models import Assignment, BonusPayment, HIT
from nodekit.experimental.turk.recruiter import HitRecord, MturkRecruiterClient


# %% Fakes
class FakeCache:
    root = Path("/tmp/nodekit-test-cache")


class FakeDashboardRecruiter:
    def __init__(self) -> None:
        self.cache = FakeCache()
        self.hit_refreshes: list[str] = []
        self.assignment_refreshes: list[str] = []
        self.bonus_refreshes: list[str] = []
        self.records = tuple(_record(index) for index in range(25))
        self.assignments = tuple(_assignment(index) for index in range(25))
        self.bonus_payments: tuple[BonusPayment, ...] = ()

    def get_account_balance(self) -> Decimal:
        return Decimal("12.34")

    def iter_hits(self, *, refresh: str, include_closed: bool):
        self.hit_refreshes.append(refresh)
        assert include_closed is True
        yield from self.records

    def get_hit(self, hit_id: str, *, refresh: str) -> HitRecord:
        return next(record for record in self.records if record.hit_id == hit_id)

    def iter_assignments(self, hit_id: str, *, refresh: str):
        self.assignment_refreshes.append(refresh)
        yield from self.assignments

    def iter_bonus_payments(self, *, hit_id: str, refresh: str):
        self.bonus_refreshes.append(refresh)
        yield from self.bonus_payments

    def close_hit(self, hit_id: str) -> None:
        raise AssertionError("Dashboard must not mutate HITs.")

    def approve_assignment(self, assignment_id: str) -> None:
        raise AssertionError("Dashboard must not mutate assignments.")

    def pay_bonus(self, **kwargs) -> None:
        raise AssertionError("Dashboard must not pay bonuses.")


# %% Helpers
def _now() -> datetime.datetime:
    return datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc)


def _hit(
    *,
    hit_id: str,
    title: str,
    status: Literal["Assignable", "Unassignable", "Reviewable", "Reviewing", "Disposed"] = (
        "Assignable"
    ),
) -> HIT:
    return HIT(
        HITId=hit_id,
        HITTypeId="type-1",
        CreationTime=_now(),
        Title=title,
        Description="Description",
        Question="<ExternalQuestion />",
        Keywords="nodekit",
        HITStatus=status,
        MaxAssignments=25,
        Reward=Decimal("1.00"),
        AutoApprovalDelayInSeconds=3600,
        Expiration=_now(),
        AssignmentDurationInSeconds=600,
        RequesterAnnotation=None,
        HITReviewStatus="NotReviewed",
        NumberOfAssignmentsPending=0,
        NumberOfAssignmentsAvailable=25,
        NumberOfAssignmentsCompleted=0,
    )


def _record(index: int) -> HitRecord:
    hit_id = f"hit-{index:02d}"
    title = f"Dashboard HIT {index:02d}"
    created = _now() + datetime.timedelta(seconds=index)
    return HitRecord(
        hit_id=hit_id,
        url=f"https://nodekit.example/sites/{index:02d}",
        title=title,
        hit=_hit(hit_id=hit_id, title=title),
        timestamp_created=created,
        timestamp_refreshed=created,
    )


def _assignment(index: int) -> Assignment:
    return Assignment(
        AssignmentId=f"assignment-{index:02d}",
        WorkerId=f"worker-{index:02d}",
        HITId="hit-01",
        AssignmentStatus="Submitted",
        Answer="<Answer />",
    )


# %% Tests
def test_dashboard_lists_hits_with_twenty_per_page_and_refresh_query() -> None:
    recruiter = FakeDashboardRecruiter()
    app = create_dashboard_app(cast(MturkRecruiterClient, recruiter), default_refresh="auto")

    response = TestClient(app).get("/?refresh=always")

    assert response.status_code == 200
    assert recruiter.hit_refreshes == ["always"]
    assert response.text.count('href="/hits/hit-') == 20
    assert "Dashboard HIT 24" in response.text
    assert "Dashboard HIT 05" in response.text
    assert "Dashboard HIT 04" not in response.text
    assert "Next" in response.text


def test_dashboard_hit_detail_paginates_assignments() -> None:
    recruiter = FakeDashboardRecruiter()
    app = create_dashboard_app(cast(MturkRecruiterClient, recruiter), default_refresh="auto")
    client = TestClient(app)

    first_page = client.get("/hits/hit-01")
    second_page = client.get("/hits/hit-01?assignments_page=2")

    assert first_page.status_code == 200
    assert first_page.text.count("assignment-") == 20
    assert "assignment-19" in first_page.text
    assert "assignment-20" not in first_page.text
    assert second_page.status_code == 200
    assert "assignment-20" in second_page.text
    assert "assignment-24" in second_page.text
    assert "assignment-19" not in second_page.text


def test_start_dashboard_rejects_remote_hosts_by_default(tmp_path: Path) -> None:
    client = MturkRecruiterClient(sandbox=True, cachedir=tmp_path, mturk_client=object())

    with pytest.raises(ValueError, match="local"):
        client.start_dashboard(host="0.0.0.0", print_url=False)


def test_start_dashboard_is_non_blocking_and_prints_url(
    capsys: pytest.CaptureFixture[str],
) -> None:
    recruiter = FakeDashboardRecruiter()
    handle = start_dashboard(cast(MturkRecruiterClient, recruiter))

    try:
        deadline = time.monotonic() + 5
        response = None
        while time.monotonic() < deadline:
            try:
                response = httpx.get(f"{handle.url}/health", timeout=0.2)
                if response.status_code == 200:
                    break
            except httpx.HTTPError:
                time.sleep(0.05)
        assert response is not None
        assert response.status_code == 200
        assert f"MTurk dashboard: {handle.url}" in capsys.readouterr().out
    finally:
        handle.stop()


def test_start_dashboard_uses_requested_port_when_available() -> None:
    recruiter = FakeDashboardRecruiter()
    port = _available_port()
    handle = start_dashboard(cast(MturkRecruiterClient, recruiter), port=port, print_url=False)

    try:
        assert handle.port == port
    finally:
        handle.stop()


def test_start_dashboard_falls_back_when_requested_port_is_unavailable() -> None:
    recruiter = FakeDashboardRecruiter()
    preferred_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    preferred_socket.bind(("127.0.0.1", 0))
    preferred_socket.listen(1)
    preferred_port = int(preferred_socket.getsockname()[1])

    try:
        handle = start_dashboard(
            cast(MturkRecruiterClient, recruiter),
            port=preferred_port,
            print_url=False,
        )
        try:
            assert handle.port != preferred_port
            assert handle.url == f"http://127.0.0.1:{handle.port}"
        finally:
            handle.stop()
    finally:
        preferred_socket.close()


def _available_port() -> int:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])
    finally:
        sock.close()
