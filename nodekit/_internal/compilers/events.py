from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.models.fields import DatetimeUTC
from nodekit._internal.models.node_engine.base import NullValue
from nodekit._internal.models.node_engine.node_graph import NodeResult

from uuid import UUID

# %%
import enum


class EventTypeEnum(str, enum.Enum):
    StartEvent = 'StartEvent'
    NodeResultEvent = 'NodeResultEvent'
    LeaveEvent = 'LeaveEvent'
    ReturnEvent = 'ReturnEvent'
    EndEvent = 'EndEvent'
    BonusDisclosureEvent = 'BonusDisclosureEvent'


# %%
class BaseEvent(pydantic.BaseModel):
    event_id: UUID
    run_id: UUID
    event_type: EventTypeEnum
    event_payload: NullValue
    event_timestamp: DatetimeUTC


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
    event_type: Literal[EventTypeEnum.BonusDisclosureEvent] = EventTypeEnum.BonusDisclosureEvent


# %%
class NodeResultEvent(BaseEvent):
    event_type: Literal[EventTypeEnum.NodeResultEvent] = EventTypeEnum.NodeResultEvent
    event_payload: NodeResult


# %%
Event = Annotated[
    Union[
        StartEvent,
        EndEvent,
        NodeResultEvent,
        LeaveEvent,
        ReturnEvent,
        BonusDisclosureEvent,
    ],
    pydantic.Field(discriminator='event_type')
]
