from pathlib import Path
import sys
from types import ModuleType
from typing import Any, cast

import botocore.exceptions


# %%
class FakeS3Client:
    def __init__(self, existing_keys: set[str] | None = None):
        self.existing_keys = existing_keys or set()
        self.uploads: list[dict[str, Any]] = []

    def head_object(self, Bucket: str, Key: str) -> dict[str, Any]:
        if Key not in self.existing_keys:
            raise botocore.exceptions.ClientError(
                error_response=cast(
                    Any,
                    {
                        "Error": {"Code": "404"},
                        "ResponseMetadata": {"HTTPStatusCode": 404},
                    },
                ),
                operation_name="HeadObject",
            )
        return {}

    def upload_file(
        self,
        Filename: str,
        Bucket: str,
        Key: str,
        ExtraArgs: dict[str, str],
    ) -> None:
        self.uploads.append(
            {
                "filename": Filename,
                "bucket": Bucket,
                "key": Key,
                "extra_args": ExtraArgs,
                "content": Path(Filename).read_bytes(),
            }
        )
        self.existing_keys.add(Key)


# %%
def test_s3_asset_store_uses_public_base_url(server_main: ModuleType) -> None:
    _ = server_main
    storage = sys.modules["nodekit_server.storage"]
    fake_client = FakeS3Client()
    store = storage.S3AssetStore(
        bucket_name="nodekit-assets",
        public_base_url="https://cdn.example.com/nodekit/",
        region_name="us-east-1",
        prefix="/assets/",
        client=fake_client,
    )
    sha256 = "0" * 64

    storage_key = store.storage_key_for_sha256(sha256)
    resolution = store.resolve(storage_key)

    assert storage_key == f"assets/{sha256}"
    assert resolution.redirect_url == f"https://cdn.example.com/nodekit/assets/{sha256}"


def test_s3_asset_store_checks_existence(server_main: ModuleType) -> None:
    _ = server_main
    storage = sys.modules["nodekit_server.storage"]
    store = storage.S3AssetStore(
        bucket_name="nodekit-assets",
        public_base_url="https://cdn.example.com",
        region_name="us-east-1",
        client=FakeS3Client(existing_keys={"assets/present"}),
    )

    assert store.exists("assets/present") is True
    assert store.exists("assets/missing") is False


def test_s3_asset_store_uploads_and_deletes_staged_file(
    tmp_path: Path,
    server_main: ModuleType,
) -> None:
    _ = server_main
    storage = sys.modules["nodekit_server.storage"]
    fake_client = FakeS3Client()
    store = storage.S3AssetStore(
        bucket_name="nodekit-assets",
        public_base_url="https://cdn.example.com",
        region_name="us-east-1",
        client=fake_client,
    )
    source_path = tmp_path / "asset"
    source_path.write_bytes(b"asset-bytes")

    store.put_file(
        storage_key="assets/abc",
        source_path=source_path,
        media_type="image/png",
    )

    assert not source_path.exists()
    assert fake_client.uploads == [
        {
            "filename": str(source_path),
            "bucket": "nodekit-assets",
            "key": "assets/abc",
            "extra_args": {"ContentType": "image/png"},
            "content": b"asset-bytes",
        }
    ]
