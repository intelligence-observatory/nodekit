"""FastAPI application for the NodeKit deployment service."""

from contextlib import asynccontextmanager
from typing import Any, cast
from urllib.parse import urlsplit

import fastapi
import sqlmodel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from nodekit_server.auth import ensure_bootstrap_admin
from nodekit_server.deps import engine, settings
from nodekit_server.routers import (
    admin,
    assets,
    health,
    home,
    participant,
    runtime,
    runs,
    sites,
    tags,
)


# %% Lifespan
@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    """Initialize the current canonical schema and local storage on startup."""

    if settings.asset_store_backend == "filesystem":
        settings.asset_store_dir.mkdir(parents=True, exist_ok=True)
    if settings.site_hosting_backend == "filesystem":
        settings.site_store_dir.mkdir(parents=True, exist_ok=True)
    if settings.create_schema_on_startup:
        sqlmodel.SQLModel.metadata.create_all(engine)
    with sqlmodel.Session(engine) as session:
        ensure_bootstrap_admin(session=session, settings=settings)
    yield


# %% App
app = fastapi.FastAPI(title="NodeKit Server", lifespan=lifespan, redoc_url=None)
if settings.site_hosting_backend == "filesystem":
    app.mount(
        "/site-artifacts",
        StaticFiles(directory=settings.site_store_dir, check_dir=False),
        name="site-artifacts",
    )


def _site_cors_origins() -> list[str]:
    origins = list(settings.site_cors_origins)
    if origins:
        return origins
    if settings.site_hosting_backend != "s3" or settings.s3_site_public_base_url is None:
        return []

    split_url = urlsplit(settings.s3_site_public_base_url)
    if not split_url.scheme or not split_url.netloc:
        return []
    return [f"{split_url.scheme}://{split_url.netloc}"]


site_cors_origins = _site_cors_origins()
if site_cors_origins:
    app.add_middleware(
        cast(Any, CORSMiddleware),
        allow_origins=site_cors_origins,
        allow_methods=["POST", "OPTIONS"],
        allow_headers=["Content-Type"],
    )

app.include_router(home.router)
app.include_router(health.router)
app.include_router(runtime.router)
app.include_router(admin.router)
app.include_router(assets.router)
app.include_router(sites.router)
app.include_router(tags.router)
app.include_router(runs.router)
app.include_router(participant.router)
