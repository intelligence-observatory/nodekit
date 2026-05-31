"""FastAPI dependencies for nodekit-server."""

from collections.abc import Generator
from typing import Annotated

import fastapi
import sqlmodel

from nodekit_server.settings import ServerSettings, get_server_settings
from nodekit_server.storage import FileSystemAssetStore


# %% Settings
settings = get_server_settings()


def get_settings() -> ServerSettings:
    """Return environment-backed server settings."""

    return settings


SettingsDep = Annotated[ServerSettings, fastapi.Depends(get_settings)]


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


# %% Asset storage
def get_asset_store(settings: SettingsDep) -> FileSystemAssetStore:
    """Return the configured Asset storage backend."""

    if settings.asset_store_backend != "filesystem":
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unsupported Asset storage backend.",
        )
    return FileSystemAssetStore(root=settings.asset_store_dir)


AssetStoreDep = Annotated[FileSystemAssetStore, fastapi.Depends(get_asset_store)]
