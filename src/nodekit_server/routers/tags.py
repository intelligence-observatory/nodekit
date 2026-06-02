"""Tag routes for nodekit-server."""

from typing import Annotated
from uuid import uuid4

import fastapi
import sqlmodel

import nodekit.server.contracts as contracts
from nodekit.server.values import UserId
from nodekit_server.auth import UserDep
from nodekit_server.deps import SessionDep
from nodekit_server.pagination import apply_timestamp_id_page_cursor, page_records
from nodekit_server.records import TagRecord, as_utc


# %% Router
router = fastapi.APIRouter()


# %% Helpers
def _tag_item(tag_record: TagRecord) -> contracts.ListTagsItem:
    return contracts.ListTagsItem(
        name=tag_record.name,
        is_archived=tag_record.is_archived,
        timestamp_created=as_utc(tag_record.timestamp_created),
    )


def _tag_mutation_response(tag_record: TagRecord) -> dict[str, object]:
    return {
        "name": tag_record.name,
        "is_archived": tag_record.is_archived,
        "timestamp_created": as_utc(tag_record.timestamp_created),
    }


def _get_active_tag(
    session: sqlmodel.Session,
    user_id: UserId,
    name: str,
) -> TagRecord | None:
    statement = sqlmodel.select(TagRecord)
    statement = statement.where(sqlmodel.col(TagRecord.user_id) == user_id)
    statement = statement.where(sqlmodel.col(TagRecord.name) == name)
    statement = statement.where(sqlmodel.col(TagRecord.is_archived) == False)  # noqa: E712
    return session.exec(statement).one_or_none()


def _require_active_tag(
    session: sqlmodel.Session,
    user_id: UserId,
    name: str,
) -> TagRecord:
    tag_record = _get_active_tag(session=session, user_id=user_id, name=name)
    if tag_record is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="Tag not found.",
        )
    return tag_record


def _dedupe_names(names: list[str] | None) -> tuple[str, ...]:
    if names is None:
        return ()

    deduped: list[str] = []
    seen: set[str] = set()
    for name in names:
        if name in seen:
            continue
        seen.add(name)
        deduped.append(name)
    return tuple(deduped)


def _create_tag_record(
    session: sqlmodel.Session,
    user_id: UserId,
    name: str,
) -> TagRecord:
    tag_record = TagRecord(
        tag_id=uuid4(),
        user_id=user_id,
        name=name,
        is_archived=False,
    )
    session.add(tag_record)
    session.commit()
    session.refresh(tag_record)
    return tag_record


# %% Create Tag
@router.post("/tags")
def create_tag(
    request: contracts.CreateTagRequest,
    session: SessionDep,
    user: UserDep,
) -> contracts.CreateTagResponse:
    """Create an active Tag for the current user."""

    tag_record = _get_active_tag(
        session=session,
        user_id=user.user_id,
        name=request.name,
    )
    if tag_record is None:
        tag_record = _create_tag_record(
            session=session,
            user_id=user.user_id,
            name=request.name,
        )

    return contracts.CreateTagResponse.model_validate(_tag_mutation_response(tag_record))


# %% List Tags
@router.get("/tags")
def list_tags(
    query: Annotated[contracts.ListTagsQuery, fastapi.Query()],
    session: SessionDep,
    user: UserDep,
) -> contracts.ListTagsResponse:
    """List Tags owned by the current user."""

    statement = sqlmodel.select(TagRecord)
    statement = statement.where(sqlmodel.col(TagRecord.user_id) == user.user_id)

    names = _dedupe_names(query.names)
    if names:
        statement = statement.where(sqlmodel.col(TagRecord.name).in_(names))
    if not query.include_archived:
        statement = statement.where(sqlmodel.col(TagRecord.is_archived) == False)  # noqa: E712

    if query.page_cursor is not None:
        statement = apply_timestamp_id_page_cursor(
            statement=statement,
            page_cursor=query.page_cursor,
            timestamp_column=TagRecord.timestamp_created,
            id_column=TagRecord.tag_id,
        )

    statement = statement.order_by(
        sqlmodel.col(TagRecord.timestamp_created).desc(),
        sqlmodel.col(TagRecord.tag_id).desc(),
    )
    statement = statement.limit(query.max_items + 1)
    tag_records = session.exec(statement).all()
    records_page, next_page_cursor = page_records(
        records=list(tag_records),
        max_items=query.max_items,
        timestamp_attr="timestamp_created",
        id_attr="tag_id",
    )

    return contracts.ListTagsResponse(
        items=[_tag_item(tag_record) for tag_record in records_page],
        next_page_cursor=next_page_cursor,
    )


# %% Rename Tag
@router.post("/tags/rename")
def rename_tag(
    request: contracts.RenameTagRequest,
    session: SessionDep,
    user: UserDep,
) -> contracts.RenameTagResponse:
    """Rename an active Tag owned by the current user."""

    tag_record = _require_active_tag(
        session=session,
        user_id=user.user_id,
        name=request.name,
    )
    existing_tag = _get_active_tag(
        session=session,
        user_id=user.user_id,
        name=request.new_name,
    )
    if existing_tag is not None and existing_tag.tag_id != tag_record.tag_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="An active Tag with this name already exists.",
        )

    tag_record.name = request.new_name
    session.add(tag_record)
    session.commit()
    session.refresh(tag_record)
    return contracts.RenameTagResponse.model_validate(_tag_mutation_response(tag_record))


# %% Archive Tag
@router.post("/tags/archive")
def archive_tag(
    request: contracts.ArchiveTagRequest,
    session: SessionDep,
    user: UserDep,
) -> contracts.ArchiveTagResponse:
    """Archive an active Tag owned by the current user."""

    tag_record = _require_active_tag(
        session=session,
        user_id=user.user_id,
        name=request.name,
    )
    tag_record.is_archived = True
    session.add(tag_record)
    session.commit()
    session.refresh(tag_record)
    return contracts.ArchiveTagResponse.model_validate(_tag_mutation_response(tag_record))
