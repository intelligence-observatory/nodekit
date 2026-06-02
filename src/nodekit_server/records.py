"""SQLModel record models for the NodeKit deployment service."""

import datetime
from typing import ClassVar

from sqlalchemy import Column, LargeBinary, String
from sqlmodel import Field, SQLModel

from nodekit.values import MediaType, SHA256

from nodekit.server.values import ApiTokenId, RunId, RunStatus, SiteId, TagId, UserId


# %% Timestamps
def utc_now() -> datetime.datetime:
    """Return the current time as a timezone-aware UTC datetime."""

    return datetime.datetime.now(datetime.UTC)


def as_utc(timestamp: datetime.datetime) -> datetime.datetime:
    """Return a datetime as timezone-aware UTC.

    SQLite may return naive datetimes; nodekit-server treats stored datetimes as UTC.
    """

    if timestamp.tzinfo is None:
        return timestamp.replace(tzinfo=datetime.UTC)
    return timestamp.astimezone(datetime.UTC)


# %%
class UserRecord(SQLModel, table=True):
    """A user who can own Sites."""

    __tablename__: ClassVar[str] = "users"

    user_id: UserId = Field(primary_key=True)
    username: str = Field(description="A display username. It does not need to be unique.")
    is_admin: bool = False
    is_archived: bool = False
    timestamp_created: datetime.datetime = Field(default_factory=utc_now, index=True)


# %%
class TagRecord(SQLModel, table=True):
    """A user-owned label for finding related Sites."""

    __tablename__: ClassVar[str] = "tags"

    tag_id: TagId = Field(primary_key=True)
    user_id: UserId = Field(foreign_key="users.user_id")
    name: str = Field(min_length=1)
    is_archived: bool = False
    timestamp_created: datetime.datetime = Field(default_factory=utc_now, index=True)


# %%
class SiteRecord(SQLModel, table=True):
    """A frozen, participant-facing Site for running a Graph."""

    __tablename__: ClassVar[str] = "sites"

    site_id: SiteId = Field(primary_key=True)
    user_id: UserId = Field(foreign_key="users.user_id")
    graph_json_gzip: bytes = Field(
        sa_column=Column(LargeBinary, nullable=False),
        description="Gzipped JSON bytes for the frozen Graph with server-owned Asset locators.",
    )
    site_artifact_storage_key: str | None = Field(
        default=None,
        description="Storage key for the frozen participant-facing Site HTML artifact.",
    )
    site_artifact_url: str | None = Field(
        default=None,
        description="Public URL for the frozen participant-facing Site HTML artifact.",
    )
    runtime_js_storage_key: str | None = Field(
        default=None,
        description="Storage key for the frozen NodeKit browser JavaScript runtime.",
    )
    runtime_css_storage_key: str | None = Field(
        default=None,
        description="Storage key for the frozen NodeKit browser CSS runtime.",
    )
    runtime_js_sha256: SHA256 | None = Field(default=None, sa_column=Column(String(64)))
    runtime_css_sha256: SHA256 | None = Field(default=None, sa_column=Column(String(64)))
    frozen_nodekit_version: str | None = Field(default=None)
    site_hosting_backend: str | None = Field(default=None)
    is_archived: bool = False
    timestamp_created: datetime.datetime = Field(default_factory=utc_now, index=True)


# %%
class SiteAssetDependencyRecord(SQLModel, table=True):
    """Association between a Site and one of its stored Assets."""

    __tablename__: ClassVar[str] = "site_asset_dependencies"

    site_id: SiteId = Field(foreign_key="sites.site_id", primary_key=True)
    sha256: SHA256 = Field(sa_column=Column(String(64), primary_key=True))
    media_type: MediaType = Field(sa_column=Column(String, primary_key=True))
    timestamp_created: datetime.datetime = Field(default_factory=utc_now, index=True)


# %%
class SiteTagRecord(SQLModel, table=True):
    """Association between a Site and one of its Tags."""

    __tablename__: ClassVar[str] = "site_tags"

    site_id: SiteId = Field(foreign_key="sites.site_id", primary_key=True)
    tag_id: TagId = Field(foreign_key="tags.tag_id", primary_key=True)
    timestamp_created: datetime.datetime = Field(default_factory=utc_now, index=True)


# %%
class AssetRecord(SQLModel, table=True):
    """Server-side record for Asset bytes stored outside the Graph."""

    __tablename__: ClassVar[str] = "assets"

    sha256: SHA256 = Field(sa_column=Column(String(64), primary_key=True))
    media_type: MediaType = Field(sa_column=Column(String, primary_key=True))
    size_bytes: int = Field(ge=0)
    storage_key: str = Field(
        min_length=1,
        description="Storage-provider key for the Asset bytes, such as an S3 key or file path.",
    )
    timestamp_created: datetime.datetime = Field(default_factory=utc_now, index=True)


# %%
class ApiTokenRecord(SQLModel, table=True):
    """A hashed API token for Python client authentication."""

    __tablename__: ClassVar[str] = "api_tokens"

    api_token_id: ApiTokenId = Field(primary_key=True)
    user_id: UserId = Field(foreign_key="users.user_id")
    name: str = Field(min_length=1)
    token_hash: str = Field(min_length=1)
    is_revoked: bool = False
    timestamp_created: datetime.datetime = Field(default_factory=utc_now, index=True)


# %%
class RunRecord(SQLModel, table=True):
    """One participant attempt against a Site."""

    __tablename__: ClassVar[str] = "runs"

    run_id: RunId = Field(primary_key=True)
    site_id: SiteId = Field(foreign_key="sites.site_id")
    status: RunStatus = Field(default=RunStatus.STARTED)
    site_submission_json_gzip: bytes | None = Field(
        default=None,
        sa_column=Column(LargeBinary, nullable=True),
        description="Gzipped JSON bytes for the submitted site payload, if the Run has completed.",
    )
    is_archived: bool = False
    timestamp_created: datetime.datetime = Field(default_factory=utc_now, index=True)
