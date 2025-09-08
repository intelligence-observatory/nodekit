from abc import ABC
from typing import Literal, Annotated, Union, List, Any
from uuid import uuid4

import pydantic
from nodekit._internal.types.common import ColorHexString, TextContent, NullParameters, CardId, BoardRectangle, BoardLocation, Timespan
from nodekit._internal.types.assets.links import ImageLink, VideoLink


# %% Concrete card classes
class BaseCard(pydantic.BaseModel, ABC):
    """
    Cards are the atomic elements which constitute a single Node.
    Cards are spatially and temporally bound on the Board.
    Some Cards may have Sensors attached to them, which listen for Participant behavior, and emits an Action when triggered.
    """
    # Identifiers
    card_id: CardId = pydantic.Field(default_factory=uuid4)
    card_type: str
    card_parameters: Any
    # Spatial
    card_shape: BoardRectangle
    card_location: BoardLocation
    # Temporal
    card_timespan: Timespan


# %%
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
    ],
    pydantic.Field(discriminator='card_type')
]
