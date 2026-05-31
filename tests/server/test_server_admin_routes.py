import datetime
import sys
from types import ModuleType
from typing import Any
from uuid import UUID

import sqlmodel
from fastapi.testclient import TestClient


# %%
def _assert_utc_timestamp(value: str) -> None:
    parsed = datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
    assert parsed.utcoffset() == datetime.timedelta(0)


# %%
def _get_records_engine_and_auth() -> tuple[Any, Any, Any]:
    return (
        sys.modules["nodekit_server.records"],
        sys.modules["nodekit_server.deps"].engine,
        sys.modules["nodekit_server.auth"],
    )


def _create_user(
    authenticated_client: TestClient,
    username: str,
    *,
    is_admin: bool = False,
) -> dict[str, Any]:
    response = authenticated_client.post(
        "/admin/users",
        json={"username": username, "is_admin": is_admin},
    )
    response.raise_for_status()
    return response.json()


def _create_api_token(
    authenticated_client: TestClient,
    name: str,
    *,
    user_id: str | None = None,
) -> dict[str, Any]:
    payload: dict[str, str] = {"name": name}
    if user_id is not None:
        payload["user_id"] = user_id
    response = authenticated_client.post("/admin/api-tokens", json=payload)
    response.raise_for_status()
    return response.json()


def _get_bootstrap_admin(authenticated_client: TestClient) -> dict[str, Any]:
    response = authenticated_client.get(
        "/admin/users",
        params=[("usernames", "admin"), ("include_archived", "true")],
    )
    response.raise_for_status()
    items = response.json()["items"]
    assert len(items) == 1
    return items[0]


# %%
def test_admin_routes_require_auth(server_main: ModuleType) -> None:
    with TestClient(server_main.app) as client:
        response = client.get("/admin/users")

    assert response.status_code == 401


# %%
def test_admin_routes_reject_non_admin(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    user = _create_user(authenticated_client, "non-admin-user")
    api_token = _create_api_token(
        authenticated_client,
        "non-admin-token",
        user_id=user["user_id"],
    )

    with TestClient(server_main.app) as client:
        client.headers.update({"Authorization": f"Bearer {api_token['token']}"})
        response = client.get("/admin/users")

    assert response.status_code == 403


# %%
def test_user_admin_lifecycle_and_pagination(authenticated_client: TestClient) -> None:
    first_user = _create_user(authenticated_client, "admin-route-user")
    second_user = _create_user(authenticated_client, "admin-route-user")
    _assert_utc_timestamp(first_user["timestamp_created"])
    _assert_utc_timestamp(second_user["timestamp_created"])

    filtered_response = authenticated_client.get(
        "/admin/users",
        params=[("usernames", "admin-route-user")],
    )
    assert filtered_response.status_code == 200
    filtered_items = filtered_response.json()["items"]
    assert {item["user_id"] for item in filtered_items} == {
        first_user["user_id"],
        second_user["user_id"],
    }

    first_page_response = authenticated_client.get(
        "/admin/users",
        params=[
            ("user_ids", first_user["user_id"]),
            ("user_ids", second_user["user_id"]),
            ("max_items", "1"),
        ],
    )
    assert first_page_response.status_code == 200
    first_page = first_page_response.json()
    assert len(first_page["items"]) == 1
    assert first_page["next_page_cursor"] is not None

    second_page_response = authenticated_client.get(
        "/admin/users",
        params=[
            ("user_ids", first_user["user_id"]),
            ("user_ids", second_user["user_id"]),
            ("max_items", "1"),
            ("page_cursor", first_page["next_page_cursor"]),
        ],
    )
    assert second_page_response.status_code == 200
    second_page = second_page_response.json()
    assert len(second_page["items"]) == 1
    assert second_page["next_page_cursor"] is None
    assert {first_page["items"][0]["user_id"], second_page["items"][0]["user_id"]} == {
        first_user["user_id"],
        second_user["user_id"],
    }

    get_response = authenticated_client.get(f"/admin/users/{first_user['user_id']}")
    assert get_response.status_code == 200
    assert get_response.json()["user_id"] == first_user["user_id"]

    update_response = authenticated_client.post(
        f"/admin/users/{first_user['user_id']}",
        json={
            "user_id": first_user["user_id"],
            "username": "renamed-admin-route-user",
            "is_admin": True,
        },
    )
    assert update_response.status_code == 200
    assert update_response.json()["username"] == "renamed-admin-route-user"
    assert update_response.json()["is_admin"] is True

    archive_response = authenticated_client.post(
        f"/admin/users/{first_user['user_id']}/archive",
        json={"user_id": first_user["user_id"]},
    )
    assert archive_response.status_code == 200
    assert archive_response.json()["is_archived"] is True

    default_list_response = authenticated_client.get(
        "/admin/users",
        params=[("user_ids", first_user["user_id"])],
    )
    assert default_list_response.status_code == 200
    assert default_list_response.json()["items"] == []

    include_archived_response = authenticated_client.get(
        "/admin/users",
        params=[
            ("user_ids", first_user["user_id"]),
            ("include_archived", "true"),
        ],
    )
    assert include_archived_response.status_code == 200
    assert include_archived_response.json()["items"][0]["is_archived"] is True


# %%
def test_user_admin_self_protection_and_path_mismatch(
    authenticated_client: TestClient,
) -> None:
    admin_user = _get_bootstrap_admin(authenticated_client)

    self_demote_response = authenticated_client.post(
        f"/admin/users/{admin_user['user_id']}",
        json={
            "user_id": admin_user["user_id"],
            "is_admin": False,
        },
    )
    assert self_demote_response.status_code == 400
    assert self_demote_response.json() == {"detail": "Admins cannot demote themselves."}

    self_archive_response = authenticated_client.post(
        f"/admin/users/{admin_user['user_id']}/archive",
        json={"user_id": admin_user["user_id"]},
    )
    assert self_archive_response.status_code == 400
    assert self_archive_response.json() == {"detail": "Admins cannot archive themselves."}

    update_mismatch_response = authenticated_client.post(
        f"/admin/users/{admin_user['user_id']}",
        json={"user_id": "00000000-0000-0000-0000-000000000000"},
    )
    assert update_mismatch_response.status_code == 400
    assert update_mismatch_response.json() == {
        "detail": "Path user_id does not match request body user_id.",
    }

    archive_mismatch_response = authenticated_client.post(
        f"/admin/users/{admin_user['user_id']}/archive",
        json={"user_id": "00000000-0000-0000-0000-000000000000"},
    )
    assert archive_mismatch_response.status_code == 400
    assert archive_mismatch_response.json() == {
        "detail": "Path user_id does not match request body user_id.",
    }


# %%
def test_api_token_create_list_revoke_and_auth(
    authenticated_client: TestClient,
    server_main: ModuleType,
) -> None:
    user = _create_user(authenticated_client, "token-route-user")
    first_token = _create_api_token(
        authenticated_client,
        "token-route-a",
        user_id=user["user_id"],
    )
    second_token = _create_api_token(
        authenticated_client,
        "token-route-b",
        user_id=user["user_id"],
    )
    assert first_token["token"]
    assert second_token["token"]
    assert first_token["token"] != second_token["token"]
    _assert_utc_timestamp(first_token["timestamp_created"])

    records, engine, auth = _get_records_engine_and_auth()
    with sqlmodel.Session(engine) as session:
        token_record = session.get(records.ApiTokenRecord, UUID(first_token["api_token_id"]))
        assert token_record is not None
        assert token_record.token_hash == auth.hash_api_token(first_token["token"])
        assert token_record.token_hash != first_token["token"]

    with TestClient(server_main.app) as client:
        client.headers.update({"Authorization": f"Bearer {first_token['token']}"})
        tag_response = client.get("/tags")
    assert tag_response.status_code == 200

    list_response = authenticated_client.get(
        "/admin/api-tokens",
        params=[
            ("api_token_ids", first_token["api_token_id"]),
            ("api_token_ids", second_token["api_token_id"]),
        ],
    )
    assert list_response.status_code == 200
    listed_tokens = list_response.json()["items"]
    assert len(listed_tokens) == 2
    assert all("token" not in item for item in listed_tokens)

    first_page_response = authenticated_client.get(
        "/admin/api-tokens",
        params=[
            ("api_token_ids", first_token["api_token_id"]),
            ("api_token_ids", second_token["api_token_id"]),
            ("max_items", "1"),
        ],
    )
    assert first_page_response.status_code == 200
    first_page = first_page_response.json()
    assert len(first_page["items"]) == 1
    assert first_page["next_page_cursor"] is not None

    second_page_response = authenticated_client.get(
        "/admin/api-tokens",
        params=[
            ("api_token_ids", first_token["api_token_id"]),
            ("api_token_ids", second_token["api_token_id"]),
            ("max_items", "1"),
            ("page_cursor", first_page["next_page_cursor"]),
        ],
    )
    assert second_page_response.status_code == 200
    second_page = second_page_response.json()
    assert len(second_page["items"]) == 1
    assert second_page["next_page_cursor"] is None
    assert {
        first_page["items"][0]["api_token_id"],
        second_page["items"][0]["api_token_id"],
    } == {first_token["api_token_id"], second_token["api_token_id"]}

    revoke_response = authenticated_client.post(
        f"/admin/api-tokens/{first_token['api_token_id']}/revoke",
        json={"api_token_id": first_token["api_token_id"]},
    )
    assert revoke_response.status_code == 200
    assert revoke_response.json()["is_revoked"] is True

    revoked_default_list_response = authenticated_client.get(
        "/admin/api-tokens",
        params=[("api_token_ids", first_token["api_token_id"])],
    )
    assert revoked_default_list_response.status_code == 200
    assert revoked_default_list_response.json()["items"] == []

    revoked_included_response = authenticated_client.get(
        "/admin/api-tokens",
        params=[
            ("api_token_ids", first_token["api_token_id"]),
            ("include_revoked", "true"),
        ],
    )
    assert revoked_included_response.status_code == 200
    assert revoked_included_response.json()["items"][0]["is_revoked"] is True

    with TestClient(server_main.app) as client:
        client.headers.update({"Authorization": f"Bearer {first_token['token']}"})
        revoked_auth_response = client.get("/tags")
    assert revoked_auth_response.status_code == 401


# %%
def test_api_token_create_target_validation_and_revoke_path_mismatch(
    authenticated_client: TestClient,
) -> None:
    archived_user = _create_user(authenticated_client, "archived-token-user")
    archive_response = authenticated_client.post(
        f"/admin/users/{archived_user['user_id']}/archive",
        json={"user_id": archived_user["user_id"]},
    )
    assert archive_response.status_code == 200

    archived_target_response = authenticated_client.post(
        "/admin/api-tokens",
        json={
            "name": "archived-target-token",
            "user_id": archived_user["user_id"],
        },
    )
    assert archived_target_response.status_code == 404

    admin_token = _create_api_token(authenticated_client, "implicit-admin-token")
    assert admin_token["user_id"] == _get_bootstrap_admin(authenticated_client)["user_id"]

    mismatch_response = authenticated_client.post(
        f"/admin/api-tokens/{admin_token['api_token_id']}/revoke",
        json={"api_token_id": "00000000-0000-0000-0000-000000000000"},
    )
    assert mismatch_response.status_code == 400
    assert mismatch_response.json() == {
        "detail": "Path api_token_id does not match request body api_token_id.",
    }
