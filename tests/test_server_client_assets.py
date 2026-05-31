import json
from pathlib import Path
from typing import Any

import httpx

import nodekit as nk
import nodekit.server as nk_server
import nodekit.server.contracts as contracts


ASSET_DIR = Path(__file__).parent / "assets"


# %%
def test_asset_contracts_validate() -> None:
    identifier = contracts.AssetIdentifier(
        sha256="0" * 64,
        media_type="image/png",
    )
    response = contracts.CheckAssetsResponse(missing=(identifier,))

    assert response.missing == (identifier,)


# %%
def test_check_assets_deduplicates_identifiers() -> None:
    first = contracts.AssetIdentifier(
        sha256="0" * 64,
        media_type="image/png",
    )
    second = contracts.AssetIdentifier(
        sha256="1" * 64,
        media_type="image/svg+xml",
    )
    captured: dict[str, Any] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["path"] = request.url.path
        captured["authorization"] = request.headers["authorization"]
        captured["body"] = json.loads(request.content)
        return httpx.Response(200, json={"missing": [second.model_dump(mode="json")]})

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )

    response = client.check_assets([first, first, second])

    assert captured["path"] == "/assets/check"
    assert captured["authorization"] == "Bearer secret"
    assert captured["body"] == {
        "assets": [
            first.model_dump(mode="json"),
            second.model_dump(mode="json"),
        ]
    }
    assert response.missing == (second,)


# %%
def test_upload_asset_sends_multipart_asset_bytes() -> None:
    asset_path = ASSET_DIR / "fixation-cross.svg"
    asset = nk.assets.Image.from_path(asset_path)
    captured: dict[str, Any] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["path"] = request.url.path
        captured["authorization"] = request.headers["authorization"]
        captured["content_type"] = request.headers["content-type"]
        captured["body"] = request.content
        return httpx.Response(
            200,
            json={
                "asset": {
                    "sha256": asset.sha256,
                    "media_type": asset.media_type,
                    "size_bytes": asset_path.stat().st_size,
                    "url": f"https://nodekit.example/assets/{asset.sha256}",
                }
            },
        )

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )

    response = client.upload_asset(asset)

    assert captured["path"] == "/assets"
    assert captured["authorization"] == "Bearer secret"
    assert str(captured["content_type"]).startswith("multipart/form-data; boundary=")
    assert asset.sha256.encode("utf-8") in captured["body"]
    assert asset.media_type.encode("utf-8") in captured["body"]
    assert asset_path.read_bytes() in captured["body"]
    assert response.asset.sha256 == asset.sha256
    assert response.asset.media_type == asset.media_type
