import pydantic

from nodekit._internal.types.cards import Card
from nodekit._internal.types.common import ColorHexString
from nodekit._internal.types.sensors.sensors import Sensor


# %%
class Node(pydantic.BaseModel):
    stimulus: Card
    sensor: Sensor

    board_color: ColorHexString = pydantic.Field(
        description='The color of the Board during this Node (the "background color").',
        default="#808080ff",
        validate_default=True,
    )
    hide_pointer: bool = False