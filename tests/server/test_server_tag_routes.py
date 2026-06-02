import datetime
from types import ModuleType
from typing import Any

from fastapi.testclient import TestClient

import nodekit as nk


# %%
def _assert_utc_timestamp(value: str) -> None:
    parsed = datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
    assert parsed.utcoffset() == datetime.timedelta(0)


# %%
def _make_graph() -> nk.Graph:
    return nk.Graph(
        nodes={
            "start": nk.Node(
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            )
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )


def _create_tag(authenticated_client: TestClient, name: str) -> dict[str, Any]:
    response = authenticated_client.post("/tags", json={"name": name})
    response.raise_for_status()
    return response.json()


def _create_site(
    authenticated_client: TestClient,
    tags: list[str],
) -> dict[str, Any]:
    response = authenticated_client.post(
        "/sites",
        json={
            "conditions": {
                "default": {
                    "graph": _make_graph().model_dump(mode="json"),
                    "allocation_weight": 1,
                }
            },
            "tags": tags,
        },
    )
    response.raise_for_status()
    return response.json()


# %%
def test_tag_routes_require_auth(server_main: ModuleType) -> None:
    with TestClient(server_main.app) as client:
        list_response = client.get("/tags")
        create_response = client.post("/tags", json={"name": "tag-auth"})

    assert list_response.status_code == 401
    assert create_response.status_code == 401


# %%
def test_create_tag_is_idempotent_and_list_tags_paginates(
    authenticated_client: TestClient,
) -> None:
    first_tag = _create_tag(authenticated_client, "tag-pagination-a")
    second_tag = _create_tag(authenticated_client, "tag-pagination-b")
    duplicate_first_tag = _create_tag(authenticated_client, "tag-pagination-a")

    assert duplicate_first_tag == first_tag
    _assert_utc_timestamp(first_tag["timestamp_created"])
    _assert_utc_timestamp(second_tag["timestamp_created"])

    first_page_response = authenticated_client.get(
        "/tags",
        params=[
            ("names", "tag-pagination-a"),
            ("names", "tag-pagination-b"),
            ("max_items", "1"),
        ],
    )
    assert first_page_response.status_code == 200
    first_page = first_page_response.json()
    assert len(first_page["items"]) == 1
    assert first_page["next_page_cursor"] is not None

    second_page_response = authenticated_client.get(
        "/tags",
        params=[
            ("names", "tag-pagination-a"),
            ("names", "tag-pagination-b"),
            ("max_items", "1"),
            ("page_cursor", first_page["next_page_cursor"]),
        ],
    )
    assert second_page_response.status_code == 200
    second_page = second_page_response.json()
    assert len(second_page["items"]) == 1
    assert second_page["next_page_cursor"] is None
    assert {first_page["items"][0]["name"], second_page["items"][0]["name"]} == {
        "tag-pagination-a",
        "tag-pagination-b",
    }


# %%
def test_archive_tag_hides_default_list_and_allows_recreate(
    authenticated_client: TestClient,
) -> None:
    _create_tag(authenticated_client, "tag-archive-recreate")

    archive_response = authenticated_client.post(
        "/tags/archive",
        json={"name": "tag-archive-recreate"},
    )
    assert archive_response.status_code == 200
    assert archive_response.json()["is_archived"] is True

    default_list_response = authenticated_client.get(
        "/tags",
        params=[("names", "tag-archive-recreate")],
    )
    assert default_list_response.status_code == 200
    assert default_list_response.json()["items"] == []

    include_archived_response = authenticated_client.get(
        "/tags",
        params=[
            ("names", "tag-archive-recreate"),
            ("include_archived", "true"),
        ],
    )
    assert include_archived_response.status_code == 200
    archived_items = include_archived_response.json()["items"]
    assert len(archived_items) == 1
    assert archived_items[0]["is_archived"] is True

    recreated_tag = _create_tag(authenticated_client, "tag-archive-recreate")
    assert recreated_tag["is_archived"] is False

    second_include_archived_response = authenticated_client.get(
        "/tags",
        params=[
            ("names", "tag-archive-recreate"),
            ("include_archived", "true"),
        ],
    )
    assert second_include_archived_response.status_code == 200
    items = second_include_archived_response.json()["items"]
    assert len(items) == 2
    assert {item["is_archived"] for item in items} == {False, True}


# %%
def test_rename_tag_preserves_site_association_and_conflicts(
    authenticated_client: TestClient,
) -> None:
    site = _create_site(authenticated_client, tags=["tag-rename-old"])
    get_site_response = authenticated_client.get(f"/sites/{site['site_id']}")
    assert get_site_response.status_code == 200
    assert get_site_response.json()["tags"] == ["tag-rename-old"]

    rename_response = authenticated_client.post(
        "/tags/rename",
        json={
            "name": "tag-rename-old",
            "new_name": "tag-rename-new",
        },
    )
    assert rename_response.status_code == 200
    assert rename_response.json()["name"] == "tag-rename-new"

    get_renamed_site_response = authenticated_client.get(f"/sites/{site['site_id']}")
    assert get_renamed_site_response.status_code == 200
    assert get_renamed_site_response.json()["tags"] == ["tag-rename-new"]

    _create_tag(authenticated_client, "tag-conflict-a")
    _create_tag(authenticated_client, "tag-conflict-b")
    conflict_response = authenticated_client.post(
        "/tags/rename",
        json={
            "name": "tag-conflict-a",
            "new_name": "tag-conflict-b",
        },
    )

    assert conflict_response.status_code == 400
    assert conflict_response.json() == {
        "detail": "An active Tag with this name already exists.",
    }


# %%
def test_archive_tag_hides_tag_from_site_display(
    authenticated_client: TestClient,
) -> None:
    site = _create_site(authenticated_client, tags=["tag-archive-site"])

    archive_response = authenticated_client.post(
        "/tags/archive",
        json={"name": "tag-archive-site"},
    )
    assert archive_response.status_code == 200

    get_site_response = authenticated_client.get(f"/sites/{site['site_id']}")
    assert get_site_response.status_code == 200
    assert get_site_response.json()["tags"] == []
