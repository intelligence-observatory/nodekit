import mimetypes
from pathlib import Path
from typing import Self, Annotated, Union

import pydantic

from nodekit._internal.ops.hash_asset_file import hash_asset_file
from nodekit._internal.types.common import (
    MediaType,
    ImageMediaType,
    VideoMediaType,
    SHA256,
)


# %%
class BaseAssetFile(pydantic.BaseModel):
    """
    Points to an asset file located on the user's filesystem,
    along with the user's assertion of the file's SHA-256 hash and mime type.
    These assertions will be later validated in a pre-run stage.
    """

    sha256: SHA256
    media_type: MediaType

    # Python runtime fields only:
    path: pydantic.FilePath | None = pydantic.Field(
        exclude=True,  # Never included in the JSON dump
        description="The path to the asset file on the Graph reader's local filesystem.",
        default=None,
    )
    _verified: bool = pydantic.PrivateAttr(
        default=False
    )  # If verified, will skip the (I/O bound) hash check

    @pydantic.field_validator("path", mode="after")
    def make_absolute_path(cls, path: Path) -> Path:
        return path.resolve()

    @pydantic.model_validator(mode="after")
    def check_file_extension(self) -> Self:
        """
        Validate that the path ends with the expected file extension
        """

        # Skip if no path is set (e.g. when deserializing from JSON)
        if self.path is None:
            return self

        extension = mimetypes.guess_extension(type=self.media_type, strict=True)
        if not extension:
            raise ValueError(
                f"Could not determine file extension for mime type {self.media_type}."
            )

        if not str(self.path).endswith(extension):
            raise ValueError(
                f"Asset path {self.path} does not end with the expected file extension {extension}."
            )

        return self

    @pydantic.model_validator(mode="after")
    def check_file_hash(self) -> Self:
        """
        Validate that the file at the given path matches the expected SHA-256 hash.
        This is I/O intensive, as it reads the entire file.
        """
        if self.path is None:
            return self
        if self._verified:
            return self
        actual_sha256 = hash_asset_file(self.path)
        if actual_sha256 != self.sha256:
            raise ValueError(
                f"Asset file at {self.path} has SHA-256 hash {actual_sha256}, but expected {self.sha256}."
            )
        return self

    @classmethod
    def from_path(cls, path: Path | str) -> Self:
        """
        A convenience method to create an Asset from a file path.
        This is I/O bound, as it computes the SHA-256 hash of the file.
        """
        path = Path(path)
        sha256 = hash_asset_file(path)
        guessed_mime_type, _ = mimetypes.guess_type(path, strict=True)
        if not guessed_mime_type:
            raise ValueError(
                f"Could not determine MIME type for file at {path}\n Does it have a valid file extension?"
            )

        guessed_mime_type: MediaType

        return cls(
            sha256=sha256,
            media_type=guessed_mime_type,
            path=path.resolve(),
            _verified=True,
        )


class ImageFile(BaseAssetFile):
    media_type: ImageMediaType


class VideoFile(BaseAssetFile):
    media_type: VideoMediaType


AssetFile = Annotated[
    Union[
        ImageFile,
        VideoFile,
    ],
    pydantic.Field(discriminator="mime_type"),
]
