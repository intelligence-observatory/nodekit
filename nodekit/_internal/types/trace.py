import pydantic

from nodekit import VERSION
from nodekit._internal.types.events import Event


class Trace(pydantic.BaseModel):
    nodekit_version: str = pydantic.Field(default=VERSION, validate_default=True)

    events: list[Event]

    @pydantic.field_validator("nodekit_version")
    @classmethod
    def validate_nodekit_version(cls, value: str) -> str:
        if value != VERSION:
            raise ValueError(f"Incompatible NodeKit version: expected {VERSION}, got {value}")
        return value

    @pydantic.field_validator("events")
    def order_events(cls, events: list[Event]) -> list[Event]:
        return sorted(events, key=lambda e: e.t)
