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
    StartEvent = 'StartEvent'
    BrowserContextEvent = 'BrowserContextEvent'
    LeaveEvent = 'LeaveEvent'
    ReturnEvent = 'ReturnEvent'

    NodeEnterEvent = 'NodeEnterEvent'
    NodeExitEvent = 'NodeExitEvent'

    PointerEvent = 'PointerEvent'
    KeyEvent = 'KeyEvent'

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
class PointerSampleEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.PointerEvent] = EventTypeEnum.PointerEvent
    kind: Literal['move', 'down', 'up']
    x: SpatialPoint
    y: SpatialPoint

class KeySampleEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.KeyEvent] = EventTypeEnum.KeyEvent
    key: PressableKey
    kind: Literal['down', 'up']


# %%
class BaseNodeEvent(BaseEvent):
    node_id: NodeId

class NodeEnterEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.NodeEnterEvent] = EventTypeEnum.NodeEnterEvent

class NodeExitEvent(BaseNodeEvent):
    event_type: Literal[EventTypeEnum.NodeExitEvent] = EventTypeEnum.NodeExitEvent
    sensor_id: SensorId = pydantic.Field(description='Identifies the Sensor in the Node that was triggered.')
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

    device_pixel_ratio: float = pydantic.Field(
        description="The ratio between physical pixels and logical CSS pixels on the device."
    )


# %%
Event = Annotated[
    Union[
        StartEvent,
        BrowserContextEvent,
        LeaveEvent,
        ReturnEvent,
        PointerSampleEvent,
        KeySampleEvent,
        NodeEnterEvent,
        NodeExitEvent,
        EndEvent,
    ],
    pydantic.Field(discriminator='event_type')
]
