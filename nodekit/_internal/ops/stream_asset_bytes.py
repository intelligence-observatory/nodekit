import contextlib
import zipfile
from typing import ContextManager, IO

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
            return open(locator.path, "rb")
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
            return open(locator.path, "rb")
        case _:
            raise ValueError(f"Unsupported locator type: {locator.locator_type}")
