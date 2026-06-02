"""Pagination contracts for the NodeKit server/client API."""

import base64
import datetime
import json
from typing import Generic, TypeVar
from uuid import UUID

import pydantic

from nodekit.server.values import DatetimeUTC


PageItemT = TypeVar("PageItemT", bound=pydantic.BaseModel)


# %% PageResponse
class PageResponse(pydantic.BaseModel, Generic[PageItemT]):
    items: list[PageItemT]
    next_page_cursor: str | None = pydantic.Field(
        default=None,
        description="The cursor for the next page.",
    )


# %% PageQuery
class PageQuery(pydantic.BaseModel):
    max_items: int = pydantic.Field(
        default=100,
        ge=1,
        le=100,
        description="The number of items per page.",
    )
    page_cursor: str | None = pydantic.Field(
        default=None,
        description="The cursor for the requested page. If None, the first page is returned.",
    )


# %% TimestampIdCursor
class TimestampIdCursor(pydantic.BaseModel):
    timestamp_created: DatetimeUTC
    id: str


def encode_timestamp_id_cursor(
    timestamp_created: datetime.datetime,
    id: UUID | str,
) -> str:
    """Encode a timestamp-plus-id cursor as URL-safe opaque text."""

    if timestamp_created.tzinfo is None:
        raise ValueError("timestamp_created must be timezone-aware.")
    timestamp_created = timestamp_created.astimezone(datetime.UTC)
    payload = {
        "timestamp_created": timestamp_created.isoformat().replace("+00:00", "Z"),
        "id": str(id),
    }
    raw_cursor = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    return base64.urlsafe_b64encode(raw_cursor).decode("ascii").rstrip("=")


def decode_timestamp_id_cursor(page_cursor: str) -> TimestampIdCursor:
    """Decode a timestamp-plus-id cursor."""

    padded_cursor = page_cursor + "=" * (-len(page_cursor) % 4)
    try:
        raw_cursor = base64.urlsafe_b64decode(padded_cursor.encode("ascii"))
        payload = json.loads(raw_cursor.decode("utf-8"))
        return TimestampIdCursor.model_validate(payload)
    except Exception as exc:
        raise ValueError("Invalid page cursor.") from exc
