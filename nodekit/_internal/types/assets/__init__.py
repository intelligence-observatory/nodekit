import mimetypes
from pathlib import Path
from typing import Self, Literal, Annotated, Union

import pydantic

from nodekit._internal.ops.hash_asset_file import hash_asset_file
from nodekit._internal.types.common import MimeType, SHA256

from abc import ABC

# %%
class BaseAssetIdentifier(pydantic.BaseModel):
    sha256: SHA256
    mime_type: MimeType


class ImageIdentifier(BaseAssetIdentifier):
    mime_type: Literal['image/png'] = 'image/png'


class VideoIdentifier(BaseAssetIdentifier):
    mime_type: Literal['video/mp4'] = 'video/mp4'


AssetIdentifier = Annotated[Union[
        ImageIdentifier,
        VideoIdentifier,
    ],
    pydantic.Field(discriminator='mime_type')
]


# %%
class BaseAssetFile(pydantic.BaseModel, ABC):
    """
    Points to an asset file located on the user's filesystem,
    along with the user's claim of the file's SHA-256 hash and mime type.
    """
    identifier: AssetIdentifier  = pydantic.Field(description='The claimed identifier of the file bytes at the given path.',)
    path: pydantic.FilePath

    @pydantic.model_validator(mode='after')
    def check_file_extension(self) -> Self:
        """
        Validate that the path ends with the expected file extension
        """
        extension = mimetypes.guess_extension(type=self.identifier.mime_type, strict=True)
        if not extension:
            raise ValueError(f"Could not determine file extension for mime type {self.identifier.mime_type}.")

        if not str(self.path).endswith(extension):
            raise ValueError(f"Asset path {self.path} does not end with the expected file extension {extension}.")

        return self

    @classmethod
    def from_path(cls, path: Path) -> Self:
        """
        A convenience method to create an Asset from a file path.
        This is I/O intensive, as it computes the SHA-256 hash of the file.
        """
        sha256 = hash_asset_file(path)
        guessed_mime_type, _ = mimetypes.guess_type(path, strict=True)
        if not guessed_mime_type:
            raise ValueError(f"Could not determine mime_type for file at path {path}.")

        guessed_mime_type: MimeType

        type_adapter = pydantic.TypeAdapter(AssetIdentifier)
        asset_identifier = type_adapter.validate_python({
            'sha256': sha256,
            'mime_type': guessed_mime_type
        })
        return cls(
            identifier=asset_identifier,
            path=path.resolve()
        )

class ImageFile(BaseAssetFile):
    identifier: ImageIdentifier = pydantic.Field(description='The identifier for the image asset, including its SHA-256 hash and mime type.')

class VideoFile(BaseAssetFile):
    identifier: VideoIdentifier = pydantic.Field(description='The identifier for the video asset, including its SHA-256 hash and mime type.')

AssetFile = Annotated[
    Union[
        ImageFile,
        VideoFile,
    ],
    pydantic.Field(discriminator='identifier')
]


# %%
class AssetUrl(pydantic.BaseModel):
    identifier: AssetIdentifier = pydantic.Field(description='The claimed identifier for the asset, including its SHA-256 hash and mime type.')
    url: pydantic.AnyUrl
