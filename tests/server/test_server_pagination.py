import datetime
from uuid import uuid4

import pytest

from nodekit.server.pagination import (
    decode_timestamp_id_cursor,
    encode_timestamp_id_cursor,
)


# %%
def test_timestamp_id_cursor_roundtrip() -> None:
    timestamp_created = datetime.datetime(2026, 5, 31, 12, 30, tzinfo=datetime.UTC)
    item_id = uuid4()

    cursor = encode_timestamp_id_cursor(
        timestamp_created=timestamp_created,
        id=item_id,
    )
    decoded = decode_timestamp_id_cursor(cursor)

    assert decoded.timestamp_created == timestamp_created
    assert decoded.id == str(item_id)


# %%
def test_timestamp_id_cursor_rejects_invalid_cursor() -> None:
    with pytest.raises(ValueError, match="Invalid page cursor"):
        decode_timestamp_id_cursor("not-a-valid-cursor")


# %%
def test_timestamp_id_cursor_rejects_naive_datetime() -> None:
    with pytest.raises(ValueError, match="timezone-aware"):
        encode_timestamp_id_cursor(
            timestamp_created=datetime.datetime(2026, 5, 31, 12, 30),
            id=uuid4(),
        )
