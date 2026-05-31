"""SQLModel record models for the NodeKit deployment service."""

from typing import ClassVar

from sqlalchemy import Column, LargeBinary, String
from sqlmodel import Field, SQLModel

from nodekit.values import MediaType, SHA256

from nodekit.server.values import ApiTokenId, RunId, RunStatus, SiteId, TagId, UserId


# %%
class UserRecord(SQLModel, table=True):
    """A user who can own Sites."""

    __tablename__: ClassVar[str] = "users"

    user_id: UserId = Field(primary_key=True)
    username: str = Field(description="A display username. It does not need to be unique.")
    is_admin: bool = False
    is_archived: bool = False


# %%
class TagRecord(SQLModel, table=True):
    """A user-owned label for finding related Sites."""

    __tablename__: ClassVar[str] = "tags"

    tag_id: TagId = Field(primary_key=True)
    user_id: UserId = Field(foreign_key="users.user_id")
    name: str = Field(min_length=1)
    is_archived: bool = False


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
    is_archived: bool = False


# %%
class SiteAssetDependencyRecord(SQLModel, table=True):
    """Association between a Site and one of its stored Assets."""

    __tablename__: ClassVar[str] = "site_asset_dependencies"

    site_id: SiteId = Field(foreign_key="sites.site_id", primary_key=True)
    sha256: SHA256 = Field(sa_column=Column(String(64), primary_key=True))
    media_type: MediaType = Field(sa_column=Column(String, primary_key=True))


# %%
class SiteTagRecord(SQLModel, table=True):
    """Association between a Site and one of its Tags."""

    __tablename__: ClassVar[str] = "site_tags"

    site_id: SiteId = Field(foreign_key="sites.site_id", primary_key=True)
    tag_id: TagId = Field(foreign_key="tags.tag_id", primary_key=True)


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


# %%
class ApiTokenRecord(SQLModel, table=True):
    """A hashed API token for Python client authentication."""

    __tablename__: ClassVar[str] = "api_tokens"

    api_token_id: ApiTokenId = Field(primary_key=True)
    user_id: UserId = Field(foreign_key="users.user_id")
    name: str = Field(min_length=1)
    token_hash: str = Field(min_length=1)
    is_revoked: bool = False


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
