from typing import Dict, List

import pydantic

from nodekit._internal.types.cards import Card
from nodekit._internal.types.common import CardId, SensorId, ColorHexString, JsonValue
from nodekit._internal.types.effects.effects import Effect
from nodekit._internal.types.sensors.sensors import Sensor


# %%
class Node(pydantic.BaseModel):
    cards: Dict[CardId, Card] = pydantic.Field(
        description=("Set of Cards placed on the Board."),
    )

    sensors: Dict[SensorId, Sensor] = pydantic.Field(
        min_length=1,
        description="Set of Sensors that listen for a Participant Action. The first Sensor that is triggered ends the Node.",
    )
    effects: List[Effect] = pydantic.Field(default_factory=list)

    board_color: ColorHexString = pydantic.Field(
        description='The color of the Board during this Node (the "background color").',
        default="#808080ff",
        validate_default=True,
    )

    # Optional:
    annotation: JsonValue = pydantic.Field(
        default=None,
        description="An optional, author-supplied annotation for this Node. May be used for arbitrary purposes.",
    )


# %%
"""
Example:

{
    tag: 'bla'
    stimulus: 
    
}
 
"""
