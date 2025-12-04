import pydantic

from nodekit._internal.types.value import (
    SpatialPoint,
    SpatialSize,
)


class Region(pydantic.BaseModel):
    x: SpatialPoint
    y: SpatialPoint
    w: SpatialSize
    h: SpatialSize
    z_index: int | None = None
