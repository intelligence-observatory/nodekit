"""Site routes for nodekit-server."""

import gzip
from collections.abc import Iterable
from uuid import uuid4

import fastapi
import sqlmodel

from nodekit import Graph
from nodekit._internal.ops.transform_asset_locators import transform_asset_locators
from nodekit._internal.types.assets import URL
from nodekit._internal.utils.iter_assets import iter_assets
import nodekit.server.contracts as contracts
from nodekit.server.values import SiteId, UserId
from nodekit.values import MediaType, SHA256
from nodekit_server.auth import UserDep
from nodekit_server.deps import SessionDep, SettingsDep
from nodekit_server.records import (
    AssetRecord,
    SiteAssetDependencyRecord,
    SiteRecord,
    SiteTagRecord,
    TagRecord,
)
from nodekit_server.settings import ServerSettings


# %% Router
router = fastapi.APIRouter()


# %% Helpers
def _asset_key(identifier: contracts.AssetIdentifier) -> tuple[SHA256, MediaType]:
    return identifier.sha256, identifier.media_type


def _iter_unique_asset_identifiers(
    graph: Graph,
) -> tuple[contracts.AssetIdentifier, ...]:
    identifiers: list[contracts.AssetIdentifier] = []
    seen: set[tuple[str, str]] = set()
    for asset in iter_assets(graph=graph):
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


def _select_asset_records(
    session: sqlmodel.Session,
    identifiers: Iterable[contracts.AssetIdentifier],
) -> dict[tuple[SHA256, MediaType], AssetRecord]:
    records: dict[tuple[SHA256, MediaType], AssetRecord] = {}
    for identifier in identifiers:
        statement = sqlmodel.select(AssetRecord)
        statement = statement.where(AssetRecord.sha256 == identifier.sha256)
        statement = statement.where(AssetRecord.media_type == identifier.media_type)
        asset_record = session.exec(statement).one_or_none()
        if asset_record is not None:
            records[_asset_key(identifier)] = asset_record
    return records


def _asset_record_to_item(asset_record: AssetRecord) -> contracts.SiteAssetItem:
    return contracts.SiteAssetItem(
        sha256=asset_record.sha256,
        media_type=asset_record.media_type,
        size_bytes=asset_record.size_bytes,
        url=_asset_url(sha256=asset_record.sha256),
    )


def _asset_url(sha256: SHA256) -> str:
    return f"/assets/{sha256}"


def _site_url(
    request: fastapi.Request,
    settings: ServerSettings,
    site_id: SiteId,
) -> str:
    base_url = settings.public_base_url or str(request.base_url)
    return f"{base_url.rstrip('/')}/s/{site_id}"


def _gzip_graph_json(graph: Graph) -> bytes:
    return gzip.compress(graph.model_dump_json().encode("utf-8"), mtime=0)


def _get_or_create_tag(
    session: sqlmodel.Session,
    user_id: UserId,
    name: str,
) -> TagRecord:
    statement = sqlmodel.select(TagRecord)
    statement = statement.where(TagRecord.user_id == user_id)
    statement = statement.where(TagRecord.name == name)
    statement = statement.where(TagRecord.is_archived == False)  # noqa: E712
    tag_record = session.exec(statement).one_or_none()
    if tag_record is not None:
        return tag_record

    tag_record = TagRecord(
        tag_id=uuid4(),
        user_id=user_id,
        name=name,
        is_archived=False,
    )
    session.add(tag_record)
    session.flush()
    return tag_record


def _dedupe_tags(tags: Iterable[str]) -> tuple[str, ...]:
    deduped: list[str] = []
    seen: set[str] = set()
    for tag in tags:
        if tag in seen:
            continue
        seen.add(tag)
        deduped.append(tag)
    return tuple(deduped)


# %% Create Site
@router.post("/sites")
def create_site(
    request: fastapi.Request,
    create_site_request: contracts.CreateSiteRequest,
    session: SessionDep,
    user: UserDep,
    settings: SettingsDep,
) -> contracts.CreateSiteResponse:
    """Create a frozen participant-facing Site from a Graph."""

    asset_identifiers = _iter_unique_asset_identifiers(graph=create_site_request.graph)
    asset_records = _select_asset_records(session=session, identifiers=asset_identifiers)
    missing = [
        identifier
        for identifier in asset_identifiers
        if _asset_key(identifier) not in asset_records
    ]
    if missing:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail={"missing": [identifier.model_dump(mode="json") for identifier in missing]},
        )

    normalized_graph = transform_asset_locators(
        graph=create_site_request.graph,
        transform=lambda asset: URL(url=_asset_url(sha256=asset.sha256)),
    )
    site_id = uuid4()
    tags = _dedupe_tags(tags=create_site_request.tags)

    site_record = SiteRecord(
        site_id=site_id,
        user_id=user.user_id,
        graph_json_gzip=_gzip_graph_json(graph=normalized_graph),
        is_archived=False,
    )
    session.add(site_record)

    for identifier in asset_identifiers:
        session.add(
            SiteAssetDependencyRecord(
                site_id=site_id,
                sha256=identifier.sha256,
                media_type=identifier.media_type,
            )
        )

    for tag in tags:
        tag_record = _get_or_create_tag(
            session=session,
            user_id=user.user_id,
            name=tag,
        )
        session.add(
            SiteTagRecord(
                site_id=site_id,
                tag_id=tag_record.tag_id,
            )
        )

    session.commit()
    session.refresh(site_record)

    asset_items = tuple(
        _asset_record_to_item(asset_records[_asset_key(identifier)])
        for identifier in asset_identifiers
    )

    return contracts.CreateSiteResponse(
        site_id=site_record.site_id,
        user_id=site_record.user_id,
        url=_site_url(request=request, settings=settings, site_id=site_record.site_id),
        tags=tags,
        is_archived=site_record.is_archived,
        graph=normalized_graph,
        assets=asset_items,
    )
