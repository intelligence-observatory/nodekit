"""Public request and response contracts for the NodeKit server/client API."""

import pydantic

from nodekit import Graph, SiteSubmission, Trace
from nodekit.values import MediaType, SHA256

from nodekit.server.pagination import PageQuery, PageResponse
from nodekit.server.values import ApiTokenId, RunId, RunStatus, SiteId, UserId


# %% Base
class ContractModel(pydantic.BaseModel):
    """Base class for public API contracts."""

    model_config = pydantic.ConfigDict(extra="forbid")


# %% CreateTag
class CreateTagRequest(ContractModel):
    name: str = pydantic.Field(min_length=1)


class CreateTagResponse(ContractModel):
    name: str
    is_archived: bool


# %% ListTags
class ListTagsFilters(ContractModel):
    names: list[str] | None = None
    include_archived: bool = False


class ListTagsItem(ContractModel):
    name: str
    is_archived: bool


ListTagsResponse = PageResponse[ListTagsItem]


class ListTagsQuery(PageQuery, ListTagsFilters): ...


# %% RenameTag
class RenameTagRequest(ContractModel):
    name: str = pydantic.Field(min_length=1)
    new_name: str = pydantic.Field(min_length=1)


class RenameTagResponse(ContractModel):
    name: str
    is_archived: bool


# %% ArchiveTag
class ArchiveTagRequest(ContractModel):
    name: str = pydantic.Field(min_length=1)


class ArchiveTagResponse(ContractModel):
    name: str
    is_archived: bool


# %% CreateSite
class CreateSiteRequest(ContractModel):
    graph: Graph
    tags: tuple[str, ...] = ()


class SiteAssetItem(ContractModel):
    sha256: SHA256
    media_type: MediaType
    size_bytes: int
    url: str | None = None


class CreateSiteResponse(ContractModel):
    site_id: SiteId
    user_id: UserId
    url: str
    tags: tuple[str, ...] = ()
    is_archived: bool
    graph: Graph
    assets: tuple[SiteAssetItem, ...] = ()


# %% ListSites
class ListSitesFilters(ContractModel):
    site_ids: list[SiteId] | None = None
    tags: list[str] | None = None
    include_archived: bool = False


class ListSitesItem(ContractModel):
    site_id: SiteId
    user_id: UserId
    url: str
    tags: tuple[str, ...] = ()
    is_archived: bool


ListSitesResponse = PageResponse[ListSitesItem]


class ListSitesQuery(PageQuery, ListSitesFilters): ...


# %% GetSite
class GetSiteRequest(ContractModel):
    site_id: SiteId


class GetSiteResponse(ContractModel):
    site_id: SiteId
    user_id: UserId
    url: str
    tags: tuple[str, ...] = ()
    is_archived: bool
    graph: Graph
    assets: tuple[SiteAssetItem, ...] = ()


# %% ArchiveSite
class ArchiveSiteRequest(ContractModel):
    site_id: SiteId


class ArchiveSiteResponse(ContractModel):
    site_id: SiteId
    user_id: UserId
    url: str
    tags: tuple[str, ...] = ()
    is_archived: bool


# %% AddSiteTags
class AddSiteTagsRequest(ContractModel):
    site_id: SiteId
    tags: tuple[str, ...]


class AddSiteTagsResponse(ContractModel):
    site_id: SiteId
    user_id: UserId
    url: str
    tags: tuple[str, ...] = ()
    is_archived: bool


# %% RemoveSiteTags
class RemoveSiteTagsRequest(ContractModel):
    site_id: SiteId
    tags: tuple[str, ...]


class RemoveSiteTagsResponse(ContractModel):
    site_id: SiteId
    user_id: UserId
    url: str
    tags: tuple[str, ...] = ()
    is_archived: bool


# %% ListRuns
class ListRunsFilters(ContractModel):
    run_ids: list[RunId] | None = None
    site_id: SiteId | None = None
    statuses: list[RunStatus] | None = None
    include_archived: bool = False


class ListRunsItem(ContractModel):
    run_id: RunId
    site_id: SiteId
    status: RunStatus
    is_archived: bool


ListRunsResponse = PageResponse[ListRunsItem]


class ListRunsQuery(PageQuery, ListRunsFilters): ...


# %% GetRun
class GetRunRequest(ContractModel):
    run_id: RunId


class GetRunResponse(ContractModel):
    run_id: RunId
    site_id: SiteId
    status: RunStatus
    is_archived: bool
    site_submission: SiteSubmission | None = None
    trace: Trace | None = None


# %% ArchiveRun
class ArchiveRunRequest(ContractModel):
    run_id: RunId


class ArchiveRunResponse(ContractModel):
    run_id: RunId
    site_id: SiteId
    status: RunStatus
    is_archived: bool


# %% SubmitRun
class SubmitRunRequest(ContractModel):
    site_id: SiteId
    site_submission: SiteSubmission


class SubmitRunResponse(ContractModel):
    run_id: RunId
    site_id: SiteId
    status: RunStatus
    is_archived: bool


# %% CreateUser
class CreateUserRequest(ContractModel):
    username: str = pydantic.Field(min_length=1)
    is_admin: bool = False


class CreateUserResponse(ContractModel):
    user_id: UserId
    username: str
    is_admin: bool
    is_archived: bool


# %% ListUsers
class ListUsersFilters(ContractModel):
    user_ids: list[UserId] | None = None
    usernames: list[str] | None = None
    include_archived: bool = False


class ListUsersItem(ContractModel):
    user_id: UserId
    username: str
    is_admin: bool
    is_archived: bool


ListUsersResponse = PageResponse[ListUsersItem]


class ListUsersQuery(PageQuery, ListUsersFilters): ...


# %% GetUser
class GetUserRequest(ContractModel):
    user_id: UserId


class GetUserResponse(ContractModel):
    user_id: UserId
    username: str
    is_admin: bool
    is_archived: bool


# %% UpdateUser
class UpdateUserRequest(ContractModel):
    user_id: UserId
    username: str | None = pydantic.Field(default=None, min_length=1)
    is_admin: bool | None = None


class UpdateUserResponse(ContractModel):
    user_id: UserId
    username: str
    is_admin: bool
    is_archived: bool


# %% ArchiveUser
class ArchiveUserRequest(ContractModel):
    user_id: UserId


class ArchiveUserResponse(ContractModel):
    user_id: UserId
    username: str
    is_admin: bool
    is_archived: bool


# %% CreateApiToken
class CreateApiTokenRequest(ContractModel):
    name: str = pydantic.Field(min_length=1)
    user_id: UserId | None = None


class CreateApiTokenResponse(ContractModel):
    api_token_id: ApiTokenId
    user_id: UserId
    name: str
    is_revoked: bool
    token: str


# %% ListApiTokens
class ListApiTokensFilters(ContractModel):
    api_token_ids: list[ApiTokenId] | None = None
    user_id: UserId | None = None
    include_revoked: bool = False


class ListApiTokensItem(ContractModel):
    api_token_id: ApiTokenId
    user_id: UserId
    name: str
    is_revoked: bool


ListApiTokensResponse = PageResponse[ListApiTokensItem]


class ListApiTokensQuery(PageQuery, ListApiTokensFilters): ...


# %% RevokeApiToken
class RevokeApiTokenRequest(ContractModel):
    api_token_id: ApiTokenId


class RevokeApiTokenResponse(ContractModel):
    api_token_id: ApiTokenId
    user_id: UserId
    name: str
    is_revoked: bool
