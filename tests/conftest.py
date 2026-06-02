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

ASSET_DIR = Path(__file__).parent / "assets"


@pytest.fixture(scope="session")
def server_main(tmp_path_factory: pytest.TempPathFactory) -> Iterator[ModuleType]:
    tmp_path = tmp_path_factory.mktemp("nodekit-server")
    env_keys = [
        "NODEKIT_SERVER_DATABASE_URL",
        "NODEKIT_SERVER_ASSET_STORE_DIR",
        "NODEKIT_SERVER_SITE_HOSTING_BACKEND",
        "NODEKIT_SERVER_SITE_STORE_DIR",
        "NODEKIT_SERVER_BOOTSTRAP_ADMIN_API_TOKEN",
    ]
    previous_env = {key: os.environ.get(key) for key in env_keys}
    os.environ["NODEKIT_SERVER_DATABASE_URL"] = f"sqlite:///{tmp_path / 'server.db'}"
    os.environ["NODEKIT_SERVER_ASSET_STORE_DIR"] = str(tmp_path / "asset-store")
    os.environ["NODEKIT_SERVER_SITE_HOSTING_BACKEND"] = "filesystem"
    os.environ["NODEKIT_SERVER_SITE_STORE_DIR"] = str(tmp_path / "site-store")
    os.environ["NODEKIT_SERVER_BOOTSTRAP_ADMIN_API_TOKEN"] = "test-token"

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


def _make_graph_with_assets() -> nk.Graph:
    png_asset = nk.assets.Image.from_path(
        ASSET_DIR / "629cd38bb1526395e0a01e0eb6985b973ea1077b170911f221b1b84c9d3446d8.png"
    )
    svg_asset = nk.assets.Image.from_path(ASSET_DIR / "fixation-cross.svg")
    video_asset = nk.assets.Video.from_path(ASSET_DIR / "test-video.mp4")

    stimulus = nk.cards.CompositeCard(
        children={
            "png-card": nk.cards.ImageCard(
                image=png_asset,
                region=nk.Region(x=-200, y=100, w=200, h=200),
            ),
            "svg-card": nk.cards.ImageCard(
                image=svg_asset,
                region=nk.Region(x=200, y=100, w=150, h=150),
            ),
            "video-card": nk.cards.VideoCard(
                video=video_asset,
                region=nk.Region(x=0, y=-200, w=250, h=180),
            ),
        }
    )

    return nk.Graph(
        nodes={
            "start": nk.Node(
                card=stimulus,
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )


@pytest.fixture
def graph_with_assets() -> nk.Graph:
    return _make_graph_with_assets()
