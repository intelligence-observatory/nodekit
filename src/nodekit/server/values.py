"""Shared values for the NodeKit server/client API."""

import datetime
import enum
import re
from typing import Annotated, TypeAlias
from uuid import UUID

import pydantic


# %% Timestamps
def utc_now() -> datetime.datetime:
    """Return the current time as a timezone-aware UTC datetime."""

    return datetime.datetime.now(datetime.UTC)


def _ensure_utc_datetime(value: datetime.datetime) -> datetime.datetime:
    if value.tzinfo is None:
        raise ValueError("Datetime must be timezone-aware.")
    return value.astimezone(datetime.UTC)


def _ensure_site_condition_id(value: str) -> str:
    if re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]*", value) is None:
        raise ValueError("SiteConditionId must match ^[A-Za-z0-9][A-Za-z0-9_.-]*$.")
    return value


DatetimeUTC: TypeAlias = Annotated[
    datetime.datetime,
    pydantic.AfterValidator(_ensure_utc_datetime),
]


# %% Identifiers
ApiTokenId: TypeAlias = UUID
RunId: TypeAlias = UUID
SiteId: TypeAlias = UUID
SiteConditionId: TypeAlias = Annotated[
    str,
    pydantic.AfterValidator(_ensure_site_condition_id),
]
TagId: TypeAlias = UUID
UserId: TypeAlias = UUID


# %% Runs
class RunStatus(str, enum.Enum):
    """Participant Run lifecycle states."""

    STARTED = "started"
    SUBMITTED = "submitted"
    COMPLETED = "completed"
    INVALID = "invalid"
