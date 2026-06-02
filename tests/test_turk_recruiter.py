import datetime
from decimal import Decimal
from pathlib import Path
from typing import Iterable, Literal

import pytest

from nodekit.experimental.turk import cache as cache_module
from nodekit.experimental.turk.cache import CacheMissError, MturkCache
from nodekit.experimental.turk.client import CreateHitRequest, SendBonusPaymentRequest
from nodekit.experimental.turk.models import (
    Assignment,
    BonusPayment,
    HIT,
    QualificationRequirement,
    QualificationType,
)
from nodekit.experimental.turk.recruiter import HitRecord, MturkRecruiterClient


# %% Fakes
class FakeMturkClient:
    def __init__(self):
        self.hits: dict[str, HIT] = {
            "hit-1": _hit(hit_id="hit-1"),
        }
        self.assignments: tuple[Assignment, ...] = ()
        self.bonus_payments: tuple[BonusPayment, ...] = ()
        self.iter_hits_calls = 0
        self.get_hit_calls: list[str] = []
        self.create_hit_requests: list[CreateHitRequest] = []
        self.created_qualification_types: list[tuple[str, str | None]] = []
        self.granted_qualifications: list[tuple[str, str]] = []
        self.deleted_qualification_type_ids: list[str] = []
        self.cleaned_hit_ids: list[str] = []
        self.approved_assignment_ids: list[str] = []
        self.sent_bonus_requests: list[SendBonusPaymentRequest] = []
        self.iter_bonus_payment_calls: list[tuple[str | None, str | None]] = []

    def get_account_balance(self) -> Decimal:
        return Decimal("12.34")

    def create_qualification_type(
        self,
        unique_name: str,
        description: str | None = None,
    ) -> QualificationType:
        qualification_type_id = f"qual-{len(self.created_qualification_types) + 1}"
        self.created_qualification_types.append((unique_name, description))
        return QualificationType(
            QualificationTypeId=qualification_type_id,
            Name=unique_name,
            Description=description,
            QualificationTypeStatus="Active",
        )

    def list_qualification_types(self) -> list[QualificationType]:
        return [
            QualificationType(
                QualificationTypeId=f"qual-{index}",
                Name=unique_name,
                Description=description,
                QualificationTypeStatus="Active",
            )
            for index, (unique_name, description) in enumerate(
                self.created_qualification_types,
                start=1,
            )
        ]

    def grant_qualification(self, qualification_type_id: str, worker_id: str) -> None:
        self.granted_qualifications.append((qualification_type_id, worker_id))

    def package_qualification_exists_requirement(self, qual_type: QualificationType):
        from nodekit.experimental.turk.models import QualificationRequirement

        return QualificationRequirement(
            QualificationTypeId=qual_type.QualificationTypeId,
            Comparator="Exists",
            ActionsGuarded="DiscoverPreviewAndAccept",
        )

    def package_qualification_does_not_exist_requirement(self, qual_type: QualificationType):
        from nodekit.experimental.turk.models import QualificationRequirement

        return QualificationRequirement(
            QualificationTypeId=qual_type.QualificationTypeId,
            Comparator="DoesNotExist",
            ActionsGuarded="DiscoverPreviewAndAccept",
        )

    def create_hit(self, request: CreateHitRequest) -> HIT:
        self.create_hit_requests.append(request)
        hit = _hit(
            hit_id="hit-created",
            title=request.title,
            question=f"<ExternalQuestion><ExternalURL>{request.site_url}</ExternalURL></ExternalQuestion>",
            qualification_requirements=request.qualification_requirements,
            requester_annotation=request.unique_request_token,
        )
        self.hits[hit.HITId] = hit
        return hit

    def iter_hits(self):
        self.iter_hits_calls += 1
        yield from self.hits.values()

    def get_hit(self, hit_id: str) -> HIT:
        self.get_hit_calls.append(hit_id)
        return self.hits[hit_id]

    def iter_assignments(self, hit_id: str):
        yield from self.assignments

    def approve_assignment(self, assignment_id: str) -> None:
        self.approved_assignment_ids.append(assignment_id)

    def cleanup_hit(self, hit_id: str) -> None:
        self.cleaned_hit_ids.append(hit_id)

    def delete_worker_qualification_type(self, qualification_type_id: str) -> None:
        self.deleted_qualification_type_ids.append(qualification_type_id)

    def iter_bonus_payments(
        self,
        *,
        hit_id: str | None = None,
        assignment_id: str | None = None,
    ):
        self.iter_bonus_payment_calls.append((hit_id, assignment_id))
        yield from self.bonus_payments

    def send_bonus_payment(self, request: SendBonusPaymentRequest) -> None:
        self.sent_bonus_requests.append(request)


# %% Helpers
def _now() -> datetime.datetime:
    return datetime.datetime.now(tz=datetime.timezone.utc)


def _hit(
    *,
    hit_id: str,
    title: str = "Title",
    status: Literal["Assignable", "Unassignable", "Reviewable", "Reviewing", "Disposed"] = (
        "Assignable"
    ),
    completed: int = 0,
    question: str = "<ExternalQuestion><ExternalURL>https://nodekit.example/s/site-1</ExternalURL></ExternalQuestion>",
    qualification_requirements: Iterable[QualificationRequirement] = (),
    requester_annotation: str = "token-1",
) -> HIT:
    return HIT(
        HITId=hit_id,
        HITTypeId="hit-type-1",
        HITGroupId=None,
        CreationTime=_now(),
        Title=title,
        Description="Description",
        Question=question,
        Keywords="nodekit",
        HITStatus=status,
        MaxAssignments=2,
        Reward=Decimal("1.00"),
        AutoApprovalDelayInSeconds=3600,
        Expiration=_now(),
        AssignmentDurationInSeconds=600,
        RequesterAnnotation=requester_annotation,
        QualificationRequirements=list(qualification_requirements),
        HITReviewStatus="NotReviewed",
        NumberOfAssignmentsPending=0,
        NumberOfAssignmentsAvailable=2,
        NumberOfAssignmentsCompleted=completed,
    )


def _assignment(assignment_id: str, hit_id: str = "hit-1") -> Assignment:
    return Assignment(
        AssignmentId=assignment_id,
        WorkerId=f"worker-{assignment_id}",
        HITId=hit_id,
        AssignmentStatus="Submitted",
        Answer="<Answer />",
    )


def _bonus_payment(
    *,
    worker_id: str = "worker-1",
    assignment_id: str = "assignment-1",
    amount: str = "1.25",
    reason: str = "Good work.",
) -> BonusPayment:
    return BonusPayment(
        WorkerId=worker_id,
        AssignmentId=assignment_id,
        BonusAmount=Decimal(amount),
        Reason=reason,
        GrantTime=_now(),
    )


def _client(tmp_path: Path, fake: FakeMturkClient | None = None) -> MturkRecruiterClient:
    return MturkRecruiterClient(
        sandbox=True,
        cachedir=tmp_path,
        mturk_client=fake or FakeMturkClient(),
    )


# %% Tests
def test_default_cache_path_uses_platformdirs_namespace(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(
        cache_module,
        "user_cache_dir",
        lambda appname, appauthor: str(tmp_path / appname / appauthor),
    )

    sandbox_cache = MturkCache.default(sandbox=True)
    production_cache = MturkCache.default(sandbox=False)

    assert sandbox_cache.root == tmp_path / "nodekit" / "nodekit" / "mturk" / "sandbox"
    assert production_cache.root == tmp_path / "nodekit" / "nodekit" / "mturk" / "production"


def test_get_account_balance_delegates_to_mturk_client(tmp_path: Path) -> None:
    client = _client(tmp_path)

    assert client.get_account_balance() == Decimal("12.34")


def test_get_hit_refresh_never_returns_cache_and_raises_on_miss(tmp_path: Path) -> None:
    client = _client(tmp_path)
    record = HitRecord(
        hit_id="hit-1",
        url="https://nodekit.example/s/site-1",
        title="Cached",
        hit=_hit(hit_id="hit-1", title="Cached"),
        timestamp_created=_now(),
        timestamp_refreshed=_now(),
    )
    client._write_hit_record(record=record, fetched_at=_now())

    cached = client.get_hit("hit-1", refresh="never")

    assert cached.title == "Cached"
    with pytest.raises(CacheMissError):
        client.get_hit("missing", refresh="never")


def test_get_hit_refresh_always_overwrites_cache(tmp_path: Path) -> None:
    fake = FakeMturkClient()
    fake.hits["hit-1"] = _hit(hit_id="hit-1", title="Fresh")
    client = _client(tmp_path, fake=fake)
    old_record = HitRecord(
        hit_id="hit-1",
        url="https://nodekit.example/s/site-1",
        title="Old",
        hit=_hit(hit_id="hit-1", title="Old"),
        timestamp_created=_now(),
        timestamp_refreshed=_now(),
    )
    client._write_hit_record(record=old_record, fetched_at=_now())

    fresh = client.get_hit("hit-1", refresh="always")
    cached_again = client.get_hit("hit-1", refresh="never")

    assert fresh.title == "Fresh"
    assert cached_again.title == "Fresh"
    assert fake.get_hit_calls == ["hit-1"]


def test_iter_hits_discovers_and_caches_remote_hits_when_cache_is_empty(tmp_path: Path) -> None:
    fake = FakeMturkClient()
    fake.hits["hit-2"] = _hit(hit_id="hit-2", title="Remote")
    client = _client(tmp_path, fake=fake)

    hits = list(client.iter_hits())
    cached = client.get_hit("hit-2", refresh="never")

    assert [hit.hit_id for hit in hits] == ["hit-2", "hit-1"]
    assert hits[0].title == "Remote"
    assert cached.title == "Remote"
    assert fake.iter_hits_calls == 1
    assert fake.get_hit_calls == []


def test_iter_hits_refresh_never_uses_cache_only(tmp_path: Path) -> None:
    fake = FakeMturkClient()
    client = _client(tmp_path, fake=fake)

    hits = list(client.iter_hits(refresh="never"))

    assert hits == []
    assert fake.iter_hits_calls == 0


def test_auto_refresh_skips_disposed_hit_and_refreshes_stale_assignable_hit(
    tmp_path: Path,
) -> None:
    fake = FakeMturkClient()
    client = _client(tmp_path, fake=fake)
    old = _now() - datetime.timedelta(hours=1)
    disposed_record = HitRecord(
        hit_id="hit-1",
        url="https://nodekit.example/s/site-1",
        title="Disposed",
        hit=_hit(hit_id="hit-1", title="Disposed", status="Disposed"),
        timestamp_created=old,
        timestamp_refreshed=old,
    )
    client.cache.write_payload(
        path=client.cache.hit_path("hit-1"),
        payload=disposed_record,
        fetched_at=old,
    )

    disposed = client.get_hit("hit-1", refresh="auto")
    assert disposed.title == "Disposed"
    assert fake.get_hit_calls == []

    fake.hits["hit-2"] = _hit(hit_id="hit-2", title="Fresh")
    stale_record = HitRecord(
        hit_id="hit-2",
        url="https://nodekit.example/s/site-2",
        title="Stale",
        hit=_hit(hit_id="hit-2", title="Stale", status="Assignable"),
        timestamp_created=old,
        timestamp_refreshed=old,
    )
    client.cache.write_payload(
        path=client.cache.hit_path("hit-2"),
        payload=stale_record,
        fetched_at=old,
    )

    fresh = client.get_hit("hit-2", refresh="auto")
    assert fresh.title == "Fresh"
    assert fake.get_hit_calls == ["hit-2"]


def test_incomplete_assignment_collection_is_refetched(tmp_path: Path) -> None:
    fake = FakeMturkClient()
    fake.hits["hit-1"] = _hit(hit_id="hit-1", completed=2)
    fake.assignments = (_assignment("assignment-1"), _assignment("assignment-2"))
    client = _client(tmp_path, fake=fake)
    client._write_hit_record(
        record=HitRecord(
            hit_id="hit-1",
            url="https://nodekit.example/s/site-1",
            title="Title",
            hit=fake.hits["hit-1"],
            timestamp_created=_now(),
            timestamp_refreshed=_now(),
        ),
        fetched_at=_now(),
    )
    client.cache.write_collection(
        path=client.cache.assignment_collection_path("hit-1"),
        items=[_assignment("assignment-1")],
        complete=False,
        fetched_at=_now(),
    )

    assignments = list(client.iter_assignments("hit-1", refresh="auto"))
    cached = client.cache.read_collection(client.cache.assignment_collection_path("hit-1"))

    assert [assignment.AssignmentId for assignment in assignments] == [
        "assignment-1",
        "assignment-2",
    ]
    assert cached is not None
    assert cached.complete is True


def test_create_hit_creates_worker_qualifications_and_caches_hit(tmp_path: Path) -> None:
    fake = FakeMturkClient()
    client = _client(tmp_path, fake=fake)

    record = client.create_hit(
        url="https://nodekit.example/s/site-1",
        title="Title",
        description="Description",
        keywords=["nodekit"],
        num_assignments=2,
        completion_reward_usd="1.25",
        duration_sec=600,
        auto_approval_delay_sec=3600,
        required_qualification_type_ids=["qual-required"],
        disallowed_qualification_type_ids=["qual-disallowed"],
        allowed_worker_ids=["worker-allow"],
        blocked_worker_ids=["worker-block"],
    )

    request = fake.create_hit_requests[0]
    assert record.hit_id == "hit-created"
    assert record.qualification_type_ids == (
        "qual-required",
        "qual-disallowed",
        "qual-1",
        "qual-2",
    )
    assert "allowed_worker_ids" not in record.model_dump()
    assert "blocked_worker_ids" not in record.model_dump()
    assert "qualification_type_ids" not in record.model_dump()
    assert fake.created_qualification_types == [
        (
            f"nodekit:turk-recruiter:{request.unique_request_token}:allow",
            "NodeKit MTurk worker allowlist.",
        ),
        (
            f"nodekit:turk-recruiter:{request.unique_request_token}:block",
            "NodeKit MTurk worker blocklist.",
        ),
    ]
    assert [
        requirement.QualificationTypeId for requirement in request.qualification_requirements
    ] == [
        "qual-required",
        "qual-disallowed",
        "qual-1",
        "qual-2",
    ]
    assert [requirement.Comparator for requirement in request.qualification_requirements] == [
        "Exists",
        "DoesNotExist",
        "Exists",
        "DoesNotExist",
    ]
    assert fake.granted_qualifications == [
        ("qual-1", "worker-allow"),
        ("qual-2", "worker-block"),
    ]
    assert client.get_hit(record.hit_id, refresh="never").hit_id == "hit-created"


def test_create_hit_rejects_conflicting_qualification_type_ids(tmp_path: Path) -> None:
    client = _client(tmp_path)

    with pytest.raises(ValueError, match="both required and disallowed"):
        client.create_hit(
            url="https://nodekit.example/s/site-1",
            title="Title",
            description="Description",
            keywords=["nodekit"],
            num_assignments=2,
            completion_reward_usd="1.25",
            duration_sec=600,
            auto_approval_delay_sec=3600,
            required_qualification_type_ids=["qual-1"],
            disallowed_qualification_type_ids=["qual-1"],
        )


def test_close_hit_deletes_only_private_qualification_types_for_hit(tmp_path: Path) -> None:
    fake = FakeMturkClient()
    fake.created_qualification_types = [
        ("nodekit:turk-recruiter:token-1:allow", "NodeKit MTurk worker allowlist."),
        ("nodekit:turk-recruiter:token-1:block", "NodeKit MTurk worker blocklist."),
        ("custom-qual", "Not created by this recruiter."),
        ("nodekit:turk-recruiter:other-token:allow", "Different HIT."),
    ]
    fake.hits["hit-1"] = _hit(
        hit_id="hit-1",
        qualification_requirements=[
            QualificationRequirement(
                QualificationTypeId="qual-1",
                Comparator="Exists",
                ActionsGuarded="DiscoverPreviewAndAccept",
            ),
            QualificationRequirement(
                QualificationTypeId="qual-2",
                Comparator="DoesNotExist",
                ActionsGuarded="DiscoverPreviewAndAccept",
            ),
            QualificationRequirement(
                QualificationTypeId="qual-3",
                Comparator="Exists",
                ActionsGuarded="DiscoverPreviewAndAccept",
            ),
            QualificationRequirement(
                QualificationTypeId="qual-4",
                Comparator="Exists",
                ActionsGuarded="DiscoverPreviewAndAccept",
            ),
        ],
    )
    client = _client(tmp_path, fake=fake)
    client._write_hit_record(
        record=HitRecord(
            hit_id="hit-1",
            url="https://nodekit.example/s/site-1",
            title="Title",
            hit=fake.hits["hit-1"],
            timestamp_created=_now(),
            timestamp_refreshed=_now(),
        ),
        fetched_at=_now(),
    )

    record = client.close_hit("hit-1")

    assert fake.cleaned_hit_ids == ["hit-1"]
    assert fake.deleted_qualification_type_ids == ["qual-1", "qual-2"]
    assert record.qualification_type_ids == ("qual-1", "qual-2", "qual-3", "qual-4")


def test_pay_bonus_avoids_duplicate_matching_bonus(tmp_path: Path) -> None:
    fake = FakeMturkClient()
    fake.bonus_payments = (
        _bonus_payment(
            worker_id="worker-1",
            assignment_id="assignment-1",
            amount="1.25",
            reason="Good work.",
        ),
    )
    client = _client(tmp_path, fake=fake)

    result = client.pay_bonus(
        worker_id="worker-1",
        assignment_id="assignment-1",
        amount_usd="1.25",
        reason="Good work.",
    )

    assert result.was_sent is False
    assert result.bonus_payment == fake.bonus_payments[0]
    assert fake.sent_bonus_requests == []


def test_iter_bonus_payments_caches_by_hit_and_assignment_separately(tmp_path: Path) -> None:
    fake = FakeMturkClient()
    fake.bonus_payments = (_bonus_payment(),)
    client = _client(tmp_path, fake=fake)

    by_hit = list(client.iter_bonus_payments(hit_id="hit-1"))
    by_assignment = list(client.iter_bonus_payments(assignment_id="assignment-1"))
    cached_by_hit = list(client.iter_bonus_payments(hit_id="hit-1", refresh="never"))
    cached_by_assignment = list(
        client.iter_bonus_payments(assignment_id="assignment-1", refresh="never")
    )

    assert by_hit == list(fake.bonus_payments)
    assert by_assignment == list(fake.bonus_payments)
    assert cached_by_hit == by_hit
    assert cached_by_assignment == by_assignment
    assert fake.iter_bonus_payment_calls == [
        ("hit-1", None),
        (None, "assignment-1"),
    ]
