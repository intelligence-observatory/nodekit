import contextlib
import zipfile
from pathlib import Path
from typing import ContextManager, IO

from nodekit._internal.ops.hash_file import (
    get_extension_from_media_type,
)
from nodekit._internal.types.assets import AssetLocator, Asset, LocatorTypeEnum


# %%
def stream_asset_bytes(
        asset: Asset,
) -> ContextManager[IO[bytes]]:
    """
    Streams the bytes of the given Asset.
    """

    locator: AssetLocator = asset.locator

    match locator.locator_type:
        case LocatorTypeEnum.FileSystemPath:
            return open(locator.path, 'rb')
        case LocatorTypeEnum.URL:
            import requests
            response = requests.get(locator.url, stream=True)
            response.raise_for_status()
            return response.raw
        case LocatorTypeEnum.ZipArchiveInnerPath:
            @contextlib.contextmanager
            def open_stream():
                with zipfile.ZipFile(locator.zip_archive_path, "r") as zf:
                    with zf.open(str(locator.inner_path), "r") as fh:
                        yield fh
            return open_stream()
        case LocatorTypeEnum.RelativePath:
            # Try to open relative to current working directory:
            return open(locator.path, 'rb')
        case _:
            raise ValueError(f"Unsupported locator type: {locator.locator_type}")


# %%
def save_asset(
        asset: Asset,
        path: Path
) -> None:
    # Check if the path ends with the correct extension:
    intended_extension = get_extension_from_media_type(asset.media_type)
    if not path.name.endswith(f".{intended_extension}"):
        raise ValueError(
            f"Path must end with .{intended_extension} for media type {asset.media_type}, got: {path}"
        )

    # Use the locator to read the bytes and write them to the given path:
    with asset.locator.open() as src_fh:
        with path.open("wb") as dst_fh:
            while True:
                chunk = src_fh.read(1024 * 1024)
                if not chunk:
                    break
                dst_fh.write(chunk)
