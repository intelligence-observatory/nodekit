from abc import ABC
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.common import NodeTimePointMsec


class BaseEffect(pydantic.BaseModel, ABC):
    effect_type: str


# %%
class HidePointerEffect(BaseEffect):
    """
    Effect to hide the pointer during a timespan.
    """

    effect_type: Literal["HidePointerEffect"] = "HidePointerEffect"

    start_msec: NodeTimePointMsec = pydantic.Field(
        description="The time (in milliseconds) relative to Node start when the Effect begins.",
        default=0,
    )
    end_msec: NodeTimePointMsec  # Must be specified for this effect


type Effect = Annotated[
    Union[HidePointerEffect],
    pydantic.Field(
        discriminator="effect_type",
    ),
]
