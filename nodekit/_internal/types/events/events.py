# %%
import enum
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.actions.actions import Action
from nodekit._internal.types.common import DatetimeUTC


# %%
class EventTypeEnum(str, enum.Enum):
    StartEvent = 'StartEvent'
    NodeResultEvent = 'NodeResultEvent'
    LeaveEvent = 'LeaveEvent'
    ReturnEvent = 'ReturnEvent'
    EndEvent = 'EndEvent'
    BrowserContextEvent = 'BrowserContextEvent'


# %%
class BaseEvent(pydantic.BaseModel):
    event_type: EventTypeEnum
    timestamp_event: DatetimeUTC


# %%
class StartEvent(BaseEvent):
    """
    Emitted when a Participant starts a new run.
    """
    event_type: Literal[EventTypeEnum.StartEvent] = EventTypeEnum.StartEvent


class EndEvent(BaseEvent):
    """
    Emitted when a Participant completes a run.
    """
    event_type: Literal[EventTypeEnum.EndEvent] = EventTypeEnum.EndEvent


class LeaveEvent(BaseEvent):
    """
    Emitted when a Participant leaves a run (e.g., closes the tab or navigates away) before it has completed.
    """
    event_type: Literal[EventTypeEnum.LeaveEvent] = EventTypeEnum.LeaveEvent


class ReturnEvent(BaseEvent):
    """
    Emitted when a Participant returns to a run (e.g., reopens the tab or navigates back) before it has completed.
    """
    event_type: Literal[EventTypeEnum.ReturnEvent] = EventTypeEnum.ReturnEvent


# %%
class NodeResultEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.NodeResultEvent] = EventTypeEnum.NodeResultEvent

    timestamp_node_start: DatetimeUTC
    timestamp_action: DatetimeUTC
    timestamp_node_end: DatetimeUTC
    node_index: int = pydantic.Field(description='The index of the Node that was played.')
    sensor_index: int = pydantic.Field(description='The index of the Sensor in this Node that was triggered.')
    action: Action


# %%
class BrowserContextEvent(BaseEvent):
    """
    Emitted to capture browser context information, such as user agent and viewport size.
    """

    event_type: Literal[EventTypeEnum.BrowserContextEvent] = EventTypeEnum.BrowserContextEvent
    user_agent: str = pydantic.Field(description="User agent string of the browser or application rendering the board.")

    display_width_px: int
    display_height_px: int

    viewport_width_px: int
    viewport_height_px: int


# %%
Event = Annotated[
    Union[
        StartEvent,
        EndEvent,
        NodeResultEvent,
        LeaveEvent,
        ReturnEvent,
        BrowserContextEvent,
    ],
    pydantic.Field(discriminator='event_type')
]
