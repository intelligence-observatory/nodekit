from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.common import SpatialPoint, SpatialSize, Shape


# %%
class BaseRegion(pydantic.BaseModel):
    """
    A Region is a boolean function defined over locations on the Board.

    Semantically, we say that a location on the Board is "in" a Region if the
    function evaluates to True at that point.

    Regions can be used to mark specific areas on the Board (e.g. a clickable region).

    """
    region_type: str

class ShapeRegion(BaseRegion):
    region_type: Literal['ShapeRegion'] = 'ShapeRegion'
    shape: Shape = pydantic.Field(description='The shape that defines this Region.')
    x: SpatialPoint = pydantic.Field(description='The center of the rectangle, along the Board x-axis.')
    y: SpatialPoint = pydantic.Field(description='The center of the rectangle, along the Board y-axis.')
    w: SpatialSize = pydantic.Field(description='The width of the rectangle, in Board units.', gt=0)
    h: SpatialSize = pydantic.Field(description='The height of the rectangle, in Board units.', gt=0)

Region = Annotated[
    Union[
        ShapeRegion,
    ],
    pydantic.Field(discriminator='region_type')
]

# %%
