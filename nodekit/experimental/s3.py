import pydantic

import boto3
import botocore.client
import botocore.exceptions
from typing import BinaryIO
import hashlib
import mimetypes

from nodekit._internal.types.common import (
    SHA256,
    MediaType
)
import os
from pathlib import Path

from urllib.parse import quote


# %%
class UploadAssetResult(pydantic.BaseModel):
    sha256: SHA256
    mime_type: MediaType
    asset_url: pydantic.HttpUrl


class S3Client:
    class Config(pydantic.BaseModel):
        bucket_name: str
        region_name: str
        aws_access_key_id: str
        aws_secret_access_key: pydantic.SecretStr

    def __init__(
            self,
            bucket_name: str,
            region_name: str,
            aws_access_key_id: str,
            aws_secret_access_key: str,
    ):
        self.config = self.Config(
            bucket_name=bucket_name,
            region_name=region_name,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=pydantic.SecretStr(aws_secret_access_key),
        )
        self._client: botocore.client.BaseClient = boto3.client(
            "s3",
            region_name=self.config.region_name,
            aws_access_key_id=self.config.aws_access_key_id,
            aws_secret_access_key=self.config.aws_secret_access_key.get_secret_value(),
        )

    @staticmethod
    def _derive_s3_key(
            sha256: SHA256,
            mime_type: MediaType,
    ) -> str:
        ext = mimetypes.guess_extension(mime_type)
        if ext is None:
            raise ValueError(
                f"Could not determine file extension for mime type {mime_type}"
            )
        return f"assets/{mime_type}/{sha256}{ext}"

    def _assemble_s3_url(self, key: str) -> pydantic.HttpUrl:
        url = f"https://{self.config.bucket_name}.s3.{self.config.region_name}.amazonaws.com/{key}"
        return pydantic.HttpUrl(url)

    def maybe_resolve_asset(
            self,
            sha256: SHA256,
            mime_type: MediaType,
    ) -> UploadAssetResult | None:
        # Derive S3 key
        key = self._derive_s3_key(sha256=sha256, mime_type=mime_type)

        # Check if it exists
        try:
            self._client.head_object(Bucket=self.config.bucket_name, Key=key)
        except botocore.exceptions.ClientError as e:
            if e.response["Error"]["Code"] == "404":
                return None
            else:
                raise RuntimeError(
                    f"S3 head_object failed: {e.response.get('Error', {}).get('Message', str(e))}"
                ) from e

        # Return resolved asset ref
        return UploadAssetResult(
            mime_type=mime_type,
            sha256=sha256,
            asset_url=self._assemble_s3_url(key),
        )

    def upload_asset(
            self,
            claimed_sha256: SHA256,
            file: BinaryIO,
            mime_type: MediaType,
    ) -> UploadAssetResult:
        """
        Stream `file` directly to S3 with the given MIME type, and returns it public link.
        """
        # ---- derive a safe S3 key
        ext = mimetypes.guess_extension(mime_type)
        if ext is None:
            raise ValueError(
                f"Could not determine file extension for mime type {mime_type}"
            )

        # First I/O pass: compute SHA256
        try:
            file.seek(0)
        except Exception:
            pass

        sha256 = hashlib.sha256()
        try:
            file.seek(0)
        except Exception:
            pass
        while True:
            chunk = file.read(8192)  # 8 MB
            if not chunk:
                break
            sha256.update(chunk)
        sha256 = sha256.hexdigest()

        if not claimed_sha256 == sha256:
            raise ValueError(
                f"SHA256 mismatch: claimed {claimed_sha256}, computed {sha256}"
            )

        # Return immediately if already uploaded:
        key = self._derive_s3_key(sha256=sha256, mime_type=mime_type)
        asset_url = self._assemble_s3_url(key)

        # Second I/O pass: upload to S3
        file.seek(0)

        try:
            self._client.upload_fileobj(
                Fileobj=file,
                Bucket=self.config.bucket_name,
                Key=key,
                ExtraArgs={
                    "ContentType": str(mime_type),
                    "ACL": "public-read",
                },
            )
        except botocore.exceptions.ClientError as e:
            raise RuntimeError(
                f"S3 upload failed: {e.response.get('Error', {}).get('Message', str(e))}"
            ) from e

        # Package return model
        return UploadAssetResult(
            sha256=sha256,
            asset_url = asset_url,
            mime_type=mime_type,
        )

    def sync_file(
            self,
            local_path: os.PathLike | str,
            local_root: os.PathLike | str,
            bucket_root: os.PathLike | str,
            force: bool = False,
    ) -> str:
        """
        Upload a single file to S3 under the key derived from its path relative to `local_root`,
        prefixed by `bucket_root`. Skips upload if an object already exists with the same size,
        unless `force=True`. Makes the object public-read and sets ContentType.

        Returns the public URL of the object.
        """
        p = Path(local_path)
        local_root = Path(local_root)
        if not p.is_file() or p.is_symlink():
            raise ValueError(f"Unsupported file type: {p}")

        # Derive S3 key (prefix + rel path), then URL-encode it (keep '/' separators)
        rel = p.relative_to(local_root).as_posix()
        prefix = str(bucket_root).strip("/")
        key = f"{prefix}/{rel}" if prefix else rel
        encoded_key = quote(key, safe="/")

        # Compute URL (prefer virtual-hosted-style for AWS, path-style for custom endpoints)
        endpoint = self._client.meta.endpoint_url.rstrip("/")
        if "amazonaws.com" in endpoint:
            url = f"https://{self.config.bucket_name}.s3.{self.config.region_name}.amazonaws.com/{encoded_key}"
        else:
            # e.g., MinIO or custom S3-compatible endpoint
            url = f"{endpoint}/{self.config.bucket_name}/{encoded_key}"

        # Skip if already present with same size (unless force)
        try:
            head = self._client.head_object(Bucket=self.config.bucket_name, Key=key)
            if head.get("ContentLength") == p.stat().st_size and not force:
                return url
        except self._client.exceptions.ClientError as e:
            if e.response.get("Error", {}).get("Code") != "404":
                raise  # unexpected error → bubble up

        # Upload
        mime, _ = mimetypes.guess_type(p.name)
        extra = {"ContentType": mime or "application/octet-stream", "ACL": "public-read"}
        with p.open("rb") as f:
            self._client.upload_fileobj(
                Fileobj=f,
                Bucket=self.config.bucket_name,
                Key=key,
                ExtraArgs=extra,
            )

        return url