import pydantic
from abc import ABC
from typing import Literal, Annotated, Union
from nodekit._internal.types.common import SpatialPoint, SpatialSize

class BaseBoardRegion(pydantic.BaseModel, ABC):
    """
    Represents a boolean function over the Board. This can be used to define
    areas of interest, such as clickable regions.

    Semantically, we say that a point on the Board is "in" the region if the
    function evaluates to True at that point.
    """
    region_type: str

class Rectangle(BaseBoardRegion):
    region_type: Literal['Rectangle'] = 'Rectangle'
    x: SpatialPoint = pydantic.Field(description='The center of the rectangle, along the Board x-axis.')
    y: SpatialPoint = pydantic.Field(description='The center of the rectangle, along the Board y-axis.')
    w: SpatialSize = pydantic.Field(description='The width of the rectangle, in Board units.')
    h: SpatialSize = pydantic.Field(description='The height of the rectangle, in Board units.')

class Ellipse(BaseBoardRegion):
    region_type: Literal['Ellipse'] = 'Ellipse'
    x: SpatialPoint = pydantic.Field(description='The center of the ellipse, along the Board x-axis.')
    y: SpatialPoint = pydantic.Field(description='The center of the ellipse, along the Board y-axis.')
    w: SpatialSize = pydantic.Field(description='The x-diameter of the ellipse, in Board units.')
    h: SpatialSize = pydantic.Field(description='The y-diameter of the ellipse, in Board units.')


BoardRegion = Annotated[
    Union[
        'Rectangle',
        'Ellipse'
    ],
    pydantic.Field(discriminator='region_type')
]

