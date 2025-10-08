# %%
import enum
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.actions.actions import Action
from nodekit._internal.types.common import (
    TimeElapsedMsec,
    NodeId,
    SensorId,
    PressableKey,
    SpatialPoint,
)


# %%
class EventTypeEnum(str, enum.Enum):
    TraceStartedEvent = "TraceStartedEvent"
    TraceEndedEvent = "TraceEndedEvent"

    NodeEnteredEvent = "NodeEnteredEvent"
    NodeExitedEvent = "NodeExitedEvent"

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


# %%
class TraceStartedEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.TraceStartedEvent] = (
        EventTypeEnum.TraceStartedEvent
    )


class TraceEndedEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.TraceEndedEvent] = EventTypeEnum.TraceEndedEvent


# %%


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


# %%
class PointerSampledEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.PointerSampledEvent] = (
        EventTypeEnum.PointerSampledEvent
    )
    kind: Literal["move", "down", "up"]
    x: SpatialPoint
    y: SpatialPoint


class KeySampledEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.KeySampledEvent] = EventTypeEnum.KeySampledEvent
    key: str
    kind: Literal["down", "up"]


# %%
class BaseNodeEvent(BaseEvent):
    node_id: NodeId


class NodeEnteredEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.NodeEnteredEvent] = EventTypeEnum.NodeEnteredEvent


class NodeExitedEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.NodeExitedEvent] = EventTypeEnum.NodeExitedEvent
    sensor_id: SensorId = pydantic.Field(
        description="Identifies the Sensor in the Node that was triggered."
    )
    action: Action


# %%
class BrowserContextSampledEvent(BaseEvent):
    """
    Emitted to capture browser context information, such as user agent and viewport size.
    """

    event_type: Literal[EventTypeEnum.BrowserContextSampledEvent] = (
        EventTypeEnum.BrowserContextSampledEvent
    )
    user_agent: str = pydantic.Field(
        description="User agent string of the browser or application rendering the board."
    )

    display_width_px: int
    display_height_px: int

    viewport_width_px: int
    viewport_height_px: int

    device_pixel_ratio: float = pydantic.Field(
        description="The ratio between physical pixels and logical CSS pixels on the device."
    )


# %%
Event = Annotated[
    Union[
        # Graph flow:
        TraceStartedEvent,
        TraceEndedEvent,
        NodeEnteredEvent,
        NodeExitedEvent,
        # Input streams:
        PointerSampledEvent,
        KeySampledEvent,
        # Page navigation:
        PageSuspendedEvent,
        PageResumedEvent,
        # Context:
        BrowserContextSampledEvent,
    ],
    pydantic.Field(discriminator="event_type"),
]
