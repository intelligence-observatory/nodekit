from typing import Literal, Annotated, Union, List

import pydantic

from psykit._internal.models.node_engine.base import NullParameters, DslModel
from psykit._internal.models.node_engine.cards.base import BaseCard
from psykit._internal.models.node_engine.fields import TextContent, ColorHexString
from psykit._internal.models.assets.base import ImageLink


# %% Concrete card classes
class FixationPointCard(BaseCard):
    card_type: Literal['FixationPointCard'] = 'FixationPointCard'
    card_parameters: NullParameters = pydantic.Field(default_factory=NullParameters, frozen=True)


# %%
class MarkdownPagesCard(BaseCard):
    class Parameters(DslModel):
        pages: List[TextContent] = pydantic.Field(
            description='A list of MarkdownContent objects representing the text content on the pages to be displayed.'
        )

    card_type: Literal['MarkdownPagesCard'] = 'MarkdownPagesCard'
    card_parameters: Parameters


# %%
class ImageCard(BaseCard):
    class Parameters(DslModel):
        image_link: ImageLink

    card_type: Literal['ImageCard'] = 'ImageCard'
    card_parameters: Parameters


# %%
class TextCard(BaseCard):
    class Parameters(DslModel):
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
        TextCard,
        MarkdownPagesCard,
        # Add other Card types here as needed
    ],
    pydantic.Field(discriminator='card_type')
]
