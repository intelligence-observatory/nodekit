from typing import Literal

import pydantic

from nodekit._internal.types.cards import Card
from nodekit._internal.types.sensors.sensors import Sensor
from nodekit._internal.types.value import ColorHexString


# %%
class Node(pydantic.BaseModel):
    type: Literal["Node"] = "Node"
    stimulus: Card | None
    sensor: Sensor

    board_color: ColorHexString = pydantic.Field(
        description='The color of the Board during this Node (the "background color").',
        default="#808080ff",
        validate_default=True,
    )
    hide_pointer: bool = False

    annotation: str = pydantic.Field(
        description='An optional, user-defined annotation for the Node that may be useful for debugging or analysis purposes.',
        default="",
    )
