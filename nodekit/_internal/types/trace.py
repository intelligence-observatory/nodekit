import pydantic

from nodekit import VERSION
from nodekit._internal.types.events import Event
from nodekit._internal.types.graph import Graph
from nodekit._internal.version import validate_compatible_nodekit_version


# %%
class Trace(pydantic.BaseModel):
    nodekit_version: str = pydantic.Field(default=VERSION, validate_default=True)

    graph: Graph
    events: list[Event]

    @pydantic.field_validator("nodekit_version")
    @classmethod
    def validate_nodekit_version(cls, value: str) -> str:
        return validate_compatible_nodekit_version(value)

    @pydantic.model_validator(mode="after")
    def validate_event_indexes(self) -> "Trace":
        for expected_index, event in enumerate(self.events):
            if event.event_index != expected_index:
                raise ValueError(
                    "Trace events must have zero-based, contiguous event_index values "
                    f"in list order. Expected {expected_index}, got {event.event_index}."
                )
        return self
