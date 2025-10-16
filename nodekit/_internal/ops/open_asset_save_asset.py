import contextlib
import zipfile
from typing import ContextManager, IO

from nodekit._internal.types.assets import (
    AssetLocator,
    URL,
    RelativePath,
    ZipArchiveInnerPath,
    FileSystemPath,
    Asset,
)
import urllib.request
import urllib.error
from pathlib import Path

from nodekit._internal.utils.get_extension_from_media_type import get_extension_from_media_type
import os
import shutil
import tempfile
# %%
def open_asset(
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
                        raise urllib.error.HTTPError(
                            locator.url, status, "Bad HTTP status", resp.headers, None
                        )
                    yield resp  # file-like, binary
            except urllib.error.URLError as e:
                raise RuntimeError(
                    f"Failed to stream Asset from URL: {locator.url}"
                ) from e

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


# %%
def save_asset(
        asset: Asset,
        path: Path,
) -> None:
    """
    Persist `asset` bytes to `path` atomically.
    Raises:
      - FileExistsError if target exists and `overwrite=False`
      - ValueError for mismatched extension when `add_extension=True`
    """
    buffer_size: int = 1024 * 1024 # 1MB buffer for streaming copy

    # --- ensure parent exists ---
    path.parent.mkdir(parents=True, exist_ok=True)

    # --- exists check ---
    if path.exists():
        raise FileExistsError(f"Refusing to overwrite existing file: {path}")

    # Fast path: hardlink local file if possible
    loc = asset.locator
    if isinstance(loc, FileSystemPath):
        src = Path(loc.path)
        try:
            # Hardlink avoids IO; falls back to copy path if cross-device
            os.link(src, path)
        except OSError:
            # Cross-device or FS limitation: fall through to streamed copy
            pass
        return

    # Slow path: stream
    tmp_file_descriptor, tmp_path_str = tempfile.mkstemp(
        prefix=path.name + ".",
        dir=path.parent
    )
    tmp_path = Path(tmp_path_str)
    try:
        with os.fdopen(tmp_file_descriptor, "wb", closefd=True) as out_f:
            # Stream from source to temp file
            with open_asset(asset) as in_f:
                shutil.copyfileobj(in_f, out_f, length=buffer_size)
            out_f.flush()
            os.fsync(out_f.fileno())

        # Atomic move into place (overwrites if exists)
        os.replace(tmp_path, path)
    finally:
        # If something failed before replace, cleanup temp
        if tmp_path.exists():
            try:
                tmp_path.unlink()
            except OSError:
                pass

