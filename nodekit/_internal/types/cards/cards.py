from typing import Literal, Annotated, Union, List

import pydantic

from nodekit._internal.types.cards.base import BaseCard
from nodekit._internal.types.common import ColorHexString, TextContent, NullParameters
from nodekit._internal.types.assets.base import ImageLink, VideoLink


# %% Concrete card classes
class FixationPointCard(BaseCard):
    card_type: Literal['FixationPointCard'] = 'FixationPointCard'
    card_parameters: NullParameters = pydantic.Field(default_factory=NullParameters, frozen=True)


# %%
class MarkdownPagesCard(BaseCard):
    class Parameters(pydantic.BaseModel):
        pages: List[TextContent] = pydantic.Field(
            description='A list of MarkdownContent objects representing the text content on the pages to be displayed.'
        )

    card_type: Literal['MarkdownPagesCard'] = 'MarkdownPagesCard'
    card_parameters: Parameters


# %%
class ImageCard(BaseCard):
    class Parameters(pydantic.BaseModel):
        image_link: ImageLink

    card_type: Literal['ImageCard'] = 'ImageCard'
    card_parameters: Parameters


# %%
class VideoCard(BaseCard):
    class Parameters(pydantic.BaseModel):
        video_link: VideoLink

    card_type: Literal['VideoCard'] = 'VideoCard'
    card_parameters: Parameters


# %%
class TextCard(BaseCard):
    class Parameters(pydantic.BaseModel):
        content: TextContent
        background_color: ColorHexString = pydantic.Field(
            default='#E6E6E6',
            description='The background color of the TextCard in hexadecimal format.'
        )

    card_type: Literal['TextCard'] = 'TextCard'
    card_parameters: Parameters


# %%
Card = Annotated[
    Union[
        FixationPointCard,
        ImageCard,
        VideoCard,
        TextCard,
        MarkdownPagesCard,
        # Add other Card types here as needed
    ],
    pydantic.Field(discriminator='card_type')
]
