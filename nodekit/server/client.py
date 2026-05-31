"""Python client for the NodeKit deployment service."""

from collections.abc import Iterable, Iterator
from typing import TypeVar

import httpx
import pydantic

from nodekit import Graph
from nodekit.assets import Asset
from nodekit._internal.ops.open_asset_save_asset import open_asset
import nodekit.server.contracts as contracts
from nodekit.server.pagination import PageResponse
from nodekit.server.values import ApiTokenId, RunId, RunStatus, SiteId, UserId


ResponseT = TypeVar("ResponseT", bound=pydantic.BaseModel)
ItemT = TypeVar("ItemT", bound=pydantic.BaseModel)
QueryParamValue = str | int | float | None


# %% Client
class Client:
    """Typed HTTP client for nodekit-server."""

    def __init__(
        self,
        api_url: str,
        api_token: str | None = None,
        timeout: float | httpx.Timeout = 30.0,
        transport: httpx.BaseTransport | None = None,
    ):
        self.api_url = api_url.rstrip("/")
        self.api_token = api_token
        self.timeout = timeout
        self.transport = transport

    def _auth_headers(self) -> dict[str, str]:
        if self.api_token is None:
            raise ValueError("api_token is required for this request.")
        return {"Authorization": f"Bearer {self.api_token}"}

    def _url(self, path: str) -> str:
        return f"{self.api_url}{path}"

    def _query_params(self, model: pydantic.BaseModel) -> tuple[tuple[str, QueryParamValue], ...]:
        data = model.model_dump(mode="json", exclude_none=True)
        params: list[tuple[str, QueryParamValue]] = []
        for key, value in data.items():
            if isinstance(value, list | tuple):
                params.extend((key, str(item)) for item in value)
            else:
                params.append((key, str(value)))
        return tuple(params)

    def _request(
        self,
        method: str,
        path: str,
        response_type: type[ResponseT],
        *,
        request: pydantic.BaseModel | None = None,
        query: pydantic.BaseModel | None = None,
        auth: bool = True,
    ) -> ResponseT:
        headers = self._auth_headers() if auth else {}
        json = request.model_dump(mode="json") if request is not None else None
        params = self._query_params(query) if query is not None else None
        with httpx.Client(timeout=self.timeout, transport=self.transport) as client:
            response = client.request(
                method=method,
                url=self._url(path),
                headers=headers,
                json=json,
                params=params,
            )
            response.raise_for_status()
            return response_type.model_validate(response.json())

    def _iterate_pages(
        self,
        path: str,
        query: contracts.ContractModel,
        response_type: type[PageResponse[ItemT]],
    ) -> Iterator[ItemT]:
        page_cursor = getattr(query, "page_cursor", None)
        while True:
            page_query = query.model_copy(update={"page_cursor": page_cursor})
            response = self._request("GET", path, response_type, query=page_query)
            yield from response.items
            page_cursor = response.next_page_cursor
            if page_cursor is None:
                break

    # %% Health
    def get_health(self) -> dict[str, str]:
        with httpx.Client(timeout=self.timeout, transport=self.transport) as client:
            response = client.get(self._url("/health"))
            response.raise_for_status()
            return response.json()

    # %% Sites
    def create_site(
        self,
        graph: Graph,
        tags: Iterable[str] = (),
    ) -> contracts.CreateSiteResponse:
        request = contracts.CreateSiteRequest(graph=graph, tags=tuple(tags))
        return self._request("POST", "/sites", contracts.CreateSiteResponse, request=request)

    def iter_sites(
        self,
        *,
        site_ids: list[SiteId] | None = None,
        tags: list[str] | None = None,
        include_archived: bool = False,
        max_items: int = 100,
    ) -> Iterator[contracts.ListSitesItem]:
        query = contracts.ListSitesQuery(
            site_ids=site_ids,
            tags=tags,
            include_archived=include_archived,
            max_items=max_items,
        )
        yield from self._iterate_pages("/sites", query, contracts.ListSitesResponse)

    def get_site(self, site_id: SiteId) -> contracts.GetSiteResponse:
        return self._request("GET", f"/sites/{site_id}", contracts.GetSiteResponse)

    def archive_site(self, site_id: SiteId) -> contracts.ArchiveSiteResponse:
        request = contracts.ArchiveSiteRequest(site_id=site_id)
        return self._request(
            "POST",
            f"/sites/{site_id}/archive",
            contracts.ArchiveSiteResponse,
            request=request,
        )

    def add_site_tags(self, site_id: SiteId, tags: Iterable[str]) -> contracts.AddSiteTagsResponse:
        request = contracts.AddSiteTagsRequest(site_id=site_id, tags=tuple(tags))
        return self._request(
            "POST",
            f"/sites/{site_id}/tags",
            contracts.AddSiteTagsResponse,
            request=request,
        )

    def remove_site_tags(
        self,
        site_id: SiteId,
        tags: Iterable[str],
    ) -> contracts.RemoveSiteTagsResponse:
        request = contracts.RemoveSiteTagsRequest(site_id=site_id, tags=tuple(tags))
        return self._request(
            "POST",
            f"/sites/{site_id}/tags/remove",
            contracts.RemoveSiteTagsResponse,
            request=request,
        )

    # %% Tags
    def create_tag(self, name: str) -> contracts.CreateTagResponse:
        request = contracts.CreateTagRequest(name=name)
        return self._request("POST", "/tags", contracts.CreateTagResponse, request=request)

    def iter_tags(
        self,
        *,
        names: list[str] | None = None,
        include_archived: bool = False,
        max_items: int = 100,
    ) -> Iterator[contracts.ListTagsItem]:
        query = contracts.ListTagsQuery(
            names=names,
            include_archived=include_archived,
            max_items=max_items,
        )
        yield from self._iterate_pages("/tags", query, contracts.ListTagsResponse)

    def rename_tag(self, name: str, new_name: str) -> contracts.RenameTagResponse:
        request = contracts.RenameTagRequest(name=name, new_name=new_name)
        return self._request(
            "POST",
            "/tags/rename",
            contracts.RenameTagResponse,
            request=request,
        )

    def archive_tag(self, name: str) -> contracts.ArchiveTagResponse:
        request = contracts.ArchiveTagRequest(name=name)
        return self._request(
            "POST",
            "/tags/archive",
            contracts.ArchiveTagResponse,
            request=request,
        )

    # %% Assets
    def check_assets(
        self,
        assets: Iterable[Asset | contracts.AssetIdentifier],
    ) -> contracts.CheckAssetsResponse:
        identifiers = self._deduplicate_asset_identifiers(assets=assets)
        request = contracts.CheckAssetsRequest(assets=identifiers)
        return self._request(
            "POST",
            "/assets/check",
            contracts.CheckAssetsResponse,
            request=request,
        )

    def upload_asset(self, asset: Asset) -> contracts.UploadAssetResponse:
        headers = self._auth_headers()
        data = {
            "sha256": asset.sha256,
            "media_type": asset.media_type,
        }
        with open_asset(asset) as file:
            files = {
                "file": (
                    str(asset.sha256),
                    file,
                    str(asset.media_type),
                )
            }
            with httpx.Client(timeout=self.timeout, transport=self.transport) as client:
                response = client.post(
                    url=self._url("/assets"),
                    headers=headers,
                    data=data,
                    files=files,
                )
                response.raise_for_status()
                return contracts.UploadAssetResponse.model_validate(response.json())

    def _deduplicate_asset_identifiers(
        self,
        assets: Iterable[Asset | contracts.AssetIdentifier],
    ) -> tuple[contracts.AssetIdentifier, ...]:
        identifiers: list[contracts.AssetIdentifier] = []
        seen: set[tuple[str, str]] = set()
        for asset in assets:
            identifier = contracts.AssetIdentifier(
                sha256=asset.sha256,
                media_type=asset.media_type,
            )
            key = (str(identifier.sha256), str(identifier.media_type))
            if key in seen:
                continue
            seen.add(key)
            identifiers.append(identifier)
        return tuple(identifiers)

    # %% Runs
    def iter_runs(
        self,
        *,
        run_ids: list[RunId] | None = None,
        site_id: SiteId | None = None,
        statuses: list[RunStatus] | None = None,
        include_archived: bool = False,
        max_items: int = 100,
    ) -> Iterator[contracts.ListRunsItem]:
        query = contracts.ListRunsQuery(
            run_ids=run_ids,
            site_id=site_id,
            statuses=statuses,
            include_archived=include_archived,
            max_items=max_items,
        )
        yield from self._iterate_pages("/runs", query, contracts.ListRunsResponse)

    def get_run(self, run_id: RunId) -> contracts.GetRunResponse:
        return self._request("GET", f"/runs/{run_id}", contracts.GetRunResponse)

    def archive_run(self, run_id: RunId) -> contracts.ArchiveRunResponse:
        request = contracts.ArchiveRunRequest(run_id=run_id)
        return self._request(
            "POST",
            f"/runs/{run_id}/archive",
            contracts.ArchiveRunResponse,
            request=request,
        )


# %% AdminClient
class AdminClient(Client):
    """Typed HTTP client for nodekit-server administration."""

    # %% Users
    def create_user(self, username: str, is_admin: bool = False) -> contracts.CreateUserResponse:
        request = contracts.CreateUserRequest(username=username, is_admin=is_admin)
        return self._request("POST", "/admin/users", contracts.CreateUserResponse, request=request)

    def iter_users(
        self,
        *,
        user_ids: list[UserId] | None = None,
        usernames: list[str] | None = None,
        include_archived: bool = False,
        max_items: int = 100,
    ) -> Iterator[contracts.ListUsersItem]:
        query = contracts.ListUsersQuery(
            user_ids=user_ids,
            usernames=usernames,
            include_archived=include_archived,
            max_items=max_items,
        )
        yield from self._iterate_pages("/admin/users", query, contracts.ListUsersResponse)

    def get_user(self, user_id: UserId) -> contracts.GetUserResponse:
        return self._request("GET", f"/admin/users/{user_id}", contracts.GetUserResponse)

    def update_user(
        self,
        user_id: UserId,
        *,
        username: str | None = None,
        is_admin: bool | None = None,
    ) -> contracts.UpdateUserResponse:
        request = contracts.UpdateUserRequest(user_id=user_id, username=username, is_admin=is_admin)
        return self._request(
            "POST",
            f"/admin/users/{user_id}",
            contracts.UpdateUserResponse,
            request=request,
        )

    def archive_user(self, user_id: UserId) -> contracts.ArchiveUserResponse:
        request = contracts.ArchiveUserRequest(user_id=user_id)
        return self._request(
            "POST",
            f"/admin/users/{user_id}/archive",
            contracts.ArchiveUserResponse,
            request=request,
        )

    # %% API Tokens
    def create_api_token(
        self,
        name: str,
        user_id: UserId | None = None,
    ) -> contracts.CreateApiTokenResponse:
        request = contracts.CreateApiTokenRequest(name=name, user_id=user_id)
        return self._request(
            "POST",
            "/admin/api-tokens",
            contracts.CreateApiTokenResponse,
            request=request,
        )

    def iter_api_tokens(
        self,
        *,
        api_token_ids: list[ApiTokenId] | None = None,
        user_id: UserId | None = None,
        include_revoked: bool = False,
        max_items: int = 100,
    ) -> Iterator[contracts.ListApiTokensItem]:
        query = contracts.ListApiTokensQuery(
            api_token_ids=api_token_ids,
            user_id=user_id,
            include_revoked=include_revoked,
            max_items=max_items,
        )
        yield from self._iterate_pages(
            "/admin/api-tokens",
            query,
            contracts.ListApiTokensResponse,
        )

    def revoke_api_token(self, api_token_id: ApiTokenId) -> contracts.RevokeApiTokenResponse:
        request = contracts.RevokeApiTokenRequest(api_token_id=api_token_id)
        return self._request(
            "POST",
            f"/admin/api-tokens/{api_token_id}/revoke",
            contracts.RevokeApiTokenResponse,
            request=request,
        )
