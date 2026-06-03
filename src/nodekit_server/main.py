"""FastAPI application for the NodeKit deployment service."""

import gzip
from contextlib import asynccontextmanager
from typing import Any, cast
from urllib.parse import urlsplit

import fastapi
import sqlmodel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.types import ASGIApp, Receive, Scope, Send

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


# %% Middleware
class GzipRequestBodyMiddleware:
    """Decode gzip-compressed request bodies before FastAPI validation."""

    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or not _has_gzip_content_encoding(scope):
            await self.app(scope, receive, send)
            return

        body = bytearray()
        more_body = True
        while more_body:
            message = await receive()
            if message["type"] != "http.request":
                continue
            body.extend(message.get("body", b""))
            more_body = message.get("more_body", False)

        try:
            decompressed_body = gzip.decompress(bytes(body))
        except (EOFError, OSError):
            response = fastapi.Response(
                content="Invalid gzip request body.",
                status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            )
            await response(scope, receive, send)
            return

        decompressed_scope = _scope_with_decompressed_body(
            scope=scope,
            content_length=len(decompressed_body),
        )
        sent_body = False

        async def receive_decompressed() -> dict[str, Any]:
            nonlocal sent_body
            if sent_body:
                return {"type": "http.request", "body": b"", "more_body": False}
            sent_body = True
            return {
                "type": "http.request",
                "body": decompressed_body,
                "more_body": False,
            }

        await self.app(decompressed_scope, receive_decompressed, send)


def _has_gzip_content_encoding(scope: Scope) -> bool:
    for name, value in scope["headers"]:
        if name.lower() == b"content-encoding":
            encodings = [encoding.strip() for encoding in value.lower().split(b",")]
            return b"gzip" in encodings
    return False


def _scope_with_decompressed_body(scope: Scope, content_length: int) -> Scope:
    headers = [
        (name, value)
        for name, value in scope["headers"]
        if name.lower() not in {b"content-encoding", b"content-length"}
    ]
    headers.append((b"content-length", str(content_length).encode("ascii")))
    return {**scope, "headers": headers}


# %% App
app = fastapi.FastAPI(title="NodeKit Server", lifespan=lifespan, redoc_url=None)
app.add_middleware(cast(Any, GzipRequestBodyMiddleware))
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
        allow_headers=["Content-Encoding", "Content-Type"],
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
