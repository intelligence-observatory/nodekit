# %%
import enum
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.actions.actions import Action
from nodekit._internal.types.common import NodeIndex, TimeElapsedMsec


# %%
class EventTypeEnum(str, enum.Enum):
    StartEvent = 'StartEvent'
    BrowserContextEvent = 'BrowserContextEvent'
    LeaveEvent = 'LeaveEvent'
    ReturnEvent = 'ReturnEvent'

    NodeStartEvent = 'NodeStartEvent'
    ActionEvent = 'ActionEvent'
    NodeEndEvent = 'NodeEndEvent'

    EndEvent = 'EndEvent'



# %%
class BaseEvent(pydantic.BaseModel):
    event_type: EventTypeEnum
    t: TimeElapsedMsec


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

class BaseNodeEvent(BaseEvent):
    node_index: NodeIndex


class NodeStartEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.NodeStartEvent] = EventTypeEnum.NodeStartEvent

class ActionEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.ActionEvent] = EventTypeEnum.ActionEvent
    sensor_index: int = pydantic.Field(description='The index of the Sensor in this Node that was triggered.')
    action: Action

class NodeEndEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.NodeEndEvent] = EventTypeEnum.NodeEndEvent


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
        BrowserContextEvent,
        LeaveEvent,
        ReturnEvent,
        NodeStartEvent,
        ActionEvent,
        NodeEndEvent,
        EndEvent,
    ],
    pydantic.Field(discriminator='event_type')
]
