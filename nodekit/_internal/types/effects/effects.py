from abc import ABC
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.common import NodeTimePointMsec


class BaseEffect(pydantic.BaseModel, ABC):
    effect_type: str

    start_msec: NodeTimePointMsec = pydantic.Field(
        description='The time (in milliseconds) relative to Node start when the Effect begins.',
        default=0,
    )
    end_msec: NodeTimePointMsec | None = pydantic.Field(
        description='The time (in milliseconds) relative to Node start when the Effect ends. If None, the Effect continues until the Node ends.',
        default=None,
    )


# %%
class HidePointerEffect(BaseEffect):
    """
    Effect to hide the pointer during a timespan.
    """
    effect_type: Literal['HidePointerEffect'] = 'HidePointerEffect'

    end_msec: NodeTimePointMsec # Must be specified for this effect


Effect = Annotated[
    Union[HidePointerEffect],
    pydantic.Field(
        discriminator='effect_type',
    )
]
