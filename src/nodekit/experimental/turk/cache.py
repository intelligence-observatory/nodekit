import datetime
from pathlib import Path
from typing import Any, Iterable
from uuid import uuid4

import pydantic
from platformdirs import user_cache_dir

from nodekit.experimental.turk.values import AssignmentId, HitId


# %% Exceptions
class CacheMissError(Exception):
    """Raised when a requested MTurk cache entry is absent."""


# %% Models
class CachedPayload(pydantic.BaseModel):
    fetched_at: datetime.datetime
    payload: dict[str, Any]


class CachedCollection(pydantic.BaseModel):
    fetched_at: datetime.datetime
    complete: bool
    items: list[dict[str, Any]]


# %% Cache
class MturkCache:
    """Filesystem cache for observed MTurk API responses."""

    def __init__(self, root: Path):
        self.root = root

    @classmethod
    def default(cls, *, sandbox: bool) -> "MturkCache":
        environment = "sandbox" if sandbox else "production"
        root = Path(user_cache_dir("nodekit", "nodekit")) / "mturk" / environment
        return cls(root=root)

    # %% Paths
    def hit_path(self, hit_id: HitId) -> Path:
        return self.root / "hits" / f"{hit_id}.json"

    def assignment_collection_path(self, hit_id: HitId) -> Path:
        return self.root / "assignments" / f"{hit_id}.json"

    def bonus_payments_by_hit_path(self, hit_id: HitId) -> Path:
        return self.root / "bonus_payments" / "by_hit" / f"{hit_id}.json"

    def bonus_payments_by_assignment_path(self, assignment_id: AssignmentId) -> Path:
        return self.root / "bonus_payments" / "by_assignment" / f"{assignment_id}.json"

    # %% Payloads
    def read_payload(self, path: Path) -> CachedPayload | None:
        if not path.exists():
            return None
        return CachedPayload.model_validate_json(path.read_text())

    def write_payload(
        self,
        path: Path,
        *,
        payload: pydantic.BaseModel,
        fetched_at: datetime.datetime,
    ) -> None:
        self._atomic_write(
            path=path,
            text=CachedPayload(
                fetched_at=fetched_at,
                payload=payload.model_dump(mode="json"),
            ).model_dump_json(indent=2),
        )

    # %% Collections
    def read_collection(self, path: Path) -> CachedCollection | None:
        if not path.exists():
            return None
        return CachedCollection.model_validate_json(path.read_text())

    def write_collection(
        self,
        path: Path,
        *,
        items: Iterable[pydantic.BaseModel],
        complete: bool,
        fetched_at: datetime.datetime,
    ) -> None:
        self._atomic_write(
            path=path,
            text=CachedCollection(
                fetched_at=fetched_at,
                complete=complete,
                items=[item.model_dump(mode="json") for item in items],
            ).model_dump_json(indent=2),
        )

    # %% Iteration and invalidation
    def iter_hit_payloads(self) -> Iterable[CachedPayload]:
        hit_dir = self.root / "hits"
        if not hit_dir.is_dir():
            return
        for path in sorted(hit_dir.glob("*.json")):
            cached = self.read_payload(path)
            if cached is not None:
                yield cached

    def iter_assignment_collection_paths(self) -> Iterable[Path]:
        assignment_dir = self.root / "assignments"
        if not assignment_dir.is_dir():
            return
        yield from sorted(assignment_dir.glob("*.json"))

    def delete(self, path: Path) -> None:
        try:
            path.unlink()
        except FileNotFoundError:
            return

    def invalidate_assignment_collections_containing(
        self,
        assignment_id: AssignmentId,
    ) -> set[HitId]:
        hit_ids: set[HitId] = set()
        for path in self.iter_assignment_collection_paths():
            cached = self.read_collection(path)
            if cached is None:
                continue
            if any(item.get("AssignmentId") == assignment_id for item in cached.items):
                hit_ids.add(path.stem)
                self.delete(path)
        return hit_ids

    def invalidate_bonus_payment_collections(
        self,
        *,
        assignment_id: AssignmentId,
        hit_ids: Iterable[HitId] = (),
    ) -> None:
        self.delete(self.bonus_payments_by_assignment_path(assignment_id=assignment_id))
        for hit_id in hit_ids:
            self.delete(self.bonus_payments_by_hit_path(hit_id=hit_id))

    # %% Helpers
    def _atomic_write(self, path: Path, text: str) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        tmp_path = path.with_name(f".{path.name}.{uuid4().hex}.tmp")
        tmp_path.write_text(text)
        tmp_path.replace(path)
