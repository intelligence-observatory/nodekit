import mimetypes
from pathlib import Path
from typing import Self, Annotated, Union

import pydantic

from nodekit._internal.ops.hash_asset_file import hash_asset_file
from nodekit._internal.types.common import MimeType, ImageMimeType, VideoMimeType, SHA256


# %%
class BaseAssetIdentifier(pydantic.BaseModel):
    sha256: SHA256
    mime_type: MimeType


class ImageIdentifier(BaseAssetIdentifier):
    mime_type: ImageMimeType


class VideoIdentifier(BaseAssetIdentifier):
    mime_type: VideoMimeType


AssetIdentifier = Annotated[Union[
        ImageIdentifier,
        VideoIdentifier,
    ],
    pydantic.Field(discriminator='mime_type')
]


# %%
class BaseAssetFile(pydantic.BaseModel):
    """
    Points to an asset file located on the user's filesystem,
    along with the user's assertion of the file's SHA-256 hash and mime type.
    These assertions will be later validated in a pre-run stage.
    """
    identifier: AssetIdentifier
    path: pydantic.FilePath

    @pydantic.field_validator('path', mode='after')
    def make_absolute_path(cls, path: Path) -> Path:
        return path.resolve()

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
    def from_path(cls, path: Path | str) -> Self:
        """
        A convenience method to create an Asset from a file path.
        This is I/O intensive, as it computes the SHA-256 hash of the file.
        """
        path = Path(path)
        sha256 = hash_asset_file(path)
        guessed_mime_type, _ = mimetypes.guess_type(path, strict=True)
        if not guessed_mime_type:
            raise ValueError(f"Could not determine MIME type for file at {path}\n Does it have a valid file extension?")

        guessed_mime_type: MimeType

        type_adapter=pydantic.TypeAdapter(AssetIdentifier)
        identifier = type_adapter.validate_python({
            'sha256': sha256,
            'mime_type': guessed_mime_type,
        }
        )

        return cls(
            identifier=identifier,
            path=path.resolve()
        )


class ImageFile(BaseAssetFile):
    identifier: ImageIdentifier

class VideoFile(BaseAssetFile):
    identifier: VideoIdentifier

AssetFile = ImageFile | VideoFile

# %%
import PIL.Image

from typing import Iterator

class Asset(pydantic.BaseModel):
    sha256: SHA256
    media_type: MimeType
    path: Path = pydantic.Field(description='Path to the asset', exclude=True)

    @classmethod
    def from_path(cls, path: Path | str) -> Self:
        ...

class Image(Asset):
    ...

    def as_pil(self) -> PIL.Image.Image:
        ...

class Video(Asset):
    ...

    def frames(self) -> Iterator[PIL.Image.Image]:
        ...