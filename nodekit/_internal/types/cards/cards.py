from abc import ABC
from typing import Literal, Annotated, Union

import pydantic

from nodekit._internal.types.assets import ImageIdentifier, VideoIdentifier
from nodekit._internal.types.common import (
    ColorHexString,
    MarkdownString,
    SpatialPoint,
    SpatialSize,
    NodeTimePointMsec,
)


# %% Concrete card classes
class BaseCard(pydantic.BaseModel, ABC):
    """
    Cards are visual elements which are placed on the Board.
    They are defined by their type, position, size, and the time range during which they are visible.
    """

    # Identifiers
    card_type: str

    # Position:
    x: SpatialPoint = pydantic.Field(
        description="The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right."
    )
    y: SpatialPoint = pydantic.Field(
        description="The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up."
    )

    # Shape:
    w: SpatialSize = pydantic.Field(
        description="The width of the Card, in Board units."
    )
    h: SpatialSize = pydantic.Field(
        description="The height of the Card, in Board units."
    )

    # Time:
    start_msec: NodeTimePointMsec = pydantic.Field(
        description="The time (in milliseconds) relative to Node start when the Card is placed on the Board.",
        default=0,
    )
    end_msec: NodeTimePointMsec | None = pydantic.Field(
        description="The time (in milliseconds) relative to Node start when the Card is removed from the Board.",
        default=None,
    )


# %%
class ImageCard(BaseCard):
    card_type: Literal["ImageCard"] = "ImageCard"
    image: ImageIdentifier


# %%
class TextCard(BaseCard):
    card_type: Literal["TextCard"] = "TextCard"

    text: MarkdownString = pydantic.Field(min_length=1)
    font_size: SpatialSize = pydantic.Field(
        default=0.0175, description="The height of the em-box, in Board units."
    )
    justification_horizontal: Literal["left", "center", "right"] = "center"
    justification_vertical: Literal["top", "center", "bottom"] = "center"
    text_color: ColorHexString = pydantic.Field(
        default="#000000", validate_default=True
    )
    background_color: ColorHexString = pydantic.Field(
        default="#E6E6E600",  # Transparent by default
        description="The background color of the TextCard in hexadecimal format.",
    )


# %%
class VideoCard(BaseCard):
    card_type: Literal["VideoCard"] = "VideoCard"
    video: VideoIdentifier
    muted: bool = pydantic.Field(
        description="Whether to mute the video audio.", default=True
    )
    loop: bool = pydantic.Field(
        description="Whether to loop the video when it ends.", default=False
    )


# %%
Card = Annotated[
    Union[
        ImageCard,
        VideoCard,
        TextCard,
    ],
    pydantic.Field(discriminator="card_type"),
]
