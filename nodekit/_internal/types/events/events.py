# %%
import enum
from typing import Literal, Annotated, Union
from uuid import UUID

import pydantic

from nodekit._internal.types.actions.actions import Action
from nodekit._internal.types.common import DatetimeUTC, NodeId
from nodekit._internal.version import VERSION

# %%
class EventTypeEnum(str, enum.Enum):
    StartEvent = 'StartEvent'
    NodeResultEvent = 'NodeResultEvent'
    LeaveEvent = 'LeaveEvent'
    ReturnEvent = 'ReturnEvent'
    EndEvent = 'EndEvent'
    BonusDisclosureEvent = 'BonusDisclosureEvent'
    BrowserContextEvent = 'BrowserContextEvent'


# %%
class NullPayload(pydantic.BaseModel):
    """
    A sentinel model for *_value fields which do not require specification.
    """
    pass


class BaseEvent(pydantic.BaseModel):
    event_id: UUID
    event_timestamp: DatetimeUTC
    event_type: EventTypeEnum
    event_payload: NullPayload
    nodekit_version: str = pydantic.Field(default=VERSION)


# %%
class StartEvent(BaseEvent):
    """
    Emitted when a Participant starts a new run through the NodeGraph.
    """
    event_type: Literal[EventTypeEnum.StartEvent] = EventTypeEnum.StartEvent


class EndEvent(BaseEvent):
    """
    Emitted when a Participant completes a run through the NodeGraph.
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



class BonusDisclosureEvent(BaseEvent):
    """
    Emitted when a Participant is shown a bonus disclosure.
    """

    class BonusDisclosure(pydantic.BaseModel):
        bonus_amount_usd: str

    event_type: Literal[EventTypeEnum.BonusDisclosureEvent] = EventTypeEnum.BonusDisclosureEvent
    event_payload: BonusDisclosure


# %%
class NodeResultEvent(BaseEvent):

    class NodeResult(pydantic.BaseModel):
        """
        Describes the result of a NodePlay.
        """

        node_id: NodeId = pydantic.Field(description='The ID of the Node from which this NodeResult was produced.')
        node_execution_index: int = pydantic.Field(description='The index of the Node execution in the NodeGraph.', ge=0)
        timestamp_start: DatetimeUTC
        timestamp_end: DatetimeUTC
        action: Action

    event_type: Literal[EventTypeEnum.NodeResultEvent] = EventTypeEnum.NodeResultEvent
    event_payload: NodeResult


# %%

class BrowserContextEvent(BaseEvent):
    """
    Emitted to capture browser context information, such as user agent and viewport size.
    """

    class BrowserContext(pydantic.BaseModel):
        # User agent string
        user_agent: str = pydantic.Field(description="User agent string of the browser or application rendering the board.")

        display_width_px: int
        display_height_px: int

        viewport_width_px: int
        viewport_height_px: int

    event_type: Literal[EventTypeEnum.BrowserContextEvent] = EventTypeEnum.BrowserContextEvent
    event_payload: BrowserContext


# %%
Event = Annotated[
    Union[
        StartEvent,
        EndEvent,
        NodeResultEvent,
        LeaveEvent,
        ReturnEvent,
        BonusDisclosureEvent,
        BrowserContextEvent,
    ],
    pydantic.Field(discriminator='event_type')
]
