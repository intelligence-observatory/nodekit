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

    class UploadDirectoryResult(pydantic.BaseModel):
        directory_root_url: pydantic.AnyHttpUrl
        # Full URLs are formed by joining with the directory_root_url

    def upload_directory(
            self,
            path: os.PathLike | str,
            bucket_directory_name: str = '',
            force: bool = False,
    ) -> UploadDirectoryResult:
        """
        Uploads the given directory to the S3 bucket at the given bucket directory name.
        All files will be public. Skips upload if an existing object has the same size.
        """
        path = Path(path)
        if not path.is_dir():
            raise ValueError(f"Not a directory: {path}")

        prefix = bucket_directory_name.strip("/")
        base_url = self._client.meta.endpoint_url.rstrip("/")
        directory_root = f"{base_url}/{self.config.bucket_name}" + (f"/{prefix}" if prefix else "")

        for p in path.rglob("*"):
            if p.is_dir():
                continue
            if p.is_symlink() or not p.is_file():
                raise ValueError(f"Unsupported file type: {p}")

            rel = p.relative_to(path).as_posix()
            key = f"{prefix}/{rel}" if prefix else rel

            # --- skip if already exists with same size
            try:
                head = self._client.head_object(Bucket=self.config.bucket_name, Key=key)
                if head.get("ContentLength") == p.stat().st_size and not force:
                    print(f'Skipping {key}')
                    continue  # already there, same size
            except self._client.exceptions.ClientError as e:
                if e.response["Error"]["Code"] != "404":
                    raise  # re-raise unexpected errors

            # --- upload
            mime, _ = mimetypes.guess_type(p.name)
            extra = {"ContentType": mime or "application/octet-stream", "ACL": "public-read"}

            print(f'Uploaded {key}')
            with p.open("rb") as f:
                self._client.upload_fileobj(
                    Fileobj=f,
                    Bucket=self.config.bucket_name,
                    Key=key,
                    ExtraArgs=extra,
                )

        return self.UploadDirectoryResult(directory_root_url=pydantic.AnyHttpUrl(directory_root))