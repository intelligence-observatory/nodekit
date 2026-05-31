"""Asset storage backends for nodekit-server."""

import os
import shutil
import tempfile
from pathlib import Path


# %% Filesystem storage
class FileSystemAssetStore:
    """Filesystem-backed content-addressed Asset storage."""

    def __init__(self, root: Path):
        self.root = root

    def storage_key_for_sha256(self, sha256: str) -> str:
        """Return an opaque storage key for a content-addressed Asset."""

        return str(Path("assets") / sha256[:2] / sha256)

    def path_for_key(self, storage_key: str) -> Path:
        """Resolve a storage key under the configured root."""

        path = (self.root / storage_key).resolve()
        root = self.root.resolve()
        if root not in path.parents and path != root:
            raise ValueError(f"Storage key escapes Asset store root: {storage_key}")
        return path

    def exists(self, storage_key: str) -> bool:
        """Return whether a storage key already exists."""

        return self.path_for_key(storage_key).is_file()

    def put_file(self, storage_key: str, source_path: Path) -> None:
        """Atomically persist a staged file under the storage key."""

        destination = self.path_for_key(storage_key)
        destination.parent.mkdir(parents=True, exist_ok=True)
        if destination.exists():
            source_path.unlink(missing_ok=True)
            return

        temp_file_descriptor, temp_path_string = tempfile.mkstemp(
            prefix=destination.name + ".",
            dir=destination.parent,
        )
        temp_path = Path(temp_path_string)
        try:
            with os.fdopen(temp_file_descriptor, "wb", closefd=True) as out_file:
                with source_path.open("rb") as in_file:
                    shutil.copyfileobj(in_file, out_file, length=1024 * 1024)
                out_file.flush()
                os.fsync(out_file.fileno())
            os.replace(temp_path, destination)
        finally:
            temp_path.unlink(missing_ok=True)
            source_path.unlink(missing_ok=True)
