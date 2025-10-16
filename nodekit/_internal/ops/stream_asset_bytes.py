import contextlib
import zipfile
from typing import ContextManager, IO

from nodekit._internal.types.assets import (
    AssetLocator,
    URL,
    RelativePath,
    ZipArchiveInnerPath, FileSystemPath,
    Asset
)
import urllib.request
import urllib.error


# %%
def stream_asset_bytes(
        asset: Asset,
) -> ContextManager[IO[bytes]]:
    """
    Streams the bytes of the given Asset.
    """

    locator: AssetLocator = asset.locator

    if isinstance(locator, FileSystemPath):
        return open(locator.path, "rb")
    elif isinstance(locator, URL):
        @contextlib.contextmanager
        def open_url_stream():
            req = urllib.request.Request(locator.url)
            try:
                # Add a timeout to avoid hanging forever:
                with urllib.request.urlopen(req, timeout=30) as resp:
                    # Raise on non-2xx if you want stricter behavior:
                    status = getattr(resp, "status", 200)
                    if not (200 <= status < 300):
                        raise urllib.error.HTTPError(locator.url, status, "Bad HTTP status", resp.headers, None)
                    yield resp  # file-like, binary
            except urllib.error.URLError as e:
                raise RuntimeError(f"Failed to stream Asset from URL: {locator.url}") from e

        return open_url_stream()

    elif isinstance(locator, ZipArchiveInnerPath):
        @contextlib.contextmanager
        def open_stream():
            with zipfile.ZipFile(locator.zip_archive_path, "r") as zf:
                with zf.open(str(locator.inner_path), "r") as fh:
                    yield fh

        return open_stream()
    elif isinstance(locator, RelativePath):
        # Try to open relative to current working directory:
        return open(locator.relative_path, "rb")
    else:
        raise ValueError(f"Unsupported locator type: {locator.locator_type}")
