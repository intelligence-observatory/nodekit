import hashlib
import gzip
import datetime
from pathlib import Path
import sys
from types import ModuleType
from typing import Any
from uuid import UUID

import sqlmodel
from fastapi.testclient import TestClient

import nodekit as nk
from nodekit._internal.types.assets import FileSystemPath, URL
from nodekit._internal.utils.iter_assets import iter_assets


ASSET_DIR = Path(__file__).parent / "assets"


# %%
def _assert_utc_timestamp(value: str) -> None:
    parsed = datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
    assert parsed.utcoffset() == datetime.timedelta(0)


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
    stored_file = asset_store_dir / "assets" / asset.sha256[:2] / asset.sha256
    assert stored_file.is_file()
    assert stored_file.read_bytes() == asset_path.read_bytes()

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


# %%
def _upload_graph_assets(
    authenticated_client: TestClient,
    graph: nk.Graph,
) -> None:
    for asset in iter_assets(graph=graph):
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


def _create_site(
    authenticated_client: TestClient,
    graph: nk.Graph,
    tags: list[str],
) -> dict[str, Any]:
    response = authenticated_client.post(
        "/sites",
        json={
            "graph": graph.model_dump(mode="json"),
            "tags": tags,
        },
    )
    response.raise_for_status()
    return response.json()


# %%
def test_site_management_routes(
    authenticated_client: TestClient,
    graph_with_assets: nk.Graph,
) -> None:
    _upload_graph_assets(authenticated_client, graph_with_assets)
    first_site = _create_site(
        authenticated_client=authenticated_client,
        graph=graph_with_assets,
        tags=["shared", "route-a"],
    )
    second_site = _create_site(
        authenticated_client=authenticated_client,
        graph=graph_with_assets,
        tags=["shared", "route-b"],
    )

    get_response = authenticated_client.get(f"/sites/{first_site['site_id']}")
    assert get_response.status_code == 200
    get_body = get_response.json()
    assert get_body["site_id"] == first_site["site_id"]
    assert get_body["tags"] == ["shared", "route-a"]
    assert len(get_body["assets"]) == 3
    assert nk.Graph.model_validate(get_body["graph"])

    filtered_response = authenticated_client.get(
        "/sites",
        params=[("tags", "route-a")],
    )
    assert filtered_response.status_code == 200
    filtered_body = filtered_response.json()
    assert [item["site_id"] for item in filtered_body["items"]] == [first_site["site_id"]]
    assert filtered_body["next_page_cursor"] is None

    first_page_response = authenticated_client.get(
        "/sites",
        params=[("tags", "shared"), ("max_items", "1")],
    )
    assert first_page_response.status_code == 200
    first_page = first_page_response.json()
    assert len(first_page["items"]) == 1
    assert first_page["items"][0]["site_id"] in {
        first_site["site_id"],
        second_site["site_id"],
    }
    assert first_page["next_page_cursor"] is not None

    second_page_response = authenticated_client.get(
        "/sites",
        params=[
            ("tags", "shared"),
            ("max_items", "1"),
            ("page_cursor", first_page["next_page_cursor"]),
        ],
    )
    assert second_page_response.status_code == 200
    second_page = second_page_response.json()
    assert len(second_page["items"]) == 1
    paged_site_ids = {
        first_page["items"][0]["site_id"],
        second_page["items"][0]["site_id"],
    }
    assert paged_site_ids == {first_site["site_id"], second_site["site_id"]}
    assert second_page["next_page_cursor"] is None

    add_tags_response = authenticated_client.post(
        f"/sites/{first_site['site_id']}/tags",
        json={
            "site_id": first_site["site_id"],
            "tags": ["extra", "shared"],
        },
    )
    assert add_tags_response.status_code == 200
    assert add_tags_response.json()["tags"] == ["shared", "route-a", "extra"]

    remove_tags_response = authenticated_client.post(
        f"/sites/{first_site['site_id']}/tags/remove",
        json={
            "site_id": first_site["site_id"],
            "tags": ["shared"],
        },
    )
    assert remove_tags_response.status_code == 200
    assert remove_tags_response.json()["tags"] == ["route-a", "extra"]

    archive_response = authenticated_client.post(
        f"/sites/{first_site['site_id']}/archive",
        json={"site_id": first_site["site_id"]},
    )
    assert archive_response.status_code == 200
    assert archive_response.json()["is_archived"] is True

    default_list_response = authenticated_client.get(
        "/sites",
        params=[("site_ids", first_site["site_id"])],
    )
    assert default_list_response.status_code == 200
    assert default_list_response.json()["items"] == []

    archived_list_response = authenticated_client.get(
        "/sites",
        params=[
            ("site_ids", first_site["site_id"]),
            ("include_archived", "true"),
        ],
    )
    assert archived_list_response.status_code == 200
    archived_items = archived_list_response.json()["items"]
    assert len(archived_items) == 1
    assert archived_items[0]["site_id"] == first_site["site_id"]
    assert archived_items[0]["is_archived"] is True


# %%
def test_site_mutation_routes_reject_path_body_mismatch(
    authenticated_client: TestClient,
    graph_with_assets: nk.Graph,
) -> None:
    _upload_graph_assets(authenticated_client, graph_with_assets)
    site = _create_site(
        authenticated_client=authenticated_client,
        graph=graph_with_assets,
        tags=[],
    )

    response = authenticated_client.post(
        f"/sites/{site['site_id']}/archive",
        json={"site_id": "00000000-0000-0000-0000-000000000000"},
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": "Path site_id does not match request body site_id.",
    }
