from typing import List

import pydantic

from nodekit import VERSION
from nodekit._internal.types.events.events import Event

# %%
class Trace(pydantic.BaseModel):
    """
    The canonical representation of a Participant's path through a Graph.
    """
    nodekit_version: str = pydantic.Field(default=VERSION)
    events: List[Event]
