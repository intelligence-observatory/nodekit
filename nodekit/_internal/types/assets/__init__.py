import enum
import mimetypes
from abc import ABC
from pathlib import Path
from typing import Literal, Annotated, Union, Self

import pydantic

from nodekit._internal.ops.hash_file import (
    hash_file,
)
from nodekit._internal.types.common import (
    SHA256,
    MediaType,
    ImageMediaType,
    VideoMediaType,
)


# %%
class LocatorTypeEnum(str, enum.Enum):
    FileSystemPath = "FileSystemPath"
    ZipArchiveInnerPath = "ZipArchiveInnerPath"
    RelativePath = "RelativePath"
    URL = "URL"


class BaseLocator(pydantic.BaseModel, ABC):
    locator_type: LocatorTypeEnum


class FileSystemPath(BaseLocator):
    """
    A locator which points to an absolute filepath on the viewer's local file system.
    """

    locator_type: Literal[LocatorTypeEnum.FileSystemPath] = (
        LocatorTypeEnum.FileSystemPath
    )
    path: pydantic.FilePath = pydantic.Field(
        description="The absolute path to the asset file in the local filesystem."
    )

    @pydantic.field_validator("path", mode="after")
    def ensure_path_absolute(cls, path: Path) -> Path:
        return path.resolve()


class ZipArchiveInnerPath(BaseLocator):
    locator_type: Literal[LocatorTypeEnum.ZipArchiveInnerPath] = (
        LocatorTypeEnum.ZipArchiveInnerPath
    )
    zip_archive_path: pydantic.FilePath = pydantic.Field(
        description="The path to the zip archive file on the local filesystem"
    )
    inner_path: Path = pydantic.Field(
        description="The internal path within the zip archive to the asset file."
    )

    @pydantic.field_validator("zip_archive_path", mode="after")
    def ensure_zip_path_absolute(cls, path: Path) -> Path:
        return path.resolve()


class RelativePath(BaseLocator):
    """
    A locator which points to a relative path on the viewer's local file system.
    This is useful for assets that are bundled alongside a graph file, e.g., in a zip archive.
    The viewer must resolve the relative path against a known base path.
    """

    locator_type: Literal[LocatorTypeEnum.RelativePath] = LocatorTypeEnum.RelativePath
    relative_path: Path = pydantic.Field(
        description="The relative path to the asset file in the local filesystem."
    )

    @pydantic.field_validator("relative_path", mode="after")
    def ensure_path_not_absolute(cls, path: Path) -> Path:
        if path.is_absolute():
            raise ValueError("RelativePath must be a relative path, got absolute path.")
        return path


class URL(BaseLocator):
    locator_type: Literal[LocatorTypeEnum.URL] = LocatorTypeEnum.URL
    url: str = pydantic.Field(
        description="The URL to the asset file. May be a relative or absolute URL."
    )

type AssetLocator = Annotated[
    Union[FileSystemPath, ZipArchiveInnerPath, RelativePath, URL],
    pydantic.Field(discriminator="locator_type"),
]


# %%
class BaseAsset(pydantic.BaseModel):
    """
    An Asset is:
    - An identifier for an asset file (its SHA-256 hash and media type)
    - A source of bytes that are claimed to hash to the identifier. The locator must be valid, but the bytes at the location  are not guaranteed to match the identifier.
    """

    sha256: SHA256 = pydantic.Field(
        description="The SHA-256 hash of the asset file, as a hex string."
    )
    media_type: MediaType = pydantic.Field(
        description="The IANA media (MIME) type of the asset."
    )
    locator: AssetLocator = pydantic.Field(
        description="A location which is a claimed source of bytes for the asset.",
    )

    @classmethod
    def from_path(cls, path: Path | str) -> Self:
        """
        A public convenience method to create an Asset from a file path on the user's local file system.
        This is I/O bound, as it computes the SHA-256 hash of the file.
        """
        path = Path(path)
        sha256 = hash_file(path)
        guessed_media_type, _ = mimetypes.guess_type(path, strict=True)
        if not guessed_media_type:
            raise ValueError(
                f"Could not determine MIME type for file at {path}\n Does it have a valid file extension?"
            )

        guessed_media_type: MediaType

        return cls(
            sha256=sha256,
            media_type=guessed_media_type,
            locator=FileSystemPath(path=path),
        )


class Image(BaseAsset):
    media_type: ImageMediaType = pydantic.Field(
        description="The IANA media (MIME) type of the image file."
    )


class Video(BaseAsset):
    media_type: VideoMediaType = pydantic.Field(
        description="The IANA media (MIME) type of the video file."
    )


type Asset = Annotated[
    Union[Image, Video],
    pydantic.Field(discriminator="media_type"),
]
