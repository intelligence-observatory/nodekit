from typing import Literal, Annotated, Union

import pydantic

from psykit._internal.models.fields import DatetimeUTC
from psykit._internal.models.node_engine.base import NullParameters
from psykit._internal.models.node_engine.node_graph import NodeResult


# %%
class BaseEvent(pydantic.BaseModel):
    event_type: str
    event_payload: NullParameters  # Default empty payload; just a {}
    event_timestamp: DatetimeUTC


# %%
class StartEvent(BaseEvent):
    event_type: Literal['StartEvent'] = 'StartEvent'


class NodeResultEvent(BaseEvent):
    event_type: Literal['NodeResultEvent'] = 'NodeResultEvent'
    event_payload: NodeResult


class PageUnloadedEvent(BaseEvent):
    event_type: Literal['PageUnloadedEvent'] = 'PageUnloadedEvent'


class EndEvent(BaseEvent):
    event_type: Literal['EndEvent'] = 'EndEvent'


# %%
Event = Annotated[
    Union[
        StartEvent,
        NodeResultEvent,
        PageUnloadedEvent,
        EndEvent,
        # Add other Event types here as needed
    ],
    pydantic.Field(discriminator='event_type')
]
