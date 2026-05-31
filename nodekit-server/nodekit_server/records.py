"""Pydantic record models for the NodeKit deployment service."""

from uuid import UUID

import pydantic

from nodekit import Graph, SiteSubmission
from nodekit.values import MediaType, SHA256


# %%
class UserRecord(pydantic.BaseModel):
    """A user who can own GraphLinks."""

    user_id: UUID
    username: str = pydantic.Field(description="A display username. It does not need to be unique.")
    is_admin: bool = False


# %%
class TagRecord(pydantic.BaseModel):
    """A user-owned label for finding related GraphLinks."""

    tag_id: UUID
    user: UserRecord
    name: str = pydantic.Field(min_length=1)
    is_archived: bool = False


# %%
class GraphLinkRecord(pydantic.BaseModel):
    """A frozen, participant-facing link for running a Graph."""

    graph_link_id: UUID
    user: UserRecord
    graph: Graph = pydantic.Field(
        description="The frozen Graph for this GraphLink, with server-owned Asset locators."
    )


# %%
class GraphLinkAssetDependencyRecord(pydantic.BaseModel):
    """Association between a GraphLink and one of its stored Assets."""

    graph_link_id: UUID
    sha256: SHA256
    media_type: MediaType


# %%
class GraphLinkTagRecord(pydantic.BaseModel):
    """Association between a GraphLink and one of its Tags."""

    graph_link_id: UUID
    tag_id: UUID


# %%
class StoredAssetRecord(pydantic.BaseModel):
    """Server-side record for Asset bytes stored outside the Graph."""

    sha256: SHA256
    media_type: MediaType
    size_bytes: int = pydantic.Field(ge=0)
    storage_key: str = pydantic.Field(
        min_length=1,
        description="Storage-provider key for the Asset bytes, such as an S3 key or file path.",
    )


# %%
class RunRecord(pydantic.BaseModel):
    """One participant attempt against a GraphLink."""

    run_id: UUID
    graph_link_id: UUID
    site_submission: SiteSubmission | None = pydantic.Field(
        default=None,
        description="The submitted site payload, if the Run has completed.",
    )
