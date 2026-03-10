import pydantic

from nodekit import VERSION
from nodekit._internal.version import validate_compatible_nodekit_version
from nodekit._internal.types.events import Event


class Trace(pydantic.BaseModel):
    nodekit_version: str = pydantic.Field(default=VERSION, validate_default=True)

    events: list[Event]

    @pydantic.field_validator("nodekit_version")
    @classmethod
    def validate_nodekit_version(cls, value: str) -> str:
        return validate_compatible_nodekit_version(value)

    @pydantic.field_validator("events")
    def order_events(cls, events: list[Event]) -> list[Event]:
        return sorted(events, key=lambda e: e.t)
