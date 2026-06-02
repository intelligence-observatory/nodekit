"""FastAPI dependencies for nodekit-server."""

from collections.abc import Generator
from typing import Annotated

import fastapi
import sqlmodel

from nodekit_server.settings import ServerSettings, get_server_settings
from nodekit_server.storage import (
    AssetStore,
    FileSystemAssetStore,
    FileSystemSiteArtifactStore,
    S3AssetStore,
    S3SiteArtifactStore,
    SiteArtifactStore,
)


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
def get_asset_store(settings: SettingsDep) -> AssetStore:
    """Return the configured Asset storage backend."""

    if settings.asset_store_backend == "filesystem":
        return FileSystemAssetStore(root=settings.asset_store_dir)

    if settings.asset_store_backend == "s3":
        if settings.s3_bucket_name is None:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="NODEKIT_SERVER_S3_BUCKET_NAME is required for S3 Asset storage.",
            )
        if settings.s3_public_base_url is None:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="NODEKIT_SERVER_S3_PUBLIC_BASE_URL is required for S3 Asset storage.",
            )
        return S3AssetStore(
            bucket_name=settings.s3_bucket_name,
            public_base_url=settings.s3_public_base_url,
            region_name=settings.s3_region_name,
            prefix=settings.s3_prefix,
            endpoint_url=settings.s3_endpoint_url,
        )

    raise fastapi.HTTPException(
        status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Unsupported Asset storage backend.",
    )


AssetStoreDep = Annotated[AssetStore, fastapi.Depends(get_asset_store)]


# %% Site artifact storage
def get_site_artifact_store(settings: SettingsDep) -> SiteArtifactStore | None:
    """Return the configured frozen Site artifact storage backend."""

    if settings.site_hosting_backend == "server":
        return None

    if settings.site_hosting_backend == "filesystem":
        return FileSystemSiteArtifactStore(root=settings.site_store_dir)

    if settings.site_hosting_backend == "s3":
        bucket_name = settings.s3_site_bucket_name or settings.s3_bucket_name
        if bucket_name is None:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=(
                    "NODEKIT_SERVER_S3_SITE_BUCKET_NAME or NODEKIT_SERVER_S3_BUCKET_NAME "
                    "is required for S3 Site artifact storage."
                ),
            )
        if settings.s3_site_public_base_url is None:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="NODEKIT_SERVER_S3_SITE_PUBLIC_BASE_URL is required for S3 Site hosting.",
            )
        return S3SiteArtifactStore(
            bucket_name=bucket_name,
            public_base_url=settings.s3_site_public_base_url,
            region_name=settings.s3_region_name,
            prefix=settings.s3_site_prefix,
            endpoint_url=settings.s3_site_endpoint_url or settings.s3_endpoint_url,
        )

    raise fastapi.HTTPException(
        status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Unsupported Site artifact hosting backend.",
    )


SiteArtifactStoreDep = Annotated[
    SiteArtifactStore | None,
    fastapi.Depends(get_site_artifact_store),
]
