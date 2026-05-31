import hashlib
import importlib
import os
import sys
import gzip
import datetime
from collections.abc import Iterator
from pathlib import Path
from types import ModuleType
from typing import Any
from uuid import UUID

import pytest
import sqlmodel
from fastapi.testclient import TestClient
from sqlmodel import SQLModel

import nodekit as nk
from nodekit._internal.types.assets import FileSystemPath, URL
from nodekit._internal.utils.iter_assets import iter_assets


SERVER_ROOT = Path(__file__).parents[1] / "nodekit-server"
ASSET_DIR = Path(__file__).parent / "assets"


# %%
def _assert_utc_timestamp(value: str) -> None:
    parsed = datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
    assert parsed.utcoffset() == datetime.timedelta(0)


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
    upload_body = upload_response.json()
    assert upload_body["asset"]["sha256"] == asset.sha256
    assert upload_body["asset"]["media_type"] == asset.media_type
    assert upload_body["asset"]["size_bytes"] == asset_path.stat().st_size
    assert upload_body["asset"]["url"] is None
    _assert_utc_timestamp(upload_body["asset"]["timestamp_created"])

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
    assert second_upload_response.json() == upload_body


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


# %%
def test_create_site_rejects_missing_assets(authenticated_client: TestClient) -> None:
    missing_asset = nk.assets.Image(
        sha256="0" * 64,
        media_type="image/png",
        locator=FileSystemPath(path=ASSET_DIR / "fixation-cross.svg"),
    )
    graph = nk.Graph(
        nodes={
            "start": nk.Node(
                card=nk.cards.ImageCard(image=missing_asset),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            )
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )

    response = authenticated_client.post(
        "/sites",
        json={"graph": graph.model_dump(mode="json"), "tags": []},
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": {
            "missing": [
                {
                    "sha256": "0" * 64,
                    "media_type": "image/png",
                }
            ]
        }
    }


# %%
def test_create_site_persists_normalized_graph(
    authenticated_client: TestClient,
    graph_with_assets: nk.Graph,
    server_main: ModuleType,
) -> None:
    for asset in iter_assets(graph=graph_with_assets):
        assert isinstance(asset.locator, FileSystemPath)
        asset_path = asset.locator.path
        authenticated_client.post(
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
        ).raise_for_status()

    response = authenticated_client.post(
        "/sites",
        json={
            "graph": graph_with_assets.model_dump(mode="json"),
            "tags": ["pilot", "pilot", "main"],
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["url"] == f"http://testserver/s/{body['site_id']}"
    assert body["tags"] == ["pilot", "main"]
    _assert_utc_timestamp(body["timestamp_created"])
    assert len(body["assets"]) == 3
    for asset in body["assets"]:
        _assert_utc_timestamp(asset["timestamp_created"])

    response_graph = nk.Graph.model_validate(body["graph"])
    for asset in iter_assets(graph=response_graph):
        assert isinstance(asset.locator, URL)
        assert asset.locator.url == f"/assets/{asset.sha256}"

    for asset in iter_assets(graph=graph_with_assets):
        assert isinstance(asset.locator, FileSystemPath)

    engine = sys.modules["nodekit_server.deps"].engine
    records: Any = sys.modules["nodekit_server.records"]

    with sqlmodel.Session(engine) as session:
        site_id = UUID(body["site_id"])
        site_record = session.get(records.SiteRecord, site_id)
        assert site_record is not None
        stored_graph_json = gzip.decompress(site_record.graph_json_gzip).decode("utf-8")
        stored_graph = nk.Graph.model_validate_json(stored_graph_json)
        assert all(isinstance(asset.locator, URL) for asset in iter_assets(stored_graph))

        dependency_statement = sqlmodel.select(records.SiteAssetDependencyRecord).where(
            records.SiteAssetDependencyRecord.site_id == site_id
        )
        tag_statement = sqlmodel.select(records.SiteTagRecord).where(
            records.SiteTagRecord.site_id == site_id
        )
        assert len(session.exec(dependency_statement).all()) == 3
        assert len(session.exec(tag_statement).all()) == 2
