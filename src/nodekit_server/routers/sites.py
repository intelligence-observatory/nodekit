"""Site routes for nodekit-server."""

import base64
import gzip
from collections.abc import Iterable
from typing import Annotated
from uuid import uuid4

import fastapi
import sqlmodel

from nodekit import Graph
from nodekit._internal.ops.transform_asset_locators import transform_asset_locators
from nodekit._internal.types.assets import URL
from nodekit._internal.utils.iter_assets import iter_assets
import nodekit.server.contracts as contracts
from nodekit.server.values import SiteConditionId, SiteId, UserId
from nodekit.values import MediaType, SHA256
from nodekit_server.auth import UserDep
from nodekit_server.deps import SessionDep, SettingsDep, SiteArtifactStoreDep
from nodekit_server.pagination import apply_timestamp_id_page_cursor, page_records
from nodekit_server.records import (
    AssetRecord,
    SiteAssetDependencyRecord,
    SiteConditionRecord,
    SiteRecord,
    SiteTagRecord,
    TagRecord,
    as_utc,
)
from nodekit_server.settings import ServerSettings
from nodekit_server.site_artifacts import publish_site_artifacts


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


def _dedupe_asset_identifiers(
    identifiers: Iterable[contracts.AssetIdentifier],
) -> tuple[contracts.AssetIdentifier, ...]:
    deduped: list[contracts.AssetIdentifier] = []
    seen: set[tuple[str, str]] = set()
    for identifier in identifiers:
        key = (str(identifier.sha256), str(identifier.media_type))
        if key in seen:
            continue
        seen.add(key)
        deduped.append(identifier)
    return tuple(deduped)


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
        timestamp_created=as_utc(asset_record.timestamp_created),
    )


def _asset_url(sha256: SHA256) -> str:
    return f"/assets/{sha256}"


def _public_asset_url(
    request: fastapi.Request,
    settings: ServerSettings,
    sha256: SHA256,
) -> str:
    base_url = settings.public_base_url or str(request.base_url)
    return f"{base_url.rstrip('/')}/assets/{sha256}"


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


def _get_site_record_for_user(
    session: sqlmodel.Session,
    user_id: UserId,
    site_id: SiteId,
) -> SiteRecord:
    site_record = session.get(SiteRecord, site_id)
    if site_record is None or site_record.user_id != user_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="Site not found.",
        )
    return site_record


def _ensure_path_body_site_match(path_site_id: SiteId, body_site_id: SiteId) -> None:
    if path_site_id != body_site_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Path site_id does not match request body site_id.",
        )


def _get_site_tags(
    session: sqlmodel.Session,
    user_id: UserId,
    site_id: SiteId,
) -> tuple[str, ...]:
    statement = sqlmodel.select(TagRecord.name)
    statement = statement.join(
        SiteTagRecord,
        sqlmodel.col(TagRecord.tag_id) == sqlmodel.col(SiteTagRecord.tag_id),
    )
    statement = statement.where(sqlmodel.col(SiteTagRecord.site_id) == site_id)
    statement = statement.where(sqlmodel.col(TagRecord.user_id) == user_id)
    statement = statement.where(sqlmodel.col(TagRecord.is_archived) == False)  # noqa: E712
    statement = statement.order_by(
        sqlmodel.col(SiteTagRecord.timestamp_created),
        sqlmodel.col(TagRecord.name),
    )
    return tuple(session.exec(statement).all())


def _get_site_condition_records(
    session: sqlmodel.Session,
    site_id: SiteId,
) -> tuple[SiteConditionRecord, ...]:
    statement = sqlmodel.select(SiteConditionRecord)
    statement = statement.where(sqlmodel.col(SiteConditionRecord.site_id) == site_id)
    statement = statement.order_by(
        sqlmodel.col(SiteConditionRecord.timestamp_created),
        sqlmodel.col(SiteConditionRecord.condition_id),
    )
    return tuple(session.exec(statement).all())


def _get_condition_asset_items(
    session: sqlmodel.Session,
    site_id: SiteId,
    condition_id: SiteConditionId,
) -> tuple[contracts.SiteAssetItem, ...]:
    statement = sqlmodel.select(SiteAssetDependencyRecord)
    statement = statement.where(sqlmodel.col(SiteAssetDependencyRecord.site_id) == site_id)
    statement = statement.where(
        sqlmodel.col(SiteAssetDependencyRecord.condition_id) == condition_id
    )
    statement = statement.order_by(
        sqlmodel.col(SiteAssetDependencyRecord.timestamp_created),
        sqlmodel.col(SiteAssetDependencyRecord.sha256),
        sqlmodel.col(SiteAssetDependencyRecord.media_type),
    )
    dependency_records = session.exec(statement).all()

    items: list[contracts.SiteAssetItem] = []
    for dependency_record in dependency_records:
        identifier = contracts.AssetIdentifier(
            sha256=dependency_record.sha256,
            media_type=dependency_record.media_type,
        )
        asset_records = _select_asset_records(session=session, identifiers=(identifier,))
        asset_record = asset_records.get(_asset_key(identifier))
        if asset_record is not None:
            items.append(_asset_record_to_item(asset_record))
    return tuple(items)


def _site_condition_item(
    condition_record: SiteConditionRecord,
) -> contracts.SiteConditionItem:
    return contracts.SiteConditionItem(
        condition_id=condition_record.condition_id,
        allocation_weight=condition_record.allocation_weight,
    )


def _site_condition_detail_item(
    session: sqlmodel.Session,
    condition_record: SiteConditionRecord,
) -> contracts.SiteConditionDetailItem:
    return contracts.SiteConditionDetailItem(
        condition_id=condition_record.condition_id,
        allocation_weight=condition_record.allocation_weight,
        graph_json_gzip=base64.b64encode(condition_record.graph_json_gzip).decode("ascii"),
        assets=_get_condition_asset_items(
            session=session,
            site_id=condition_record.site_id,
            condition_id=condition_record.condition_id,
        ),
    )


def _get_site_condition_items(
    session: sqlmodel.Session,
    site_id: SiteId,
) -> tuple[contracts.SiteConditionItem, ...]:
    return tuple(
        _site_condition_item(condition_record)
        for condition_record in _get_site_condition_records(session=session, site_id=site_id)
    )


def _site_list_item(
    request: fastapi.Request,
    settings: ServerSettings,
    session: sqlmodel.Session,
    user_id: UserId,
    site_record: SiteRecord,
) -> contracts.ListSitesItem:
    return contracts.ListSitesItem(
        site_id=site_record.site_id,
        user_id=site_record.user_id,
        url=_site_url(request=request, settings=settings, site_id=site_record.site_id),
        conditions=_get_site_condition_items(session=session, site_id=site_record.site_id),
        tags=_get_site_tags(session=session, user_id=user_id, site_id=site_record.site_id),
        is_archived=site_record.is_archived,
        timestamp_created=as_utc(site_record.timestamp_created),
    )


def _site_detail_response(
    request: fastapi.Request,
    settings: ServerSettings,
    session: sqlmodel.Session,
    user_id: UserId,
    site_record: SiteRecord,
) -> contracts.GetSiteResponse:
    return contracts.GetSiteResponse(
        site_id=site_record.site_id,
        user_id=site_record.user_id,
        url=_site_url(request=request, settings=settings, site_id=site_record.site_id),
        conditions=tuple(
            _site_condition_detail_item(session=session, condition_record=condition_record)
            for condition_record in _get_site_condition_records(
                session=session,
                site_id=site_record.site_id,
            )
        ),
        tags=_get_site_tags(session=session, user_id=user_id, site_id=site_record.site_id),
        is_archived=site_record.is_archived,
        timestamp_created=as_utc(site_record.timestamp_created),
    )


def _site_mutation_response(
    request: fastapi.Request,
    settings: ServerSettings,
    session: sqlmodel.Session,
    user_id: UserId,
    site_record: SiteRecord,
) -> dict[str, object]:
    return {
        "site_id": site_record.site_id,
        "user_id": site_record.user_id,
        "url": _site_url(request=request, settings=settings, site_id=site_record.site_id),
        "conditions": _get_site_condition_items(session=session, site_id=site_record.site_id),
        "tags": _get_site_tags(session=session, user_id=user_id, site_id=site_record.site_id),
        "is_archived": site_record.is_archived,
        "timestamp_created": as_utc(site_record.timestamp_created),
    }


def _tag_site_id_subquery(
    user_id: UserId,
    tag_name: str,
):
    statement = sqlmodel.select(SiteTagRecord.site_id)
    statement = statement.join(
        TagRecord,
        sqlmodel.col(SiteTagRecord.tag_id) == sqlmodel.col(TagRecord.tag_id),
    )
    statement = statement.where(sqlmodel.col(TagRecord.user_id) == user_id)
    statement = statement.where(sqlmodel.col(TagRecord.name) == tag_name)
    statement = statement.where(sqlmodel.col(TagRecord.is_archived) == False)  # noqa: E712
    return statement


# %% Create Site
@router.post("/sites")
def create_site(
    request: fastapi.Request,
    create_site_request: contracts.CreateSiteRequest,
    session: SessionDep,
    user: UserDep,
    settings: SettingsDep,
    site_artifact_store: SiteArtifactStoreDep,
) -> contracts.CreateSiteResponse:
    """Create a frozen participant-facing Site from one or more Conditions."""

    condition_asset_identifiers = {
        condition_id: _iter_unique_asset_identifiers(graph=condition.graph)
        for condition_id, condition in create_site_request.conditions.items()
    }
    all_asset_identifiers = _dedupe_asset_identifiers(
        identifier
        for identifiers in condition_asset_identifiers.values()
        for identifier in identifiers
    )
    asset_records = _select_asset_records(session=session, identifiers=all_asset_identifiers)
    missing = [
        identifier
        for identifier in all_asset_identifiers
        if _asset_key(identifier) not in asset_records
    ]
    if missing:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail={"missing": [identifier.model_dump(mode="json") for identifier in missing]},
        )

    normalized_conditions = {
        condition_id: condition.model_copy(
            update={
                "graph": transform_asset_locators(
                    graph=condition.graph,
                    transform=lambda asset: URL(
                        url=_public_asset_url(
                            request=request,
                            settings=settings,
                            sha256=asset.sha256,
                        )
                    ),
                )
            }
        )
        for condition_id, condition in create_site_request.conditions.items()
    }
    site_id = uuid4()
    tags = _dedupe_tags(tags=create_site_request.tags)

    site_record = SiteRecord(
        site_id=site_id,
        user_id=user.user_id,
        is_archived=False,
    )
    session.add(site_record)
    session.flush()

    for condition_id, condition in normalized_conditions.items():
        published_artifacts = publish_site_artifacts(
            site_id=site_id,
            condition_id=condition_id,
            graph=condition.graph,
            store=site_artifact_store,
        )
        condition_record = SiteConditionRecord(
            site_id=site_id,
            condition_id=condition_id,
            allocation_weight=condition.allocation_weight,
            graph_json_gzip=_gzip_graph_json(graph=condition.graph),
            site_artifact_storage_key=published_artifacts.site_artifact_storage_key,
            site_artifact_url=published_artifacts.site_artifact_url,
            runtime_js_storage_key=published_artifacts.runtime_js_storage_key,
            runtime_css_storage_key=published_artifacts.runtime_css_storage_key,
            runtime_js_sha256=published_artifacts.runtime_js_sha256,
            runtime_css_sha256=published_artifacts.runtime_css_sha256,
            frozen_nodekit_version=published_artifacts.frozen_nodekit_version,
            site_hosting_backend=settings.site_hosting_backend,
        )
        session.add(condition_record)

        for identifier in condition_asset_identifiers[condition_id]:
            session.add(
                SiteAssetDependencyRecord(
                    site_id=site_id,
                    condition_id=condition_id,
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

    return contracts.CreateSiteResponse(
        site_id=site_record.site_id,
        url=_site_url(request=request, settings=settings, site_id=site_record.site_id),
    )


# %% List Sites
@router.get("/sites")
def list_sites(
    request: fastapi.Request,
    query: Annotated[contracts.ListSitesQuery, fastapi.Query()],
    session: SessionDep,
    user: UserDep,
    settings: SettingsDep,
) -> contracts.ListSitesResponse:
    """List Sites owned by the current user."""

    statement = sqlmodel.select(SiteRecord)
    statement = statement.where(SiteRecord.user_id == user.user_id)

    if query.site_ids is not None:
        statement = statement.where(sqlmodel.col(SiteRecord.site_id).in_(query.site_ids))
    if not query.include_archived:
        statement = statement.where(SiteRecord.is_archived == False)  # noqa: E712

    for tag_name in _dedupe_tags(query.tags or ()):
        statement = statement.where(
            sqlmodel.col(SiteRecord.site_id).in_(_tag_site_id_subquery(user.user_id, tag_name))
        )

    if query.page_cursor is not None:
        statement = apply_timestamp_id_page_cursor(
            statement=statement,
            page_cursor=query.page_cursor,
            timestamp_column=SiteRecord.timestamp_created,
            id_column=SiteRecord.site_id,
        )

    statement = statement.order_by(
        sqlmodel.col(SiteRecord.timestamp_created).desc(),
        sqlmodel.col(SiteRecord.site_id).desc(),
    )
    statement = statement.limit(query.max_items + 1)
    site_records = session.exec(statement).all()
    records_page, next_page_cursor = page_records(
        records=list(site_records),
        max_items=query.max_items,
        timestamp_attr="timestamp_created",
        id_attr="site_id",
    )

    items = [
        _site_list_item(
            request=request,
            settings=settings,
            session=session,
            user_id=user.user_id,
            site_record=site_record,
        )
        for site_record in records_page
    ]

    return contracts.ListSitesResponse(
        items=items,
        next_page_cursor=next_page_cursor,
    )


# %% Get Site
@router.get("/sites/{site_id}")
def get_site(
    request: fastapi.Request,
    site_id: SiteId,
    session: SessionDep,
    user: UserDep,
    settings: SettingsDep,
) -> contracts.GetSiteResponse:
    """Return one Site owned by the current user."""

    site_record = _get_site_record_for_user(
        session=session,
        user_id=user.user_id,
        site_id=site_id,
    )
    return _site_detail_response(
        request=request,
        settings=settings,
        session=session,
        user_id=user.user_id,
        site_record=site_record,
    )


# %% Archive Site
@router.post("/sites/{site_id}/archive")
def archive_site(
    request: fastapi.Request,
    site_id: SiteId,
    archive_site_request: contracts.ArchiveSiteRequest,
    session: SessionDep,
    user: UserDep,
    settings: SettingsDep,
) -> contracts.ArchiveSiteResponse:
    """Archive one Site owned by the current user."""

    _ensure_path_body_site_match(
        path_site_id=site_id,
        body_site_id=archive_site_request.site_id,
    )
    site_record = _get_site_record_for_user(
        session=session,
        user_id=user.user_id,
        site_id=site_id,
    )
    site_record.is_archived = True
    session.add(site_record)
    session.commit()
    session.refresh(site_record)
    return contracts.ArchiveSiteResponse.model_validate(
        _site_mutation_response(
            request=request,
            settings=settings,
            session=session,
            user_id=user.user_id,
            site_record=site_record,
        )
    )


# %% Add Site Tags
@router.post("/sites/{site_id}/tags")
def add_site_tags(
    request: fastapi.Request,
    site_id: SiteId,
    add_site_tags_request: contracts.AddSiteTagsRequest,
    session: SessionDep,
    user: UserDep,
    settings: SettingsDep,
) -> contracts.AddSiteTagsResponse:
    """Attach user-scoped Tags to a Site."""

    _ensure_path_body_site_match(
        path_site_id=site_id,
        body_site_id=add_site_tags_request.site_id,
    )
    site_record = _get_site_record_for_user(
        session=session,
        user_id=user.user_id,
        site_id=site_id,
    )

    for tag in _dedupe_tags(add_site_tags_request.tags):
        tag_record = _get_or_create_tag(session=session, user_id=user.user_id, name=tag)
        existing_statement = sqlmodel.select(SiteTagRecord)
        existing_statement = existing_statement.where(SiteTagRecord.site_id == site_id)
        existing_statement = existing_statement.where(SiteTagRecord.tag_id == tag_record.tag_id)
        if session.exec(existing_statement).one_or_none() is None:
            session.add(SiteTagRecord(site_id=site_id, tag_id=tag_record.tag_id))

    session.commit()
    session.refresh(site_record)
    return contracts.AddSiteTagsResponse.model_validate(
        _site_mutation_response(
            request=request,
            settings=settings,
            session=session,
            user_id=user.user_id,
            site_record=site_record,
        )
    )


# %% Remove Site Tags
@router.post("/sites/{site_id}/tags/remove")
def remove_site_tags(
    request: fastapi.Request,
    site_id: SiteId,
    remove_site_tags_request: contracts.RemoveSiteTagsRequest,
    session: SessionDep,
    user: UserDep,
    settings: SettingsDep,
) -> contracts.RemoveSiteTagsResponse:
    """Detach user-scoped Tags from a Site."""

    _ensure_path_body_site_match(
        path_site_id=site_id,
        body_site_id=remove_site_tags_request.site_id,
    )
    site_record = _get_site_record_for_user(
        session=session,
        user_id=user.user_id,
        site_id=site_id,
    )

    for tag in _dedupe_tags(remove_site_tags_request.tags):
        statement = sqlmodel.select(SiteTagRecord)
        statement = statement.join(
            TagRecord,
            sqlmodel.col(SiteTagRecord.tag_id) == sqlmodel.col(TagRecord.tag_id),
        )
        statement = statement.where(sqlmodel.col(SiteTagRecord.site_id) == site_id)
        statement = statement.where(sqlmodel.col(TagRecord.user_id) == user.user_id)
        statement = statement.where(sqlmodel.col(TagRecord.name) == tag)
        site_tag_record = session.exec(statement).one_or_none()
        if site_tag_record is not None:
            session.delete(site_tag_record)

    session.commit()
    session.refresh(site_record)
    return contracts.RemoveSiteTagsResponse.model_validate(
        _site_mutation_response(
            request=request,
            settings=settings,
            session=session,
            user_id=user.user_id,
            site_record=site_record,
        )
    )
