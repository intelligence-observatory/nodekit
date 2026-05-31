"""FastAPI application for the NodeKit deployment service."""

from contextlib import asynccontextmanager

import fastapi
import sqlmodel

from nodekit_server.auth import ensure_bootstrap_admin
from nodekit_server.deps import engine, settings
from nodekit_server.routers import assets, health


# %% Lifespan
@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    """Initialize the current canonical schema and local storage on startup."""

    settings.asset_store_dir.mkdir(parents=True, exist_ok=True)
    if settings.create_schema_on_startup:
        sqlmodel.SQLModel.metadata.create_all(engine)
    with sqlmodel.Session(engine) as session:
        ensure_bootstrap_admin(session=session, settings=settings)
    yield


# %% App
app = fastapi.FastAPI(title="NodeKit Server", lifespan=lifespan)
app.include_router(health.router)
app.include_router(assets.router)
