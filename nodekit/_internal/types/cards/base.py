from abc import ABC
from typing import Any

import pydantic

from nodekit._internal.types.base import DslModel
from nodekit._internal.types.common import CardId, BoardRectangle, BoardLocation, Timespan
from uuid import uuid4


class BaseCard(DslModel, ABC):
    """
    Cards are the atomic elements which constitute a single Node.
    Cards are spatially and temporally bound on the Board.
    Some Cards may have Sensors attached to them, which listen for Participant behavior, and emits an Action when triggered.
    """
    # Identifiers
    card_id: CardId = pydantic.Field(default_factory=uuid4)
    card_type: str
    card_parameters: Any
    # Spatial
    card_shape: BoardRectangle
    card_location: BoardLocation
    # Temporal
    card_timespan: Timespan
