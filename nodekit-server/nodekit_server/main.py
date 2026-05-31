"""FastAPI application for the NodeKit deployment service."""

from collections.abc import Generator
from contextlib import asynccontextmanager
from typing import Annotated
from uuid import uuid4

import fastapi
import hashlib
import secrets
import sqlmodel
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from nodekit_server.records import ApiTokenRecord, UserRecord
from nodekit_server.settings import ServerSettings, get_server_settings


# %% Settings
settings = get_server_settings()


# %% Database
def _connect_args(database_url: str) -> dict[str, bool]:
    if database_url.startswith("sqlite"):
        return {"check_same_thread": False}
    return {}


engine = sqlmodel.create_engine(
    url=settings.database_url,
    connect_args=_connect_args(settings.database_url),
)


def get_session() -> Generator[sqlmodel.Session, None, None]:
    """Yield a SQLModel session."""

    with sqlmodel.Session(engine) as session:
        yield session


SessionDep = Annotated[sqlmodel.Session, fastapi.Depends(get_session)]


# %% Auth
bearer_scheme = HTTPBearer(auto_error=False)


def hash_api_token(token: str) -> str:
    """Hash a high-entropy API token for storage and lookup."""

    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _ensure_bootstrap_admin(session: sqlmodel.Session, settings: ServerSettings) -> None:
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


# %% Lifespan
@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    """Initialize the current canonical schema and local storage on startup."""

    settings.asset_store_dir.mkdir(parents=True, exist_ok=True)
    if settings.create_schema_on_startup:
        sqlmodel.SQLModel.metadata.create_all(engine)
    with sqlmodel.Session(engine) as session:
        _ensure_bootstrap_admin(session=session, settings=settings)
    yield


# %% App
app = fastapi.FastAPI(title="NodeKit Server", lifespan=lifespan)


@app.get("/health", include_in_schema=False)
def get_health() -> dict[str, str]:
    """Return a simple health check response."""

    return {"status": "ok"}
