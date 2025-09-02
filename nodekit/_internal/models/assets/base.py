import mimetypes
from abc import ABC
from typing import Self, Annotated, Union, Literal

import pydantic

from nodekit._internal.models.fields import SHA256, MimeType


# %%
class BaseAssetLink(pydantic.BaseModel, ABC):
    mime_type: MimeType
    sha256: SHA256
    asset_url: pydantic.AnyHttpUrl

    @pydantic.model_validator(mode='after')
    def check_url(self) -> Self:
        """
        Validate that the URL ends with the expected file extension
        """
        extension = mimetypes.guess_extension(type=self.mime_type, strict=True)
        if not extension:
            raise ValueError(f"Could not determine file extension for mime type {self.mime_type}.")

        if not str(self.asset_url).endswith(extension):
            raise ValueError(f"AssetLink {self.asset_url} does not end with the expected file extension {extension}.")

        return self


# %%
class ImageLink(BaseAssetLink):
    mime_type: Literal['image/png'] = 'image/png'


# %%
AssetLink = Annotated[
    Union[
        ImageLink,
        # Add other AssetLink types here as needed
    ],
    pydantic.Field(discriminator='mime_type')
]
