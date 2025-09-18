from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.common import SpatialPoint, SpatialSize

# %%
class BaseBoardRegion(pydantic.BaseModel):
    """
    A Region is defined by a boolean function over the Board.

    Semantically, we say that a point on the Board is "in" a Region if the
    function evaluates to True at that point.

    Regions can be used to define areas of interest, such as clickable regions.
    """
    region_type: str


class Rectangle(BaseBoardRegion):
    region_type: Literal['Rectangle'] = 'Rectangle'
    x: SpatialPoint = pydantic.Field(description='The center of the rectangle, along the Board x-axis.')
    y: SpatialPoint = pydantic.Field(description='The center of the rectangle, along the Board y-axis.')
    w: SpatialSize = pydantic.Field(description='The width of the rectangle, in Board units.', gt=0)
    h: SpatialSize = pydantic.Field(description='The height of the rectangle, in Board units.', gt=0)


class Ellipse(BaseBoardRegion):
    region_type: Literal['Ellipse'] = 'Ellipse'
    x: SpatialPoint = pydantic.Field(description='The center of the ellipse, along the Board x-axis.')
    y: SpatialPoint = pydantic.Field(description='The center of the ellipse, along the Board y-axis.')
    w: SpatialSize = pydantic.Field(description='The x-diameter of the ellipse, in Board units.')
    h: SpatialSize = pydantic.Field(description='The y-diameter of the ellipse, in Board units.')


# %%
BoardRegion = Annotated[
    Union[
        Rectangle,
        Ellipse
    ],
    pydantic.Field(discriminator='region_type')
]
