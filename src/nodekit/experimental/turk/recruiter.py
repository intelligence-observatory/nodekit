import datetime
import os
from decimal import Decimal
from pathlib import Path
from typing import TYPE_CHECKING, Any, Iterable
from uuid import uuid4
from xml.etree import ElementTree

import pydantic

from nodekit.experimental.turk.cache import CacheMissError, MturkCache
from nodekit.experimental.turk.client import (
    MAX_HIT_LIFETIME_SEC,
    CreateHitRequest,
    MturkClient,
    SendBonusPaymentRequest,
)
from nodekit.experimental.turk.models import Assignment, BonusPayment, HIT
from nodekit.experimental.turk.values import (
    AssignmentId,
    CacheRefreshPolicy,
    HitId,
    QualificationTypeId,
    WorkerId,
)

if TYPE_CHECKING:
    from nodekit.experimental.turk.dashboard import DashboardHandle


# %% Constants
ASSIGNABLE_HIT_CACHE_TTL = datetime.timedelta(seconds=60)
REVIEW_HIT_CACHE_TTL = datetime.timedelta(minutes=10)
BONUS_PAYMENT_CACHE_TTL = datetime.timedelta(seconds=60)
NODEKIT_PRIVATE_QUALIFICATION_PREFIXES = ("nodekit:allow:", "nodekit:block:")
DEFAULT_DASHBOARD_PORT = 8765


# %% Models
class HitRecord(pydantic.BaseModel):
    hit_id: HitId
    url: str
    title: str
    hit: HIT | None = None
    timestamp_created: datetime.datetime
    timestamp_refreshed: datetime.datetime | None = None

    @property
    def qualification_type_ids(self) -> tuple[QualificationTypeId, ...]:
        if self.hit is None or self.hit.QualificationRequirements is None:
            return ()
        return tuple(
            requirement.QualificationTypeId for requirement in self.hit.QualificationRequirements
        )


class BonusPaymentResult(pydantic.BaseModel):
    worker_id: WorkerId
    assignment_id: AssignmentId
    amount_usd: Decimal
    reason: str
    was_sent: bool
    bonus_payment: BonusPayment | None = None


# %% Client
class MturkRecruiterClient:
    """High-level cached helper for Mechanical Turk recruitment."""

    def __init__(
        self,
        sandbox: bool,
        aws_access_key_id: str | None = None,
        aws_secret_access_key: str | None = None,
        region_name: str = "us-east-1",
        cachedir: os.PathLike[str] | str | None = None,
        *,
        mturk_client: Any | None = None,
    ) -> None:
        self.mturk_client = mturk_client or MturkClient(
            sandbox=sandbox,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name,
        )
        self.cache = (
            MturkCache.default(sandbox=sandbox)
            if cachedir is None
            else MturkCache(root=Path(cachedir))
        )

    def get_account_balance(self) -> Decimal:
        return self.mturk_client.get_account_balance()

    def start_dashboard(
        self,
        *,
        host: str = "127.0.0.1",
        port: int = DEFAULT_DASHBOARD_PORT,
        refresh: CacheRefreshPolicy = "auto",
        print_url: bool = True,
        allow_remote: bool = False,
    ) -> "DashboardHandle":
        """Start a non-blocking read-only dashboard for this recruiter."""

        from nodekit.experimental.turk.dashboard import start_dashboard

        return start_dashboard(
            self,
            host=host,
            port=port,
            refresh=refresh,
            print_url=print_url,
            allow_remote=allow_remote,
        )

    def create_hit(
        self,
        *,
        url: str,
        title: str,
        description: str,
        keywords: list[str],
        num_assignments: int,
        completion_reward_usd: str | Decimal,
        duration_sec: int,
        auto_approval_delay_sec: int,
        allowed_worker_ids: Iterable[WorkerId] = (),
        blocked_worker_ids: Iterable[WorkerId] = (),
        lifetime_sec: int = MAX_HIT_LIFETIME_SEC,
        frame_height_px: int | None = None,
    ) -> HitRecord:
        allowed_worker_ids = tuple(allowed_worker_ids)
        blocked_worker_ids = tuple(blocked_worker_ids)
        qualification_type_ids: list[QualificationTypeId] = []
        qualification_requirements = []

        try:
            if allowed_worker_ids:
                qual_type = self.mturk_client.create_qualification_type(
                    unique_name=f"nodekit:allow:{uuid4()}",
                    description="NodeKit MTurk worker allowlist.",
                )
                qualification_type_ids.append(qual_type.QualificationTypeId)
                for worker_id in allowed_worker_ids:
                    self.mturk_client.grant_qualification(
                        qualification_type_id=qual_type.QualificationTypeId,
                        worker_id=worker_id,
                    )
                qualification_requirements.append(
                    self.mturk_client.package_qualification_exists_requirement(qual_type=qual_type)
                )

            if blocked_worker_ids:
                qual_type = self.mturk_client.create_qualification_type(
                    unique_name=f"nodekit:block:{uuid4()}",
                    description="NodeKit MTurk worker blocklist.",
                )
                qualification_type_ids.append(qual_type.QualificationTypeId)
                for worker_id in blocked_worker_ids:
                    self.mturk_client.grant_qualification(
                        qualification_type_id=qual_type.QualificationTypeId,
                        worker_id=worker_id,
                    )
                qualification_requirements.append(
                    self.mturk_client.package_qualification_does_not_exist_requirement(
                        qual_type=qual_type
                    )
                )

            hit = self.mturk_client.create_hit(
                request=CreateHitRequest(
                    site_url=url,
                    title=title,
                    description=description,
                    keywords=keywords,
                    num_assignments=num_assignments,
                    duration_sec=duration_sec,
                    completion_reward_usd=Decimal(completion_reward_usd),
                    qualification_requirements=tuple(qualification_requirements),
                    unique_request_token=uuid4().hex,
                    auto_approval_delay_sec=auto_approval_delay_sec,
                    lifetime_sec=lifetime_sec,
                    frame_height_px=0 if frame_height_px is None else frame_height_px,
                )
            )
        except Exception:
            for qualification_type_id in qualification_type_ids:
                self.mturk_client.delete_worker_qualification_type(
                    qualification_type_id=qualification_type_id
                )
            raise

        now = _utc_now()
        record = HitRecord(
            hit_id=hit.HITId,
            url=url,
            title=title,
            hit=hit,
            timestamp_created=now,
            timestamp_refreshed=now,
        )
        self._write_hit_record(record=record, fetched_at=now)
        return record

    def iter_hits(
        self,
        *,
        refresh: CacheRefreshPolicy = "auto",
        include_closed: bool = True,
    ) -> Iterable[HitRecord]:
        records: dict[HitId, HitRecord] = {}

        if refresh != "never":
            for hit in self.mturk_client.iter_hits():
                records[hit.HITId] = self._cache_observed_hit(hit=hit)

        for cached in self.cache.iter_hit_payloads():
            cached_record = HitRecord.model_validate(cached.payload)
            if cached_record.hit_id in records:
                continue
            record = cached_record if refresh == "never" else self.get_hit(cached_record.hit_id)
            records[record.hit_id] = record

        for record in sorted(
            records.values(), key=lambda item: item.timestamp_created, reverse=True
        ):
            if include_closed or record.hit is None or not _is_hit_closed_to_workers(record.hit):
                yield record

    def get_hit(
        self,
        hit_id: HitId,
        *,
        refresh: CacheRefreshPolicy = "auto",
    ) -> HitRecord:
        path = self.cache.hit_path(hit_id=hit_id)
        cached = self.cache.read_payload(path)

        if refresh == "never":
            if cached is None:
                raise CacheMissError(f"HIT {hit_id} is not present in the MTurk cache.")
            return HitRecord.model_validate(cached.payload)

        if refresh == "always" or cached is None:
            return self._fetch_and_cache_hit(hit_id=hit_id, cached_record=None)

        record = HitRecord.model_validate(cached.payload)
        if self._should_refresh_hit(record=record, fetched_at=cached.fetched_at):
            return self._fetch_and_cache_hit(hit_id=hit_id, cached_record=record)
        return record

    def iter_assignments(
        self,
        hit_id: HitId,
        *,
        refresh: CacheRefreshPolicy = "auto",
    ) -> Iterable[Assignment]:
        path = self.cache.assignment_collection_path(hit_id=hit_id)
        cached = self.cache.read_collection(path)

        if refresh == "never":
            if cached is None:
                raise CacheMissError(
                    f"Assignments for HIT {hit_id} are not present in the MTurk cache."
                )
            yield from (Assignment.model_validate(item) for item in cached.items)
            return

        hit_record = self.get_hit(hit_id, refresh="auto")
        if (
            refresh == "always"
            or cached is None
            or self._should_refresh_assignments(
                cached=cached,
                hit=hit_record.hit,
            )
        ):
            assignments = tuple(self.mturk_client.iter_assignments(hit_id=hit_id))
            now = _utc_now()
            self.cache.write_collection(
                path=path,
                items=assignments,
                complete=True,
                fetched_at=now,
            )
            yield from assignments
            return

        yield from (Assignment.model_validate(item) for item in cached.items)

    def approve_assignment(
        self,
        assignment_id: AssignmentId,
    ) -> None:
        self.mturk_client.approve_assignment(assignment_id=assignment_id)
        self.cache.invalidate_assignment_collections_containing(assignment_id=assignment_id)

    def close_hit(
        self,
        hit_id: HitId,
    ) -> HitRecord:
        record = self.get_hit(hit_id, refresh="auto")
        qualification_type_ids = _created_qualification_type_ids_for_hit(
            record=record,
            mturk_client=self.mturk_client,
        )

        self.mturk_client.cleanup_hit(hit_id=hit_id)
        for qualification_type_id in qualification_type_ids:
            self.mturk_client.delete_worker_qualification_type(
                qualification_type_id=qualification_type_id
            )

        refreshed = self.get_hit(hit_id, refresh="always")
        self._write_hit_record(record=refreshed, fetched_at=_utc_now())
        return refreshed

    def iter_bonus_payments(
        self,
        *,
        hit_id: HitId | None = None,
        assignment_id: AssignmentId | None = None,
        refresh: CacheRefreshPolicy = "auto",
    ) -> Iterable[BonusPayment]:
        if (hit_id is None) == (assignment_id is None):
            raise ValueError("Provide exactly one of hit_id or assignment_id.")

        path = (
            self.cache.bonus_payments_by_hit_path(hit_id=hit_id)
            if hit_id is not None
            else self.cache.bonus_payments_by_assignment_path(assignment_id=assignment_id or "")
        )
        cached = self.cache.read_collection(path)

        if refresh == "never":
            if cached is None:
                raise CacheMissError("Bonus payments are not present in the MTurk cache.")
            yield from (BonusPayment.model_validate(item) for item in cached.items)
            return

        if (
            refresh == "always"
            or cached is None
            or _is_stale(
                fetched_at=cached.fetched_at,
                ttl=BONUS_PAYMENT_CACHE_TTL,
            )
        ):
            bonus_payments = tuple(
                self.mturk_client.iter_bonus_payments(
                    hit_id=hit_id,
                    assignment_id=assignment_id,
                )
            )
            self.cache.write_collection(
                path=path,
                items=bonus_payments,
                complete=True,
                fetched_at=_utc_now(),
            )
            yield from bonus_payments
            return

        yield from (BonusPayment.model_validate(item) for item in cached.items)

    def pay_bonus(
        self,
        *,
        worker_id: WorkerId,
        assignment_id: AssignmentId,
        amount_usd: str | Decimal,
        reason: str,
    ) -> BonusPaymentResult:
        amount = Decimal(amount_usd)
        existing_bonus = _matching_bonus_payment(
            bonus_payments=self.iter_bonus_payments(
                assignment_id=assignment_id,
                refresh="always",
            ),
            worker_id=worker_id,
            assignment_id=assignment_id,
            amount_usd=amount,
            reason=reason,
        )
        if existing_bonus is not None:
            return BonusPaymentResult(
                worker_id=worker_id,
                assignment_id=assignment_id,
                amount_usd=amount,
                reason=reason,
                was_sent=False,
                bonus_payment=existing_bonus,
            )

        self.mturk_client.send_bonus_payment(
            request=SendBonusPaymentRequest(
                worker_id=worker_id,
                assignment_id=assignment_id,
                amount_usd=amount,
                reason=reason,
            )
        )
        hit_ids = self.cache.invalidate_assignment_collections_containing(
            assignment_id=assignment_id
        )
        self.cache.invalidate_bonus_payment_collections(
            assignment_id=assignment_id,
            hit_ids=hit_ids,
        )
        return BonusPaymentResult(
            worker_id=worker_id,
            assignment_id=assignment_id,
            amount_usd=amount,
            reason=reason,
            was_sent=True,
            bonus_payment=None,
        )

    # %% Helpers
    def _fetch_and_cache_hit(
        self,
        hit_id: HitId,
        cached_record: HitRecord | None,
    ) -> HitRecord:
        hit = self.mturk_client.get_hit(hit_id=hit_id)
        return self._cache_observed_hit(hit=hit, cached_record=cached_record)

    def _cache_observed_hit(
        self,
        *,
        hit: HIT,
        cached_record: HitRecord | None = None,
    ) -> HitRecord:
        if cached_record is None:
            cached = self.cache.read_payload(self.cache.hit_path(hit_id=hit.HITId))
            cached_record = HitRecord.model_validate(cached.payload) if cached is not None else None

        now = _utc_now()
        if cached_record is not None:
            record = cached_record.model_copy(
                update={
                    "url": cached_record.url or _site_url_from_question(hit.Question),
                    "title": hit.Title,
                    "hit": hit,
                    "timestamp_refreshed": now,
                }
            )
        else:
            record = HitRecord(
                hit_id=hit.HITId,
                url=_site_url_from_question(hit.Question),
                title=hit.Title,
                hit=hit,
                timestamp_created=hit.CreationTime,
                timestamp_refreshed=now,
            )
        self._write_hit_record(record=record, fetched_at=now)
        return record

    def _write_hit_record(self, record: HitRecord, fetched_at: datetime.datetime) -> None:
        self.cache.write_payload(
            path=self.cache.hit_path(hit_id=record.hit_id),
            payload=record,
            fetched_at=fetched_at,
        )

    def _should_refresh_hit(
        self,
        *,
        record: HitRecord,
        fetched_at: datetime.datetime,
    ) -> bool:
        if record.hit is None:
            return True
        if record.hit.HITStatus == "Disposed":
            return False
        if record.hit.HITStatus in ("Reviewable", "Reviewing"):
            return _is_stale(fetched_at=fetched_at, ttl=REVIEW_HIT_CACHE_TTL)
        return _is_stale(fetched_at=fetched_at, ttl=ASSIGNABLE_HIT_CACHE_TTL)

    def _should_refresh_assignments(
        self,
        *,
        cached,
        hit: HIT | None,
    ) -> bool:
        if not cached.complete:
            return True
        if hit is not None and len(cached.items) < hit.NumberOfAssignmentsCompleted:
            return True
        if hit is not None and hit.HITStatus == "Disposed":
            return False
        ttl = (
            REVIEW_HIT_CACHE_TTL
            if hit is not None and hit.HITStatus in ("Reviewable", "Reviewing")
            else ASSIGNABLE_HIT_CACHE_TTL
        )
        return _is_stale(fetched_at=cached.fetched_at, ttl=ttl)


# %% Helpers
def _utc_now() -> datetime.datetime:
    return datetime.datetime.now(tz=datetime.timezone.utc)


def _is_stale(*, fetched_at: datetime.datetime, ttl: datetime.timedelta) -> bool:
    return _utc_now() - fetched_at > ttl


def _is_hit_closed_to_workers(hit: HIT) -> bool:
    return hit.HITStatus != "Assignable"


def _created_qualification_type_ids_for_hit(
    *,
    record: HitRecord,
    mturk_client: Any,
) -> tuple[QualificationTypeId, ...]:
    requirement_ids = set(record.qualification_type_ids)
    if not requirement_ids:
        return ()

    return tuple(
        qual_type.QualificationTypeId
        for qual_type in mturk_client.list_qualification_types()
        if qual_type.QualificationTypeId in requirement_ids
        and (qual_type.Name or "").startswith(NODEKIT_PRIVATE_QUALIFICATION_PREFIXES)
    )


def _site_url_from_question(question: str) -> str:
    try:
        root = ElementTree.fromstring(question)
    except ElementTree.ParseError:
        return ""
    for element in root.iter():
        if element.tag.endswith("ExternalURL"):
            return element.text or ""
    return ""


def _matching_bonus_payment(
    *,
    bonus_payments: Iterable[BonusPayment],
    worker_id: WorkerId,
    assignment_id: AssignmentId,
    amount_usd: Decimal,
    reason: str,
) -> BonusPayment | None:
    for bonus_payment in bonus_payments:
        if (
            bonus_payment.WorkerId == worker_id
            and bonus_payment.AssignmentId == assignment_id
            and bonus_payment.BonusAmount == amount_usd
            and bonus_payment.Reason == reason
        ):
            return bonus_payment
    return None
