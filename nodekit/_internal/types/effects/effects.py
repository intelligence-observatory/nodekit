from abc import ABC
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.common import TimePointMsec


class BaseEffect(pydantic.BaseModel, ABC):
    effect_type: str

    t_start: TimePointMsec = pydantic.Field(
        description='The time (in milliseconds) relative to Node start when the Effect begins.',
        default=0,
    )
    t_end: TimePointMsec | None = pydantic.Field(
        description='The time (in milliseconds) relative to Node start when the Effect ends. If None, the Effect continues until the Node ends.',
        default=None,
    )


# %%
class HidePointerEffect(BaseEffect):
    """
    Effect to hide the pointer during a timespan.
    """
    effect_type: Literal['HidePointerEffect'] = 'HidePointerEffect'

    t_end: TimePointMsec # Must be specified for this effect


Effect = Annotated[
    Union[HidePointerEffect],
    pydantic.Field(
        discriminator='effect_type',
    )
]
