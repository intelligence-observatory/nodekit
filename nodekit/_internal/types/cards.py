from abc import ABC
from typing import Literal, Annotated, Union, Dict

import pydantic

from nodekit._internal.types.assets import Image, Video
from nodekit._internal.types.values import (
    ColorHexString,
    MarkdownString,
    SpatialSize,
    Region,
)


# %%
class BaseCard(pydantic.BaseModel, ABC):
    """
    Cards are visual elements which are placed on the Board.
    They are defined by their type, position, size, and the time range during which they are visible.
    """

    # Identifiers
    card_type: str


# %%
class BaseLeafCard(BaseCard):
    region: Region = pydantic.Field(
        description="The Board region where the card is rendered.",
        default=Region(x=0, y=0, w=0.5, h=0.5),
    )


# %%
class ImageCard(BaseLeafCard):
    card_type: Literal["ImageCard"] = "ImageCard"
    image: Image


# %%
class VideoCard(BaseLeafCard):
    """Video stimulus placed on the Board.

    Attributes:
        video: The video asset to render.
        loop: Whether to loop the video when it ends.
        region: The Board region where the video is rendered.
    """

    card_type: Literal["VideoCard"] = "VideoCard"
    video: Video
    loop: bool = pydantic.Field(
        description="Whether to loop the video when it ends.", default=False
    )


# %%
class TextCard(BaseLeafCard):
    card_type: Literal["TextCard"] = "TextCard"
    text: MarkdownString
    font_size: SpatialSize = pydantic.Field(
        default=0.02, description="The height of the em-box, in Board units."
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
class CompositeCard(BaseCard):
    card_type: Literal["CompositeCard"] = "CompositeCard"
    children: Dict[str, "Card"]


# %%
type Card = Annotated[
    Union[ImageCard, VideoCard, TextCard, CompositeCard],
    pydantic.Field(discriminator="card_type"),
]
