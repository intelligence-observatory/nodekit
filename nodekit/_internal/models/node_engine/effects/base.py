from nodekit._internal.models.node_engine.fields import Timespan
from nodekit._internal.models.node_engine.base import NullParameters
from abc import ABC
import pydantic
from typing import TypeVar, Literal, Any, Annotated, Union

T = TypeVar('T', bound=str)
P = TypeVar('P', bound=pydantic.BaseModel)


class BaseEffect(pydantic.BaseModel, ABC):
    effect_type: T
    effect_parameters: Any
    effect_timespan: Timespan = pydantic.Field(default_factory=lambda: Timespan(start_time_msec=0, end_time_msec=None))


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
