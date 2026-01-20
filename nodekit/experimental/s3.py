import mimetypes
import os
from pathlib import Path
from urllib.parse import quote

import boto3
import botocore.client
import botocore.exceptions
import pydantic
from nodekit._internal.types.values import MediaType, SHA256


# %%
class UploadAssetResult(pydantic.BaseModel):
    sha256: SHA256
    mime_type: MediaType
    asset_url: pydantic.HttpUrl


class S3Client:
    class Config(pydantic.BaseModel):
        """
        Used to validate and store S3 client configuration.
        """

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

    def sync_directory(
        self,
        local_root: os.PathLike | str,
        bucket_root: os.PathLike | str,
        manifest: list[os.PathLike | str],
        verbose: bool = True,
    ) -> dict[str, str]:
        """
        Synchronize a manifest of files to a directory in the S3 bucket.

        Args:
            local_root: The path to the local directory that contains the manifest entries.
            bucket_root: The path to the directory in the S3 bucket. For example, if 'foo/' is given, the contents
                referenced in the manifest will be uploaded under the `foo/` prefix in the bucket.
            manifest: A list of file paths relative to `local_root` to upload.
            verbose: If True, print progress messages.
        Returns:
            A dictionary mapping local file paths (relative to local_root) to their corresponding S3 URLs.

        """
        local_root = Path(local_root)
        if not local_root.is_dir():
            raise ValueError(f"Local root does not exist or is not a directory: {local_root}")

        bucket_prefix = str(bucket_root).strip("/")
        endpoint = self._client.meta.endpoint_url.rstrip("/")
        is_aws = "amazonaws.com" in endpoint

        def key_to_url(key: str) -> str:
            encoded_key = quote(key, safe="/")
            if is_aws:
                return f"https://{self.config.bucket_name}.s3.{self.config.region_name}.amazonaws.com/{encoded_key}"
            return f"{endpoint}/{self.config.bucket_name}/{encoded_key}"

        files: list[tuple[Path, str, int, str, str]] = []
        for rel_path in manifest:
            rel = Path(rel_path)
            if rel.is_absolute():
                raise ValueError(f"Manifest path must be relative: {rel}")
            if ".." in rel.parts:
                raise ValueError(f"Manifest path must not contain '..': {rel}")
            abs_path = local_root / rel
            if not abs_path.is_file() or abs_path.is_symlink():
                raise ValueError(f"Manifest path is not a regular file: {abs_path}")
            rel_str = rel.as_posix()
            key = f"{bucket_prefix}/{rel_str}" if bucket_prefix else rel_str
            size = abs_path.stat().st_size
            prefix = f"{key.rsplit('/', 1)[0]}/" if "/" in key else ""
            files.append((abs_path, key, size, prefix, rel_str))

        prefixes = {p for _, _, _, p, _ in files if p}
        remote_sizes: dict[str, int] = {}
        paginator = self._client.get_paginator("list_objects_v2")
        for prefix in prefixes:
            for page in paginator.paginate(
                Bucket=self.config.bucket_name,
                Prefix=prefix,
            ):
                for obj in page.get("Contents", []):
                    remote_sizes[obj["Key"]] = obj["Size"]

        uploaded: dict[str, str] = {}
        for path, key, size, _, rel_str in files:
            url = key_to_url(key)
            if remote_sizes.get(key) == size:
                uploaded[rel_str] = url
                continue

            mime, _ = mimetypes.guess_type(path.name)
            extra = {
                "ContentType": mime or "application/octet-stream",
                "ACL": "public-read",
            }
            with path.open("rb") as f:
                self._client.upload_fileobj(
                    Fileobj=f,
                    Bucket=self.config.bucket_name,
                    Key=key,
                    ExtraArgs=extra,
                )
            if verbose:
                print(f"Uploaded {path.name} to S3")
            uploaded[rel_str] = url

        return uploaded

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
        extra = {
            "ContentType": mime or "application/octet-stream",
            "ACL": "public-read",
        }
        with p.open("rb") as f:
            self._client.upload_fileobj(
                Fileobj=f,
                Bucket=self.config.bucket_name,
                Key=key,
                ExtraArgs=extra,
            )

        print(f"Uploaded {p.name} to S3")

        return url
