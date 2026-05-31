"""Settings for the NodeKit deployment service."""

from functools import lru_cache
from pathlib import Path
from typing import ClassVar, Literal

import pydantic
from pydantic_settings import BaseSettings, SettingsConfigDict


# %%
class ServerSettings(BaseSettings):
    """Environment-backed settings for nodekit-server."""

    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=True,
    )

    database_url: str = pydantic.Field(
        default="sqlite:///./nodekit-server.db",
        alias="NODEKIT_SERVER_DATABASE_URL",
        description="SQLModel/SQLAlchemy database URL.",
        repr=False,
    )
    create_schema_on_startup: bool = pydantic.Field(
        default=True,
        alias="NODEKIT_SERVER_CREATE_SCHEMA_ON_STARTUP",
        description="Create the current canonical SQLModel schema when the app starts.",
    )

    asset_store_backend: Literal["filesystem"] = pydantic.Field(
        default="filesystem",
        alias="NODEKIT_SERVER_ASSET_STORE_BACKEND",
        description="Asset storage backend. Only filesystem storage is supported for now.",
    )
    asset_store_dir: Path = pydantic.Field(
        default=Path("./nodekit-server-assets"),
        alias="NODEKIT_SERVER_ASSET_STORE_DIR",
        description="Directory for filesystem-backed Asset storage.",
    )
    public_base_url: str | None = pydantic.Field(
        default=None,
        alias="NODEKIT_SERVER_PUBLIC_BASE_URL",
        description="Externally visible base URL, if different from request.base_url.",
    )

    bootstrap_admin_username: str = pydantic.Field(
        default="admin",
        alias="NODEKIT_SERVER_BOOTSTRAP_ADMIN_USERNAME",
        description="Username for the initial admin user.",
    )
    bootstrap_admin_api_token: pydantic.SecretStr | None = pydantic.Field(
        default=None,
        alias="NODEKIT_SERVER_BOOTSTRAP_ADMIN_API_TOKEN",
        description="Optional API token to hash and attach to the bootstrap admin user.",
        repr=False,
    )


# %%
@lru_cache
def get_server_settings() -> ServerSettings:
    """Return cached server settings loaded from environment variables."""

    return ServerSettings()
