from abc import ABC
from typing import Literal, Annotated, Union, List

import pydantic

from nodekit._internal.types.assets import ImageIdentifier, VideoIdentifier
from nodekit._internal.types.common import ColorHexString, MarkdownString, SpatialPoint, SpatialSize, TimePointMsec, CardId
from uuid import uuid4


# %% Concrete card classes
class BaseCard(pydantic.BaseModel, ABC):
    """
    Cards are visual elements which are placed on the Board.
    They are defined by their type, position, size, and the time range during which they are visible.
    A Board unit of 1 corresponds to the *smaller* extent of the Board (the full width of the Board or the full height of the Board; whichever is smaller.
    """
    # Identifiers
    card_id: CardId = pydantic.Field(description='A unique identifier for the Card within the Node.', default_factory=uuid4)
    card_type: str

    # Position:
    x: SpatialPoint = pydantic.Field(description='The x-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in x moves right.')
    y: SpatialPoint = pydantic.Field(description='The y-coordinate of the Card center on the Board. 0 is the center of the Board. An increase in y moves up.')

    # Shape:
    w: SpatialSize = pydantic.Field(description='The width of the Card, in Board units.')
    h: SpatialSize = pydantic.Field(description='The height of the Card, in Board units.')

    # Time:
    t_start: TimePointMsec = pydantic.Field(
        description='The time (in milliseconds) relative to Node start when the Card is placed on the Board.',
        default=0,
    )
    t_end: TimePointMsec | None = pydantic.Field(
        description='The time (in milliseconds) relative to Node start when the Card is removed from the Board.',
        default=None,
    )


# %%
class FixationPointCard(BaseCard):
    card_type: Literal['FixationPointCard'] = 'FixationPointCard'
    w: SpatialSize = pydantic.Field(
        description='The horizontal diameter of the fixation point (ellipse), in Board units.',
        default=0.0375
    )
    h: SpatialSize = pydantic.Field(
        description='The vertical diameter of the fixation point (ellipse), in Board units.',
        default=0.0375
    )

# %%
class BlankCard(BaseCard):
    """
    A rectangular card with a solid background color and no content.
    """
    card_type: Literal['BlankCard'] = 'BlankCard'
    color: ColorHexString = pydantic.Field(
        default='#808080',
        description='The color of the BlankCard in hexadecimal format.'
    )
# %%
from nodekit._internal.types.regions import Shape

class ShapeCard(BaseCard):
    card_type: Literal['ShapeCard'] = 'ShapeCard'
    shape: Shape = pydantic.Field(
        description='The shape of the ShapeCard.',
    )
    color: ColorHexString = pydantic.Field(
        default='#808080',
        description='The color of the ShapeCard in hexadecimal format.'
    )

# %%
class ImageCard(BaseCard):
    card_type: Literal['ImageCard'] = 'ImageCard'
    image: ImageIdentifier


# %%
class TextCard(BaseCard):
    card_type: Literal['TextCard'] = 'TextCard'

    text: MarkdownString = pydantic.Field(min_length=1)
    font_size: SpatialSize = pydantic.Field(default=0.0175, description='The height of the em-box, in Board units.')
    justification_horizontal: Literal['left', 'center', 'right'] = 'center'
    justification_vertical: Literal['top', 'center', 'bottom'] = 'center'
    text_color: ColorHexString = '#000000'
    background_color: ColorHexString = pydantic.Field(
        default='#E6E6E600', # Transparent by default
        description='The background color of the TextCard in hexadecimal format.'
    )

# %%
class VideoCard(BaseCard):
    card_type: Literal['VideoCard'] = 'VideoCard'
    video: VideoIdentifier
    muted: bool = pydantic.Field(description='Whether to mute the video audio.', default=True)
    loop: bool = pydantic.Field(description='Whether to loop the video when it ends.', default=False)


# %%
Card = Annotated[
    Union[
        FixationPointCard,
        ImageCard,
        VideoCard,
        TextCard,
        BlankCard,
    ],
    pydantic.Field(discriminator='card_type')
]
