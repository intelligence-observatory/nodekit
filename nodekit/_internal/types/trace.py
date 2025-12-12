from typing import Literal

import pydantic

from nodekit import VERSION
from nodekit._internal.types.events.events import Event


class Trace(pydantic.BaseModel):
    nodekit_version: Literal["0.2.1"] = pydantic.Field(
        default=VERSION, validate_default=True
    )
    events: list[Event]

    @pydantic.field_validator("events")
    def order_events(cls, events: list[Event]) -> list[Event]:
        return sorted(events, key=lambda e: e.t)
