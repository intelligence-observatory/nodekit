# %%
import enum
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.actions import Action
from nodekit._internal.types.node import Node
from nodekit._internal.types.values import (
    TimeElapsedMsec,
    SpatialPoint,
    NodeAddress,
)


# %%
class EventTypeEnum(str, enum.Enum):
    TraceStartedEvent = "TraceStartedEvent"
    TraceEndedEvent = "TraceEndedEvent"

    NodeStartedEvent = "NodeStartedEvent"
    ActionTakenEvent = "ActionTakenEvent"
    NodeEndedEvent = "NodeEndedEvent"

    PointerSampledEvent = "PointerSampledEvent"
    KeySampledEvent = "KeySampledEvent"

    BrowserContextSampledEvent = "BrowserContextSampledEvent"
    PageSuspendedEvent = "PageSuspendedEvent"
    PageResumedEvent = "PageResumedEvent"


# %%
class BaseEvent(pydantic.BaseModel):
    event_type: EventTypeEnum
    t: TimeElapsedMsec = pydantic.Field(
        description="The number of elapsed milliseconds since StartedEvent."
    )


# %% System events
class TraceStartedEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.TraceStartedEvent] = (
        EventTypeEnum.TraceStartedEvent
    )


class TraceEndedEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.TraceEndedEvent] = EventTypeEnum.TraceEndedEvent


class PageSuspendedEvent(BaseEvent):
    """
    Emitted when a Participant suspends the page (e.g., closes the tab or navigates away).
    """

    event_type: Literal[EventTypeEnum.PageSuspendedEvent] = (
        EventTypeEnum.PageSuspendedEvent
    )


class PageResumedEvent(BaseEvent):
    """
    Emitted when a Participant returns to the page (e.g., reopens the tab or navigates back).
    """

    event_type: Literal[EventTypeEnum.PageResumedEvent] = EventTypeEnum.PageResumedEvent


class RegionSizePx(pydantic.BaseModel):
    width_px: int
    height_px: int


class BrowserContextSampledEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.BrowserContextSampledEvent] = (
        EventTypeEnum.BrowserContextSampledEvent
    )
    user_agent: str = pydantic.Field(
        description="The user agent string of the browser."
    )
    timestamp_client: str = pydantic.Field(
        description="The ISO8601-formatted timestamp that the Participant's browser disclosed at the time of this event."
    )
    device_pixel_ratio: float = pydantic.Field(
        description="The ratio between physical pixels and logical CSS pixels on the device."
    )
    display: RegionSizePx = pydantic.Field(
        description="The size of the Participant's display in physical pixels."
    )
    viewport: RegionSizePx


# %%
class PointerSampledEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.PointerSampledEvent] = (
        EventTypeEnum.PointerSampledEvent
    )
    x: SpatialPoint
    y: SpatialPoint
    kind: Literal["move", "down", "up"]


class KeySampledEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.KeySampledEvent] = EventTypeEnum.KeySampledEvent
    key: str
    kind: Literal["down", "up"]


# %%
class BaseNodeEvent(BaseEvent):
    node_address: NodeAddress


class NodeStartedEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.NodeStartedEvent] = EventTypeEnum.NodeStartedEvent
    node: Node


class ActionTakenEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.ActionTakenEvent] = EventTypeEnum.ActionTakenEvent
    action: Action


class NodeEndedEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.NodeEndedEvent] = EventTypeEnum.NodeEndedEvent


# %%
type Event = Annotated[
    Union[
        # System events flow:
        TraceStartedEvent,
        TraceEndedEvent,
        PageSuspendedEvent,
        PageResumedEvent,
        BrowserContextSampledEvent,
        # Node events:
        NodeStartedEvent,
        ActionTakenEvent,
        NodeEndedEvent,
        # Agent inputs:
        PointerSampledEvent,
        KeySampledEvent,
    ],
    pydantic.Field(discriminator="event_type"),
]
