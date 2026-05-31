"""Public request and response contracts for the NodeKit deployment service."""

from uuid import UUID

import pydantic

from nodekit import Graph, SiteSubmission, Trace
from nodekit.values import MediaType, SHA256

from nodekit_server.enums import ExportFormat, RunStatus
from nodekit_server.pagination import PageQuery, PageResponse


# %% Base
class ContractModel(pydantic.BaseModel):
    """Base class for public API contracts."""

    model_config = pydantic.ConfigDict(extra="forbid")


# %% CreateTag
class TagPayload(ContractModel):
    tag_id: UUID
    user_id: UUID
    name: str
    is_archived: bool


class CreateTagRequest(ContractModel):
    name: str = pydantic.Field(min_length=1)


class CreateTagResponse(ContractModel):
    tag: TagPayload


# %% ListTags
class ListTagsFilters(ContractModel):
    tag_ids: list[UUID] | None = None
    names: list[str] | None = None
    include_archived: bool = False


class ListTagsItem(TagPayload): ...


ListTagsResponse = PageResponse[ListTagsItem]


class ListTagsQuery(PageQuery, ListTagsFilters): ...


# %% RenameTag
class RenameTagRequest(ContractModel):
    tag_id: UUID
    name: str = pydantic.Field(min_length=1)


class RenameTagResponse(ContractModel):
    tag: TagPayload


# %% ArchiveTag
class ArchiveTagRequest(ContractModel):
    tag_id: UUID


class ArchiveTagResponse(ContractModel):
    tag: TagPayload


# %% CreateGraphLink
class AssetPayload(ContractModel):
    sha256: SHA256
    media_type: MediaType
    size_bytes: int
    url: str | None = None


class GraphLinkPayload(ContractModel):
    graph_link_id: UUID
    user_id: UUID
    url: str
    tags: tuple[TagPayload, ...] = ()
    is_archived: bool


class GraphLinkDetailPayload(GraphLinkPayload):
    graph: Graph
    assets: tuple[AssetPayload, ...] = ()


class CreateGraphLinkRequest(ContractModel):
    graph: Graph
    tags: tuple[str, ...] = ()


class CreateGraphLinkResponse(ContractModel):
    graph_link: GraphLinkDetailPayload


# %% ListGraphLinks
class ListGraphLinksFilters(ContractModel):
    graph_link_ids: list[UUID] | None = None
    tags: list[str] | None = None
    include_archived: bool = False


class ListGraphLinksItem(GraphLinkPayload): ...


ListGraphLinksResponse = PageResponse[ListGraphLinksItem]


class ListGraphLinksQuery(PageQuery, ListGraphLinksFilters): ...


# %% GetGraphLink
class GetGraphLinkRequest(ContractModel):
    graph_link_id: UUID


class GetGraphLinkResponse(ContractModel):
    graph_link: GraphLinkDetailPayload


# %% ArchiveGraphLink
class ArchiveGraphLinkRequest(ContractModel):
    graph_link_id: UUID


class ArchiveGraphLinkResponse(ContractModel):
    graph_link: GraphLinkPayload


# %% AddGraphLinkTags
class AddGraphLinkTagsRequest(ContractModel):
    graph_link_id: UUID
    tags: tuple[str, ...]


class AddGraphLinkTagsResponse(ContractModel):
    graph_link: GraphLinkPayload


# %% RemoveGraphLinkTags
class RemoveGraphLinkTagsRequest(ContractModel):
    graph_link_id: UUID
    tags: tuple[str, ...]


class RemoveGraphLinkTagsResponse(ContractModel):
    graph_link: GraphLinkPayload


# %% ListRuns
class RunPayload(ContractModel):
    run_id: UUID
    graph_link_id: UUID
    status: RunStatus
    is_archived: bool


class ListRunsFilters(ContractModel):
    run_ids: list[UUID] | None = None
    graph_link_id: UUID | None = None
    statuses: list[RunStatus] | None = None
    include_archived: bool = False


class ListRunsItem(RunPayload): ...


ListRunsResponse = PageResponse[ListRunsItem]


class ListRunsQuery(PageQuery, ListRunsFilters): ...


# %% GetRun
class RunDetailPayload(RunPayload):
    site_submission: SiteSubmission | None = None


class GetRunRequest(ContractModel):
    run_id: UUID


class GetRunResponse(ContractModel):
    run: RunDetailPayload


# %% GetRunTrace
class GetRunTraceRequest(ContractModel):
    run_id: UUID


class GetRunTraceResponse(ContractModel):
    run_id: UUID
    trace: Trace


# %% ArchiveRun
class ArchiveRunRequest(ContractModel):
    run_id: UUID


class ArchiveRunResponse(ContractModel):
    run: RunPayload


# %% SubmitRun
class SubmitRunRequest(ContractModel):
    graph_link_id: UUID
    site_submission: SiteSubmission


class SubmitRunResponse(ContractModel):
    run: RunPayload


# %% ExportRuns
class ExportRunsRequest(ContractModel):
    graph_link_id: UUID | None = None
    tags: tuple[str, ...] = ()
    status: RunStatus | None = None
    format: ExportFormat = ExportFormat.JSONL


class ExportRunsResponse(ContractModel):
    export_id: UUID
    format: ExportFormat
    url: str


# %% CreateUser
class UserPayload(ContractModel):
    user_id: UUID
    username: str
    is_admin: bool
    is_archived: bool


class CreateUserRequest(ContractModel):
    username: str = pydantic.Field(min_length=1)
    is_admin: bool = False


class CreateUserResponse(ContractModel):
    user: UserPayload


# %% ListUsers
class ListUsersFilters(ContractModel):
    user_ids: list[UUID] | None = None
    usernames: list[str] | None = None
    include_archived: bool = False


class ListUsersItem(UserPayload): ...


ListUsersResponse = PageResponse[ListUsersItem]


class ListUsersQuery(PageQuery, ListUsersFilters): ...


# %% GetUser
class GetUserRequest(ContractModel):
    user_id: UUID


class GetUserResponse(ContractModel):
    user: UserPayload


# %% UpdateUser
class UpdateUserRequest(ContractModel):
    user_id: UUID
    username: str | None = pydantic.Field(default=None, min_length=1)
    is_admin: bool | None = None


class UpdateUserResponse(ContractModel):
    user: UserPayload


# %% ArchiveUser
class ArchiveUserRequest(ContractModel):
    user_id: UUID


class ArchiveUserResponse(ContractModel):
    user: UserPayload


# %% CreateApiToken
class ApiTokenPayload(ContractModel):
    api_token_id: UUID
    user_id: UUID
    name: str
    is_revoked: bool


class CreateApiTokenRequest(ContractModel):
    name: str = pydantic.Field(min_length=1)
    user_id: UUID | None = None


class CreateApiTokenResponse(ContractModel):
    api_token: ApiTokenPayload
    token: str


# %% ListApiTokens
class ListApiTokensFilters(ContractModel):
    api_token_ids: list[UUID] | None = None
    user_id: UUID | None = None
    include_revoked: bool = False


class ListApiTokensItem(ApiTokenPayload): ...


ListApiTokensResponse = PageResponse[ListApiTokensItem]


class ListApiTokensQuery(PageQuery, ListApiTokensFilters): ...


# %% RevokeApiToken
class RevokeApiTokenRequest(ContractModel):
    api_token_id: UUID


class RevokeApiTokenResponse(ContractModel):
    api_token: ApiTokenPayload
