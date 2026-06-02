import json
import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

import httpx

import nodekit as nk
from nodekit._internal.types.assets import LocatorTypeEnum, URL
from nodekit._internal.utils.iter_assets import iter_assets
import nodekit.server as nk_server
import nodekit.server.contracts as contracts


ASSET_DIR = Path(__file__).parents[1] / "assets"
TIMESTAMP_CREATED = datetime.datetime(2026, 5, 31, tzinfo=datetime.UTC).isoformat()


# %%
def _make_graph_without_assets() -> nk.Graph:
    return nk.Graph(
        nodes={
            "start": nk.Node(
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )


def _make_graph_with_duplicate_asset(asset: nk.assets.Image) -> nk.Graph:
    return nk.Graph(
        nodes={
            "start": nk.Node(
                card=nk.cards.CompositeCard(
                    children={
                        "first": nk.cards.ImageCard(
                            image=asset,
                            region=nk.Region(x=-100, y=0, w=100, h=100),
                        ),
                        "second": nk.cards.ImageCard(
                            image=asset,
                            region=nk.Region(x=100, y=0, w=100, h=100),
                        ),
                    }
                ),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )


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
                    "timestamp_created": TIMESTAMP_CREATED,
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


# %%
def test_create_site_preflights_and_uploads_missing_assets(graph_with_assets: nk.Graph) -> None:
    site_id = uuid4()
    user_id = uuid4()
    captured: dict[str, Any] = {"paths": [], "uploads": []}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["paths"].append(request.url.path)
        if request.url.path == "/assets/check":
            body = json.loads(request.content)
            captured["check_body"] = body
            missing = body["assets"][:1]
            captured["missing"] = missing
            return httpx.Response(200, json={"missing": missing})

        if request.url.path == "/assets":
            captured["uploads"].append(request.content)
            missing = captured["missing"][0]
            return httpx.Response(
                200,
                json={
                    "asset": {
                        "sha256": missing["sha256"],
                        "media_type": missing["media_type"],
                        "size_bytes": len(request.content),
                        "url": f"https://nodekit.example/assets/{missing['sha256']}",
                        "timestamp_created": TIMESTAMP_CREATED,
                    }
                },
            )

        if request.url.path == "/sites":
            body = json.loads(request.content)
            captured["site_body"] = body
            return httpx.Response(
                200,
                json={
                    "site_id": str(site_id),
                    "user_id": str(user_id),
                    "url": f"https://nodekit.example/s/{site_id}",
                    "tags": body["tags"],
                    "is_archived": False,
                    "timestamp_created": TIMESTAMP_CREATED,
                    "graph": body["graph"],
                    "assets": [],
                },
            )

        raise AssertionError(request.url)

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )

    response = client.create_site(graph=graph_with_assets, tags=("pilot",))

    assert captured["paths"] == ["/assets/check", "/assets", "/sites"]
    assert len(captured["check_body"]["assets"]) == 3
    assert len(captured["uploads"]) == 1
    assert captured["site_body"]["tags"] == ["pilot"]
    posted_graph = nk.Graph.model_validate(captured["site_body"]["graph"])
    assert {
        str(asset.locator.url)
        for asset in iter_assets(posted_graph)
        if isinstance(asset.locator, URL)
    } == {
        f"https://nodekit.example/assets/{asset.sha256}" for asset in iter_assets(graph_with_assets)
    }
    assert {asset.locator.locator_type for asset in iter_assets(graph_with_assets)} == {
        LocatorTypeEnum.FileSystemPath
    }
    assert response.site_id == site_id


# %%
def test_create_site_without_assets_posts_site_directly() -> None:
    site_id = uuid4()
    user_id = uuid4()
    graph = _make_graph_without_assets()
    captured: dict[str, Any] = {"paths": []}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["paths"].append(request.url.path)
        if request.url.path == "/sites":
            body = json.loads(request.content)
            return httpx.Response(
                200,
                json={
                    "site_id": str(site_id),
                    "user_id": str(user_id),
                    "url": f"https://nodekit.example/s/{site_id}",
                    "tags": body["tags"],
                    "is_archived": False,
                    "timestamp_created": TIMESTAMP_CREATED,
                    "graph": body["graph"],
                    "assets": [],
                },
            )

        raise AssertionError(request.url)

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )

    response = client.create_site(graph=graph, tags=("no-assets",))

    assert captured["paths"] == ["/sites"]
    assert response.site_id == site_id


# %%
def test_iter_runs_sends_recruitment_filters() -> None:
    captured: dict[str, Any] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["path"] = request.url.path
        captured["params"] = list(request.url.params.multi_items())
        return httpx.Response(200, json={"items": [], "next_page_cursor": None})

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )

    assert (
        list(
            client.iter_runs(
                recruitment_platforms=["Prolific", "MechanicalTurk"],
                recruiter_study_ids=["study-1", "hit-1"],
                recruiter_participant_ids=["pid-1", "worker-1"],
                recruiter_session_ids=["session-1", "assignment-1"],
                max_items=25,
            )
        )
        == []
    )

    assert captured["path"] == "/runs"
    assert captured["params"] == [
        ("recruitment_platforms", "Prolific"),
        ("recruitment_platforms", "MechanicalTurk"),
        ("recruiter_study_ids", "study-1"),
        ("recruiter_study_ids", "hit-1"),
        ("recruiter_participant_ids", "pid-1"),
        ("recruiter_participant_ids", "worker-1"),
        ("recruiter_session_ids", "session-1"),
        ("recruiter_session_ids", "assignment-1"),
        ("include_archived", "False"),
        ("max_items", "25"),
    ]


# %%
def test_create_site_skips_upload_when_assets_are_present(
    graph_with_assets: nk.Graph,
) -> None:
    site_id = uuid4()
    user_id = uuid4()
    captured: dict[str, Any] = {"paths": []}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["paths"].append(request.url.path)
        if request.url.path == "/assets/check":
            return httpx.Response(200, json={"missing": []})

        if request.url.path == "/sites":
            body = json.loads(request.content)
            return httpx.Response(
                200,
                json={
                    "site_id": str(site_id),
                    "user_id": str(user_id),
                    "url": f"https://nodekit.example/s/{site_id}",
                    "tags": body["tags"],
                    "is_archived": False,
                    "timestamp_created": TIMESTAMP_CREATED,
                    "graph": body["graph"],
                    "assets": [],
                },
            )

        raise AssertionError(request.url)

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )

    response = client.create_site(graph=graph_with_assets)

    assert captured["paths"] == ["/assets/check", "/sites"]
    assert response.site_id == site_id


# %%
def test_create_site_deduplicates_duplicate_asset_uploads() -> None:
    site_id = uuid4()
    user_id = uuid4()
    asset = nk.assets.Image.from_path(ASSET_DIR / "fixation-cross.svg")
    graph = _make_graph_with_duplicate_asset(asset)
    captured: dict[str, Any] = {"paths": [], "uploads": []}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["paths"].append(request.url.path)
        if request.url.path == "/assets/check":
            body = json.loads(request.content)
            captured["check_body"] = body
            return httpx.Response(200, json={"missing": body["assets"]})

        if request.url.path == "/assets":
            captured["uploads"].append(request.content)
            return httpx.Response(
                200,
                json={
                    "asset": {
                        "sha256": asset.sha256,
                        "media_type": asset.media_type,
                        "size_bytes": len(request.content),
                        "url": f"https://nodekit.example/assets/{asset.sha256}",
                        "timestamp_created": TIMESTAMP_CREATED,
                    }
                },
            )

        if request.url.path == "/sites":
            body = json.loads(request.content)
            return httpx.Response(
                200,
                json={
                    "site_id": str(site_id),
                    "user_id": str(user_id),
                    "url": f"https://nodekit.example/s/{site_id}",
                    "tags": body["tags"],
                    "is_archived": False,
                    "timestamp_created": TIMESTAMP_CREATED,
                    "graph": body["graph"],
                    "assets": [],
                },
            )

        raise AssertionError(request.url)

    client = nk_server.Client(
        api_url="https://nodekit.example",
        api_token="secret",
        transport=httpx.MockTransport(handler),
    )

    response = client.create_site(graph=graph)

    assert captured["paths"] == ["/assets/check", "/assets", "/sites"]
    assert len(captured["check_body"]["assets"]) == 1
    assert len(captured["uploads"]) == 1
    assert response.site_id == site_id
