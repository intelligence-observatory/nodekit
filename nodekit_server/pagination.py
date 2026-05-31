"""Pagination helpers for nodekit-server route implementations."""

from typing import Any
from uuid import UUID

import fastapi
import sqlmodel
from sqlalchemy import and_, or_

from nodekit.server.pagination import decode_timestamp_id_cursor, encode_timestamp_id_cursor
from nodekit_server.records import as_utc


# %% Timestamp + ID cursors
def apply_timestamp_id_page_cursor(
    statement: Any,
    page_cursor: str,
    timestamp_column: Any,
    id_column: Any,
) -> Any:
    """Apply a descending timestamp-plus-UUID cursor predicate to a SQL statement."""

    try:
        cursor = decode_timestamp_id_cursor(page_cursor)
        cursor_id = UUID(cursor.id)
    except ValueError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Invalid page cursor.",
        ) from exc

    cursor_timestamp = cursor.timestamp_created.replace(tzinfo=None)
    return statement.where(
        or_(
            sqlmodel.col(timestamp_column) < cursor_timestamp,
            and_(
                sqlmodel.col(timestamp_column) == cursor_timestamp,
                sqlmodel.col(id_column) < cursor_id,
            ),
        )
    )


def page_records(
    records: list[Any],
    max_items: int,
    *,
    timestamp_attr: str,
    id_attr: str,
) -> tuple[list[Any], str | None]:
    """Return the visible page and next cursor for max-items-plus-one queries."""

    page = records[:max_items]
    next_page_cursor = None
    if len(records) > max_items and page:
        last_record = page[-1]
        next_page_cursor = encode_timestamp_id_cursor(
            timestamp_created=as_utc(getattr(last_record, timestamp_attr)),
            id=getattr(last_record, id_attr),
        )
    return page, next_page_cursor
