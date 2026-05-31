"""FastAPI application for the NodeKit deployment service."""

from contextlib import asynccontextmanager

import fastapi
import sqlmodel

from nodekit_server.auth import ensure_bootstrap_admin
from nodekit_server.deps import engine, settings
from nodekit_server.routers import admin, assets, health, participant, runtime, runs, sites, tags


# %% Lifespan
@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    """Initialize the current canonical schema and local storage on startup."""

    if settings.asset_store_backend == "filesystem":
        settings.asset_store_dir.mkdir(parents=True, exist_ok=True)
    if settings.create_schema_on_startup:
        sqlmodel.SQLModel.metadata.create_all(engine)
    with sqlmodel.Session(engine) as session:
        ensure_bootstrap_admin(session=session, settings=settings)
    yield


# %% App
app = fastapi.FastAPI(title="NodeKit Server", lifespan=lifespan)
app.include_router(health.router)
app.include_router(runtime.router)
app.include_router(admin.router)
app.include_router(assets.router)
app.include_router(sites.router)
app.include_router(tags.router)
app.include_router(runs.router)
app.include_router(participant.router)
