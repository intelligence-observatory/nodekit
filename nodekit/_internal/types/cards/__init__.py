from abc import ABC
from typing import Literal, Annotated, Union, Self

import pydantic

from nodekit._internal.types.assets import Image, Video
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

    z_index: int | None = None

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


# %% Mixins
class SelectableMixin(pydantic.BaseModel):
    selectable: bool = pydantic.Field(default=False)


# %%
class ImageCard(BaseCard):
    card_type: Literal["ImageCard"] = "ImageCard"
    image: Image


# %%
class TextCard(BaseCard, SelectableMixin):
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
class VideoCard(BaseCard):
    card_type: Literal["VideoCard"] = "VideoCard"
    video: Video
    muted: bool = pydantic.Field(
        description="Whether to mute the video audio.", default=True
    )
    loop: bool = pydantic.Field(
        description="Whether to loop the video when it ends.", default=False
    )


# %%
class SliderCard(BaseCard):
    card_type: Literal["SliderCard"] = "SliderCard"

    num_bins: int = pydantic.Field(
        description="The number of discrete bins in the slider.", ge=2, default=7
    )

    initial_bin_index: int | None = pydantic.Field(
        description="The initial bin index that the slider is set to when it first appears. If None, defaults to the middle bin.",
        ge=0,
        default=None,
    )

    orientation: Literal["horizontal", "vertical"] = pydantic.Field(
        description="The orientation of the slider. In the horizontal orientation, the slider positional index grows left to right. In the vertical orientation, the slider positional index grows bottom to top.",
        default="horizontal",
    )

    show_bin_markers: bool = pydantic.Field(
        description="Whether to show the bin markers on the slider. This is best used for sliders with a small number of bins.",
        default=False,
    )

    @pydantic.model_validator(mode="after")
    def set_initial_bin_index(self) -> Self:
        if self.initial_bin_index is None:
            self.initial_bin_index = (self.num_bins - 1) // 2

        if self.initial_bin_index < 0 or self.initial_bin_index >= self.num_bins:
            raise ValueError("initial_bin_index must be between 0 and num_bins - 1")
        return self


# %%
class FreeTextEntryCard(BaseCard):
    card_type: Literal["FreeTextEntryCard"] = "FreeTextEntryCard"

    prompt: str = pydantic.Field(
        description="The initial placeholder text shown in the free text response box. It disappears when the user selects the element.",
        default="",
    )

    font_size: SpatialSize = pydantic.Field(
        description="The height of the em-box, in Board units.",
        default=0.02,
    )

    text_color: ColorHexString = pydantic.Field(
        default="#000000", validate_default=True
    )
    background_color: ColorHexString = pydantic.Field(
        default="#ffffff",  # White by default
        validate_default=True,
        description="The background color of the entry field.",
    )

    max_length: int | None = pydantic.Field(
        description="The maximum number of characters the user can enter. If None, no limit.",
        default=None,
        ge=1,
        le=10000,
    )


# RegionSelectionCard

# %%
Card = Annotated[
    Union[ImageCard, VideoCard, TextCard, SliderCard, FreeTextEntryCard],
    pydantic.Field(discriminator="card_type"),
]
