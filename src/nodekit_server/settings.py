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

    asset_store_backend: Literal["filesystem", "s3"] = pydantic.Field(
        default="filesystem",
        alias="NODEKIT_SERVER_ASSET_STORE_BACKEND",
        description="Asset storage backend.",
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
    site_hosting_backend: Literal["filesystem", "s3"] = pydantic.Field(
        default="filesystem",
        alias="NODEKIT_SERVER_SITE_HOSTING_BACKEND",
        description="Participant-facing Site artifact hosting backend.",
    )
    site_store_dir: Path = pydantic.Field(
        default=Path("./nodekit-server-sites"),
        alias="NODEKIT_SERVER_SITE_STORE_DIR",
        description="Directory for filesystem-backed frozen Site artifacts.",
    )
    site_cors_origins: tuple[str, ...] = pydantic.Field(
        default=(),
        alias="NODEKIT_SERVER_SITE_CORS_ORIGINS",
        description="Allowed browser origins for frozen Site submissions.",
    )

    s3_bucket_name: str | None = pydantic.Field(
        default=None,
        alias="NODEKIT_SERVER_S3_BUCKET_NAME",
        description="S3 bucket name for S3-backed Asset storage.",
    )
    s3_region_name: str = pydantic.Field(
        default="us-east-1",
        alias="NODEKIT_SERVER_S3_REGION_NAME",
        description="AWS region for S3-backed Asset storage.",
    )
    s3_prefix: str = pydantic.Field(
        default="assets",
        alias="NODEKIT_SERVER_S3_PREFIX",
        description="S3 object key prefix for Asset objects.",
    )
    s3_public_base_url: str | None = pydantic.Field(
        default=None,
        alias="NODEKIT_SERVER_S3_PUBLIC_BASE_URL",
        description="Public base URL used to redirect participant Asset requests.",
    )
    s3_endpoint_url: str | None = pydantic.Field(
        default=None,
        alias="NODEKIT_SERVER_S3_ENDPOINT_URL",
        description="Optional custom S3 endpoint URL for S3-compatible storage.",
    )
    s3_site_bucket_name: str | None = pydantic.Field(
        default=None,
        alias="NODEKIT_SERVER_S3_SITE_BUCKET_NAME",
        description="S3 bucket name for frozen Site artifact storage.",
    )
    s3_site_prefix: str = pydantic.Field(
        default="",
        alias="NODEKIT_SERVER_S3_SITE_PREFIX",
        description="S3 object key prefix for frozen Site artifacts.",
    )
    s3_site_public_base_url: str | None = pydantic.Field(
        default=None,
        alias="NODEKIT_SERVER_S3_SITE_PUBLIC_BASE_URL",
        description="Public base URL used to load frozen Site artifacts.",
    )
    s3_site_endpoint_url: str | None = pydantic.Field(
        default=None,
        alias="NODEKIT_SERVER_S3_SITE_ENDPOINT_URL",
        description="Optional custom S3 endpoint URL for Site artifact storage.",
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
