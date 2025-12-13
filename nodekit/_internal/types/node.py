from typing import Literal

import pydantic

from nodekit._internal.types.cards import Card
from nodekit._internal.types.sensors import Sensor
from nodekit._internal.types.values import ColorHexString


# %%
class Node(pydantic.BaseModel):
    type: Literal["Node"] = "Node"
    stimulus: Card | None = pydantic.Field(
        description="The visual context presented to the Participant during this Node. If None, the Board will be blank (except for the background color).",
    )
    sensor: Sensor = pydantic.Field(
        description="The Action Set that the Participant must make a selection from to end this Node.",
    )

    board_color: ColorHexString = pydantic.Field(
        description="The background color of the Board during this Node.",
        default="#808080ff",
        validate_default=True,
    )

    hide_pointer: bool = pydantic.Field(
        default=False,
        description="Whether to hide the mouse pointer during this Node.",
    )

    annotation: str = pydantic.Field(
        default="",
        description="An optional, user-defined annotation for the Node that may be useful for debugging or analysis purposes.",
    )
