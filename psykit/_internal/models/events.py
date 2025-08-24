from typing import Literal, Annotated, Union

import pydantic

from psykit._internal.models.fields import DatetimeUTC
from psykit._internal.models.node_engine.base import NullValue
from psykit._internal.models.node_engine.node_graph import NodeResult


# %%
class BaseEvent(pydantic.BaseModel):
    event_id: str
    run_id: str
    event_type: str
    event_payload: NullValue
    event_timestamp: DatetimeUTC


# %%
class StartEvent(BaseEvent):
    event_type: Literal['StartEvent'] = 'StartEvent'


class EndEvent(BaseEvent):
    event_type: Literal['EndEvent'] = 'EndEvent'


# %%
class NodeResultEvent(BaseEvent):
    event_type: Literal['NodeResultEvent'] = 'NodeResultEvent'
    event_payload: NodeResult

# %%
Event = Annotated[
    Union[
        StartEvent,
        NodeResultEvent,
        EndEvent,
        # Add other Event types here as needed
    ],
    pydantic.Field(discriminator='event_type')
]