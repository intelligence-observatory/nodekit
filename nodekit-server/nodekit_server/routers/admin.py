"""Admin routes for nodekit-server."""

from typing import Annotated
from uuid import UUID, uuid4

import fastapi
import secrets
import sqlmodel
from sqlalchemy import and_, or_

import nodekit.server.contracts as contracts
from nodekit.server.pagination import decode_timestamp_id_cursor, encode_timestamp_id_cursor
from nodekit.server.values import ApiTokenId, UserId
from nodekit_server.auth import AdminDep, hash_api_token
from nodekit_server.deps import SessionDep
from nodekit_server.records import ApiTokenRecord, UserRecord, as_utc


# %% Router
router = fastapi.APIRouter()


# %% Helpers
def _user_response_payload(user_record: UserRecord) -> dict[str, object]:
    return {
        "user_id": user_record.user_id,
        "username": user_record.username,
        "is_admin": user_record.is_admin,
        "is_archived": user_record.is_archived,
        "timestamp_created": as_utc(user_record.timestamp_created),
    }


def _user_item(user_record: UserRecord) -> contracts.ListUsersItem:
    return contracts.ListUsersItem.model_validate(_user_response_payload(user_record))


def _api_token_response_payload(api_token_record: ApiTokenRecord) -> dict[str, object]:
    return {
        "api_token_id": api_token_record.api_token_id,
        "user_id": api_token_record.user_id,
        "name": api_token_record.name,
        "is_revoked": api_token_record.is_revoked,
        "timestamp_created": as_utc(api_token_record.timestamp_created),
    }


def _api_token_item(api_token_record: ApiTokenRecord) -> contracts.ListApiTokensItem:
    return contracts.ListApiTokensItem.model_validate(_api_token_response_payload(api_token_record))


def _get_user_record(
    session: sqlmodel.Session,
    user_id: UserId,
) -> UserRecord:
    user_record = session.get(UserRecord, user_id)
    if user_record is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    return user_record


def _get_active_user_record(
    session: sqlmodel.Session,
    user_id: UserId,
) -> UserRecord:
    user_record = _get_user_record(session=session, user_id=user_id)
    if user_record.is_archived:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    return user_record


def _get_api_token_record(
    session: sqlmodel.Session,
    api_token_id: ApiTokenId,
) -> ApiTokenRecord:
    api_token_record = session.get(ApiTokenRecord, api_token_id)
    if api_token_record is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="API token not found.",
        )
    return api_token_record


def _ensure_path_body_user_match(path_user_id: UserId, body_user_id: UserId) -> None:
    if path_user_id != body_user_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Path user_id does not match request body user_id.",
        )


def _ensure_path_body_api_token_match(
    path_api_token_id: ApiTokenId,
    body_api_token_id: ApiTokenId,
) -> None:
    if path_api_token_id != body_api_token_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Path api_token_id does not match request body api_token_id.",
        )


def _apply_user_page_cursor(
    statement,
    page_cursor: str,
):
    try:
        cursor = decode_timestamp_id_cursor(page_cursor)
        cursor_user_id = UUID(cursor.id)
    except ValueError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Invalid page cursor.",
        ) from exc

    cursor_timestamp = cursor.timestamp_created.replace(tzinfo=None)
    return statement.where(
        or_(
            sqlmodel.col(UserRecord.timestamp_created) < cursor_timestamp,
            and_(
                sqlmodel.col(UserRecord.timestamp_created) == cursor_timestamp,
                sqlmodel.col(UserRecord.user_id) < cursor_user_id,
            ),
        )
    )


def _apply_api_token_page_cursor(
    statement,
    page_cursor: str,
):
    try:
        cursor = decode_timestamp_id_cursor(page_cursor)
        cursor_api_token_id = UUID(cursor.id)
    except ValueError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Invalid page cursor.",
        ) from exc

    cursor_timestamp = cursor.timestamp_created.replace(tzinfo=None)
    return statement.where(
        or_(
            sqlmodel.col(ApiTokenRecord.timestamp_created) < cursor_timestamp,
            and_(
                sqlmodel.col(ApiTokenRecord.timestamp_created) == cursor_timestamp,
                sqlmodel.col(ApiTokenRecord.api_token_id) < cursor_api_token_id,
            ),
        )
    )


def _generate_api_token() -> str:
    return secrets.token_urlsafe(32)


# %% Create User
@router.post("/admin/users")
def create_user(
    request: contracts.CreateUserRequest,
    session: SessionDep,
    admin: AdminDep,
) -> contracts.CreateUserResponse:
    """Create a user."""

    _ = admin
    user_record = UserRecord(
        user_id=uuid4(),
        username=request.username,
        is_admin=request.is_admin,
        is_archived=False,
    )
    session.add(user_record)
    session.commit()
    session.refresh(user_record)
    return contracts.CreateUserResponse.model_validate(_user_response_payload(user_record))


# %% List Users
@router.get("/admin/users")
def list_users(
    query: Annotated[contracts.ListUsersQuery, fastapi.Query()],
    session: SessionDep,
    admin: AdminDep,
) -> contracts.ListUsersResponse:
    """List users."""

    _ = admin
    statement = sqlmodel.select(UserRecord)
    if query.user_ids is not None:
        statement = statement.where(sqlmodel.col(UserRecord.user_id).in_(query.user_ids))
    if query.usernames is not None:
        statement = statement.where(sqlmodel.col(UserRecord.username).in_(query.usernames))
    if not query.include_archived:
        statement = statement.where(sqlmodel.col(UserRecord.is_archived) == False)  # noqa: E712

    if query.page_cursor is not None:
        statement = _apply_user_page_cursor(statement=statement, page_cursor=query.page_cursor)

    statement = statement.order_by(
        sqlmodel.col(UserRecord.timestamp_created).desc(),
        sqlmodel.col(UserRecord.user_id).desc(),
    )
    statement = statement.limit(query.max_items + 1)
    user_records = session.exec(statement).all()
    page_records = user_records[: query.max_items]

    next_page_cursor = None
    if len(user_records) > query.max_items and page_records:
        last_record = page_records[-1]
        next_page_cursor = encode_timestamp_id_cursor(
            timestamp_created=as_utc(last_record.timestamp_created),
            id=last_record.user_id,
        )

    return contracts.ListUsersResponse(
        items=[_user_item(user_record) for user_record in page_records],
        next_page_cursor=next_page_cursor,
    )


# %% Get User
@router.get("/admin/users/{user_id}")
def get_user(
    user_id: UserId,
    session: SessionDep,
    admin: AdminDep,
) -> contracts.GetUserResponse:
    """Get one user."""

    _ = admin
    user_record = _get_user_record(session=session, user_id=user_id)
    return contracts.GetUserResponse.model_validate(_user_response_payload(user_record))


# %% Update User
@router.post("/admin/users/{user_id}")
def update_user(
    user_id: UserId,
    request: contracts.UpdateUserRequest,
    session: SessionDep,
    admin: AdminDep,
) -> contracts.UpdateUserResponse:
    """Update one user."""

    _ensure_path_body_user_match(path_user_id=user_id, body_user_id=request.user_id)
    if user_id == admin.user_id and request.is_admin is False:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Admins cannot demote themselves.",
        )

    user_record = _get_user_record(session=session, user_id=user_id)
    if request.username is not None:
        user_record.username = request.username
    if request.is_admin is not None:
        user_record.is_admin = request.is_admin

    session.add(user_record)
    session.commit()
    session.refresh(user_record)
    return contracts.UpdateUserResponse.model_validate(_user_response_payload(user_record))


# %% Archive User
@router.post("/admin/users/{user_id}/archive")
def archive_user(
    user_id: UserId,
    request: contracts.ArchiveUserRequest,
    session: SessionDep,
    admin: AdminDep,
) -> contracts.ArchiveUserResponse:
    """Archive one user."""

    _ensure_path_body_user_match(path_user_id=user_id, body_user_id=request.user_id)
    if user_id == admin.user_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Admins cannot archive themselves.",
        )

    user_record = _get_user_record(session=session, user_id=user_id)
    user_record.is_archived = True
    session.add(user_record)
    session.commit()
    session.refresh(user_record)
    return contracts.ArchiveUserResponse.model_validate(_user_response_payload(user_record))


# %% Create API Token
@router.post("/admin/api-tokens")
def create_api_token(
    request: contracts.CreateApiTokenRequest,
    session: SessionDep,
    admin: AdminDep,
) -> contracts.CreateApiTokenResponse:
    """Create an API token."""

    target_user_id = request.user_id or admin.user_id
    target_user = _get_active_user_record(session=session, user_id=target_user_id)
    token = _generate_api_token()
    api_token_record = ApiTokenRecord(
        api_token_id=uuid4(),
        user_id=target_user.user_id,
        name=request.name,
        token_hash=hash_api_token(token),
        is_revoked=False,
    )
    session.add(api_token_record)
    session.commit()
    session.refresh(api_token_record)

    return contracts.CreateApiTokenResponse(
        api_token_id=api_token_record.api_token_id,
        user_id=api_token_record.user_id,
        name=api_token_record.name,
        is_revoked=api_token_record.is_revoked,
        timestamp_created=as_utc(api_token_record.timestamp_created),
        token=token,
    )


# %% List API Tokens
@router.get("/admin/api-tokens")
def list_api_tokens(
    query: Annotated[contracts.ListApiTokensQuery, fastapi.Query()],
    session: SessionDep,
    admin: AdminDep,
) -> contracts.ListApiTokensResponse:
    """List API tokens."""

    _ = admin
    statement = sqlmodel.select(ApiTokenRecord)
    if query.api_token_ids is not None:
        statement = statement.where(
            sqlmodel.col(ApiTokenRecord.api_token_id).in_(query.api_token_ids)
        )
    if query.user_id is not None:
        statement = statement.where(sqlmodel.col(ApiTokenRecord.user_id) == query.user_id)
    if not query.include_revoked:
        statement = statement.where(sqlmodel.col(ApiTokenRecord.is_revoked) == False)  # noqa: E712

    if query.page_cursor is not None:
        statement = _apply_api_token_page_cursor(
            statement=statement,
            page_cursor=query.page_cursor,
        )

    statement = statement.order_by(
        sqlmodel.col(ApiTokenRecord.timestamp_created).desc(),
        sqlmodel.col(ApiTokenRecord.api_token_id).desc(),
    )
    statement = statement.limit(query.max_items + 1)
    api_token_records = session.exec(statement).all()
    page_records = api_token_records[: query.max_items]

    next_page_cursor = None
    if len(api_token_records) > query.max_items and page_records:
        last_record = page_records[-1]
        next_page_cursor = encode_timestamp_id_cursor(
            timestamp_created=as_utc(last_record.timestamp_created),
            id=last_record.api_token_id,
        )

    return contracts.ListApiTokensResponse(
        items=[_api_token_item(api_token_record) for api_token_record in page_records],
        next_page_cursor=next_page_cursor,
    )


# %% Revoke API Token
@router.post("/admin/api-tokens/{api_token_id}/revoke")
def revoke_api_token(
    api_token_id: ApiTokenId,
    request: contracts.RevokeApiTokenRequest,
    session: SessionDep,
    admin: AdminDep,
) -> contracts.RevokeApiTokenResponse:
    """Revoke one API token."""

    _ = admin
    _ensure_path_body_api_token_match(
        path_api_token_id=api_token_id,
        body_api_token_id=request.api_token_id,
    )
    api_token_record = _get_api_token_record(session=session, api_token_id=api_token_id)
    api_token_record.is_revoked = True
    session.add(api_token_record)
    session.commit()
    session.refresh(api_token_record)
    return contracts.RevokeApiTokenResponse.model_validate(
        _api_token_response_payload(api_token_record)
    )
