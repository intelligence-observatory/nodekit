"""Run routes for nodekit-server."""

import gzip
from typing import Annotated
from uuid import UUID

import fastapi
import sqlmodel

from nodekit import SiteSubmission
import nodekit.server.contracts as contracts
from nodekit.server.values import RunId
from nodekit_server.auth import UserDep
from nodekit_server.deps import SessionDep
from nodekit_server.pagination import apply_timestamp_id_page_cursor, page_records
from nodekit_server.records import RunRecord, SiteRecord, as_utc


# %% Router
router = fastapi.APIRouter()


# %% Helpers
def _run_item(run_record: RunRecord) -> contracts.ListRunsItem:
    return contracts.ListRunsItem(
        run_id=run_record.run_id,
        site_id=run_record.site_id,
        status=run_record.status,
        is_archived=run_record.is_archived,
        timestamp_created=as_utc(run_record.timestamp_created),
    )


def _gunzip_site_submission(payload: bytes) -> SiteSubmission:
    return SiteSubmission.model_validate_json(gzip.decompress(payload).decode("utf-8"))


def _run_detail_response(run_record: RunRecord) -> contracts.GetRunResponse:
    site_submission = None
    trace = None
    if run_record.site_submission_json_gzip is not None:
        site_submission = _gunzip_site_submission(run_record.site_submission_json_gzip)
        trace = site_submission.trace

    return contracts.GetRunResponse(
        run_id=run_record.run_id,
        site_id=run_record.site_id,
        status=run_record.status,
        is_archived=run_record.is_archived,
        timestamp_created=as_utc(run_record.timestamp_created),
        site_submission=site_submission,
        trace=trace,
    )


def _run_mutation_response(run_record: RunRecord) -> dict[str, object]:
    return {
        "run_id": run_record.run_id,
        "site_id": run_record.site_id,
        "status": run_record.status,
        "is_archived": run_record.is_archived,
        "timestamp_created": as_utc(run_record.timestamp_created),
    }


def _ensure_path_body_run_match(path_run_id: RunId, body_run_id: RunId) -> None:
    if path_run_id != body_run_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Path run_id does not match request body run_id.",
        )


def _get_run_record_for_user(
    session: sqlmodel.Session,
    run_id: RunId,
    user_id: UUID,
) -> RunRecord:
    statement = sqlmodel.select(RunRecord)
    statement = statement.join(
        SiteRecord,
        sqlmodel.col(RunRecord.site_id) == sqlmodel.col(SiteRecord.site_id),
    )
    statement = statement.where(sqlmodel.col(RunRecord.run_id) == run_id)
    statement = statement.where(sqlmodel.col(SiteRecord.user_id) == user_id)
    run_record = session.exec(statement).one_or_none()
    if run_record is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="Run not found.",
        )
    return run_record


# %% List Runs
@router.get("/runs")
def list_runs(
    query: Annotated[contracts.ListRunsQuery, fastapi.Query()],
    session: SessionDep,
    user: UserDep,
) -> contracts.ListRunsResponse:
    """List Runs for Sites owned by the current user."""

    statement = sqlmodel.select(RunRecord)
    statement = statement.join(
        SiteRecord,
        sqlmodel.col(RunRecord.site_id) == sqlmodel.col(SiteRecord.site_id),
    )
    statement = statement.where(sqlmodel.col(SiteRecord.user_id) == user.user_id)

    if query.run_ids is not None:
        statement = statement.where(sqlmodel.col(RunRecord.run_id).in_(query.run_ids))
    if query.site_id is not None:
        statement = statement.where(sqlmodel.col(RunRecord.site_id) == query.site_id)
    if query.statuses is not None:
        statement = statement.where(sqlmodel.col(RunRecord.status).in_(query.statuses))
    if not query.include_archived:
        statement = statement.where(sqlmodel.col(RunRecord.is_archived) == False)  # noqa: E712

    if query.page_cursor is not None:
        statement = apply_timestamp_id_page_cursor(
            statement=statement,
            page_cursor=query.page_cursor,
            timestamp_column=RunRecord.timestamp_created,
            id_column=RunRecord.run_id,
        )

    statement = statement.order_by(
        sqlmodel.col(RunRecord.timestamp_created).desc(),
        sqlmodel.col(RunRecord.run_id).desc(),
    )
    statement = statement.limit(query.max_items + 1)
    run_records = session.exec(statement).all()
    records_page, next_page_cursor = page_records(
        records=list(run_records),
        max_items=query.max_items,
        timestamp_attr="timestamp_created",
        id_attr="run_id",
    )

    return contracts.ListRunsResponse(
        items=[_run_item(run_record) for run_record in records_page],
        next_page_cursor=next_page_cursor,
    )


# %% Get Run
@router.get("/runs/{run_id}")
def get_run(
    run_id: RunId,
    session: SessionDep,
    user: UserDep,
) -> contracts.GetRunResponse:
    """Return one Run for a Site owned by the current user."""

    run_record = _get_run_record_for_user(
        session=session,
        run_id=run_id,
        user_id=user.user_id,
    )
    return _run_detail_response(run_record)


# %% Archive Run
@router.post("/runs/{run_id}/archive")
def archive_run(
    run_id: RunId,
    request: contracts.ArchiveRunRequest,
    session: SessionDep,
    user: UserDep,
) -> contracts.ArchiveRunResponse:
    """Archive one Run for a Site owned by the current user."""

    _ensure_path_body_run_match(path_run_id=run_id, body_run_id=request.run_id)
    run_record = _get_run_record_for_user(
        session=session,
        run_id=run_id,
        user_id=user.user_id,
    )
    run_record.is_archived = True
    session.add(run_record)
    session.commit()
    session.refresh(run_record)
    return contracts.ArchiveRunResponse.model_validate(_run_mutation_response(run_record))
