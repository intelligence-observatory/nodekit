"""Authentication helpers and dependencies for nodekit-server."""

from typing import Annotated
from uuid import uuid4

import fastapi
import hashlib
import secrets
import sqlmodel
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from nodekit_server.deps import SessionDep
from nodekit_server.records import ApiTokenRecord, UserRecord
from nodekit_server.settings import ServerSettings


# %% API tokens
bearer_scheme = HTTPBearer(auto_error=False)


def hash_api_token(token: str) -> str:
    """Hash a high-entropy API token for storage and lookup."""

    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def ensure_bootstrap_admin(session: sqlmodel.Session, settings: ServerSettings) -> None:
    """Create the bootstrap admin user and optional bootstrap API token."""

    statement = sqlmodel.select(UserRecord).where(
        UserRecord.username == settings.bootstrap_admin_username
    )
    user_record = session.exec(statement).one_or_none()
    if user_record is None:
        user_record = UserRecord(
            user_id=uuid4(),
            username=settings.bootstrap_admin_username,
            is_admin=True,
            is_archived=False,
        )
        session.add(user_record)
        session.commit()
        session.refresh(user_record)

    if settings.bootstrap_admin_api_token is None:
        return

    token_hash = hash_api_token(settings.bootstrap_admin_api_token.get_secret_value())
    statement = sqlmodel.select(ApiTokenRecord).where(ApiTokenRecord.token_hash == token_hash)
    token_record = session.exec(statement).one_or_none()
    if token_record is None:
        session.add(
            ApiTokenRecord(
                api_token_id=uuid4(),
                user_id=user_record.user_id,
                name="bootstrap",
                token_hash=token_hash,
                is_revoked=False,
            )
        )
        session.commit()


# %% Dependencies
def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, fastapi.Depends(bearer_scheme)],
    session: SessionDep,
) -> UserRecord:
    """Resolve the authenticated user from a bearer API token."""

    unauthorized = fastapi.HTTPException(
        status_code=fastapi.status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API token.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized
    if credentials.scheme.lower() != "bearer":
        raise unauthorized

    incoming_token_hash = hash_api_token(credentials.credentials)
    statement = sqlmodel.select(ApiTokenRecord).where(
        ApiTokenRecord.token_hash == incoming_token_hash
    )
    statement = statement.where(ApiTokenRecord.is_revoked == False)  # noqa: E712
    token_record = session.exec(statement).one_or_none()
    if token_record is None or not secrets.compare_digest(
        token_record.token_hash, incoming_token_hash
    ):
        raise unauthorized

    user_record = session.get(UserRecord, token_record.user_id)
    if user_record is None or user_record.is_archived:
        raise unauthorized
    return user_record


UserDep = Annotated[UserRecord, fastapi.Depends(get_current_user)]


def get_current_admin(user: UserDep) -> UserRecord:
    """Require an authenticated admin user."""

    if not user.is_admin:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return user


AdminDep = Annotated[UserRecord, fastapi.Depends(get_current_admin)]
