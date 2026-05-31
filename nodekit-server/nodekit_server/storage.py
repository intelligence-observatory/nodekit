"""Asset storage backends for nodekit-server."""

import dataclasses
import os
import shutil
import tempfile
from pathlib import Path
from typing import Any, Protocol
from urllib.parse import quote

import boto3
import botocore.exceptions


# %% Storage boundary
@dataclasses.dataclass(frozen=True)
class AssetResolution:
    """Resolved delivery location for participant-facing Asset requests."""

    file_path: Path | None = None
    redirect_url: str | None = None


class AssetStore(Protocol):
    """Storage boundary for content-addressed Asset bytes."""

    def storage_key_for_sha256(self, sha256: str) -> str:
        """Return an opaque storage key for a content-addressed Asset."""
        ...

    def exists(self, storage_key: str) -> bool:
        """Return whether a storage key already exists."""
        ...

    def put_file(self, storage_key: str, source_path: Path, media_type: str | None = None) -> None:
        """Persist a staged file under the storage key."""
        ...

    def resolve(self, storage_key: str) -> AssetResolution | None:
        """Resolve a storage key for participant-facing delivery."""
        ...


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

    def put_file(self, storage_key: str, source_path: Path, media_type: str | None = None) -> None:
        """Atomically persist a staged file under the storage key."""

        _ = media_type
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

    def resolve(self, storage_key: str) -> AssetResolution | None:
        """Resolve a storage key to a local filesystem path."""

        path = self.path_for_key(storage_key)
        if not path.is_file():
            return None
        return AssetResolution(file_path=path)


# %% S3 storage
class S3AssetStore:
    """S3-backed content-addressed Asset storage with public URL delivery."""

    def __init__(
        self,
        bucket_name: str,
        public_base_url: str,
        region_name: str,
        prefix: str = "assets",
        endpoint_url: str | None = None,
        client: Any | None = None,
    ):
        self.bucket_name = bucket_name
        self.public_base_url = public_base_url.rstrip("/")
        self.prefix = prefix.strip("/")
        self.client = client or boto3.client(
            "s3",
            region_name=region_name,
            endpoint_url=endpoint_url,
        )

    def storage_key_for_sha256(self, sha256: str) -> str:
        """Return an S3 object key for a content-addressed Asset."""

        if self.prefix == "":
            return sha256
        return f"{self.prefix}/{sha256}"

    def exists(self, storage_key: str) -> bool:
        """Return whether the S3 object exists."""

        try:
            self.client.head_object(Bucket=self.bucket_name, Key=storage_key)
        except botocore.exceptions.ClientError as error:
            code = error.response.get("Error", {}).get("Code")
            status = error.response.get("ResponseMetadata", {}).get("HTTPStatusCode")
            if code in {"404", "NoSuchKey", "NotFound"} or status == 404:
                return False
            raise
        return True

    def put_file(self, storage_key: str, source_path: Path, media_type: str | None = None) -> None:
        """Upload a staged file to S3 under the storage key."""

        extra_args = {}
        if media_type is not None:
            extra_args["ContentType"] = media_type
        try:
            self.client.upload_file(
                Filename=str(source_path),
                Bucket=self.bucket_name,
                Key=storage_key,
                ExtraArgs=extra_args,
            )
        finally:
            source_path.unlink(missing_ok=True)

    def resolve(self, storage_key: str) -> AssetResolution:
        """Resolve a storage key to a public S3/CDN URL."""

        return AssetResolution(redirect_url=f"{self.public_base_url}/{quote(storage_key)}")
