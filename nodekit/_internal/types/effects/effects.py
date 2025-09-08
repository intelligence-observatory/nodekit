from abc import ABC
from typing import Literal, Any, Annotated, Union

import pydantic

from nodekit._internal.types.common import Timespan, NullParameters


class BaseEffect(pydantic.BaseModel, ABC):
    effect_type: str
    effect_parameters: Any
    effect_timespan: Timespan = pydantic.Field(default_factory=lambda: Timespan(start_time_msec=0, end_time_msec=None))


# %%
class HidePointerEffect(BaseEffect):
    """
    Effect to hide the pointer during a timespan.
    """
    effect_type: Literal['HidePointerEffect'] = 'HidePointerEffect'
    effect_parameters: NullParameters = pydantic.Field(default_factory=NullParameters)


Effect = Annotated[
    Union[HidePointerEffect],
    pydantic.Field(
        discriminator='effect_type',
    )
]
