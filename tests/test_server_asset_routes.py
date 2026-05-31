import hashlib
import importlib
import os
import sys
from collections.abc import Iterator
from pathlib import Path
from types import ModuleType

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel

import nodekit as nk


SERVER_ROOT = Path(__file__).parents[1] / "nodekit-server"
ASSET_DIR = Path(__file__).parent / "assets"


# %%
@pytest.fixture(scope="module")
def server_main(tmp_path_factory: pytest.TempPathFactory) -> Iterator[ModuleType]:
    tmp_path = tmp_path_factory.mktemp("nodekit-server")
    env_keys = [
        "NODEKIT_SERVER_DATABASE_URL",
        "NODEKIT_SERVER_ASSET_STORE_DIR",
        "NODEKIT_SERVER_BOOTSTRAP_ADMIN_API_TOKEN",
    ]
    previous_env = {key: os.environ.get(key) for key in env_keys}
    os.environ["NODEKIT_SERVER_DATABASE_URL"] = f"sqlite:///{tmp_path / 'server.db'}"
    os.environ["NODEKIT_SERVER_ASSET_STORE_DIR"] = str(tmp_path / "asset-store")
    os.environ["NODEKIT_SERVER_BOOTSTRAP_ADMIN_API_TOKEN"] = "test-token"
    sys.path.insert(0, str(SERVER_ROOT))

    for module_name in list(sys.modules):
        if module_name == "nodekit_server" or module_name.startswith("nodekit_server."):
            del sys.modules[module_name]
    SQLModel.metadata.clear()

    module = importlib.import_module("nodekit_server.main")
    yield module

    for module_name in list(sys.modules):
        if module_name == "nodekit_server" or module_name.startswith("nodekit_server."):
            del sys.modules[module_name]
    SQLModel.metadata.clear()
    try:
        sys.path.remove(str(SERVER_ROOT))
    except ValueError:
        pass
    for key, value in previous_env.items():
        if value is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = value


@pytest.fixture
def authenticated_client(server_main: ModuleType) -> Iterator[TestClient]:
    with TestClient(server_main.app) as client:
        client.headers.update({"Authorization": "Bearer test-token"})
        yield client


# %%
def test_check_assets_reports_missing_assets(authenticated_client: TestClient) -> None:
    missing_asset = {
        "sha256": "0" * 64,
        "media_type": "image/png",
    }

    response = authenticated_client.post(
        "/assets/check",
        json={"assets": [missing_asset, missing_asset]},
    )

    assert response.status_code == 200
    assert response.json() == {"missing": [missing_asset]}


# %%
def test_upload_asset_persists_and_check_assets_finds_it(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    asset_path = ASSET_DIR / "fixation-cross.svg"
    asset = nk.assets.Image.from_path(asset_path)

    upload_response = authenticated_client.post(
        "/assets",
        data={
            "sha256": asset.sha256,
            "media_type": asset.media_type,
        },
        files={
            "file": (
                asset_path.name,
                asset_path.read_bytes(),
                asset.media_type,
            )
        },
    )

    assert upload_response.status_code == 200
    assert upload_response.json() == {
        "asset": {
            "sha256": asset.sha256,
            "media_type": asset.media_type,
            "size_bytes": asset_path.stat().st_size,
            "url": None,
        }
    }

    asset_store_dir = server_main.settings.asset_store_dir
    stored_files = [path for path in asset_store_dir.glob("assets/**/*") if path.is_file()]
    assert len(stored_files) == 1
    assert stored_files[0].read_bytes() == asset_path.read_bytes()

    check_response = authenticated_client.post(
        "/assets/check",
        json={"assets": [{"sha256": asset.sha256, "media_type": asset.media_type}]},
    )

    assert check_response.status_code == 200
    assert check_response.json() == {"missing": []}

    second_upload_response = authenticated_client.post(
        "/assets",
        data={
            "sha256": asset.sha256,
            "media_type": asset.media_type,
        },
        files={
            "file": (
                asset_path.name,
                asset_path.read_bytes(),
                asset.media_type,
            )
        },
    )

    assert second_upload_response.status_code == 200
    assert second_upload_response.json() == upload_response.json()


# %%
def test_upload_asset_rejects_hash_mismatch(authenticated_client: TestClient) -> None:
    body = b"not the claimed asset"
    claimed_sha256 = hashlib.sha256(b"different bytes").hexdigest()

    response = authenticated_client.post(
        "/assets",
        data={
            "sha256": claimed_sha256,
            "media_type": "image/png",
        },
        files={"file": ("asset.png", body, "image/png")},
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "Uploaded Asset bytes do not match claimed SHA-256."}


# %%
def test_asset_routes_require_auth(server_main: ModuleType) -> None:
    with TestClient(server_main.app) as client:
        response = client.post(
            "/assets/check",
            json={"assets": [{"sha256": "0" * 64, "media_type": "image/png"}]},
        )

    assert response.status_code == 401
