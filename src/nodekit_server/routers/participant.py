"""Participant-facing routes for nodekit-server."""

import gzip
import hashlib
from fractions import Fraction
from typing import TypedDict, cast
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from uuid import uuid4

import fastapi
import sqlmodel
from sqlalchemy import exc, func

from nodekit import prepare_site_url
from nodekit._internal.ops.build_site.types import (
    BaseMechanicalTurkContext,
    NoPlatformContext,
    ProlificContext,
)
import nodekit.server.contracts as contracts
from nodekit.server.values import RunStatus, SiteConditionId, SiteId
from nodekit.server.values import RunId
from nodekit.values import Platform
from nodekit_server.deps import SessionDep, SettingsDep
from nodekit_server.records import (
    RunRecord,
    SiteAssignmentRecord,
    SiteConditionRecord,
    SiteRecord,
    as_utc,
    utc_now,
)


# %% Router
router = fastapi.APIRouter()
NODEKIT_PARTICIPANT_ID_PARAM = "nodekitParticipantId"


# %% Helpers
class _RunRecruitmentContext(TypedDict):
    recruitment_platform: Platform
    recruiter_study_id: str | None
    recruiter_participant_id: str | None
    recruiter_session_id: str | None


class _MturkPreviewContext(TypedDict):
    preview: bool


def _get_public_site_record(session: sqlmodel.Session, site_id: SiteId) -> SiteRecord:
    site_record = session.get(SiteRecord, site_id)
    if site_record is None or site_record.is_archived:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="Site not found.",
        )
    return site_record


def _get_site_condition_records(
    session: sqlmodel.Session,
    site_id: SiteId,
) -> tuple[SiteConditionRecord, ...]:
    statement = sqlmodel.select(SiteConditionRecord)
    statement = statement.where(sqlmodel.col(SiteConditionRecord.site_id) == site_id)
    statement = statement.order_by(sqlmodel.col(SiteConditionRecord.condition_id))
    return tuple(session.exec(statement).all())


def _get_site_condition_record(
    session: sqlmodel.Session,
    site_id: SiteId,
    condition_id: SiteConditionId,
) -> SiteConditionRecord:
    condition_record = session.get(SiteConditionRecord, (site_id, condition_id))
    if condition_record is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="Site Condition not found.",
        )
    return condition_record


def _submit_url(
    request: fastapi.Request,
    settings: SettingsDep,
    site_id: SiteId,
    run_id: RunId,
) -> str:
    base_url = settings.public_base_url or str(request.base_url)
    return f"{base_url.rstrip('/')}/s/{site_id}/runs/{run_id}/submit"


def _site_start_url(
    request: fastapi.Request,
    settings: SettingsDep,
    site_id: SiteId,
) -> str:
    base_url = settings.public_base_url or str(request.base_url)
    return f"{base_url.rstrip('/')}/s/{site_id}"


def _with_request_query(site_url: str, request: fastapi.Request) -> str:
    """Return a Site URL with the incoming request query parameters preserved."""

    query_items = [
        (key, value)
        for key, value in parse_qsl(request.url.query, keep_blank_values=True)
        if key != "nodekitSubmitTo"
    ]
    if not query_items:
        return site_url

    split_url = urlsplit(site_url)
    query = parse_qsl(split_url.query, keep_blank_values=True)
    query.extend(query_items)
    return urlunsplit(
        (
            split_url.scheme,
            split_url.netloc,
            split_url.path,
            urlencode(query, doseq=True),
            split_url.fragment,
        )
    )


def _with_nodekit_participant_id(
    site_url: str,
    request: fastapi.Request,
    nodekit_participant_id: str,
) -> str:
    """Return a Site URL with a canonical NodeKit participant id."""

    query_items = [
        (key, value)
        for key, value in parse_qsl(request.url.query, keep_blank_values=True)
        if key not in {"nodekitSubmitTo", NODEKIT_PARTICIPANT_ID_PARAM}
    ]
    query_items.append((NODEKIT_PARTICIPANT_ID_PARAM, nodekit_participant_id))

    split_url = urlsplit(site_url)
    query = parse_qsl(split_url.query, keep_blank_values=True)
    query.extend(query_items)
    return urlunsplit(
        (
            split_url.scheme,
            split_url.netloc,
            split_url.path,
            urlencode(query, doseq=True),
            split_url.fragment,
        )
    )


def _gzip_site_submission(site_submission: contracts.SubmitRunRequest) -> bytes:
    return gzip.compress(site_submission.model_dump_json().encode("utf-8"), mtime=0)


def _validate_site_submission_trace(site_submission: contracts.SubmitRunRequest) -> None:
    try:
        _ = site_submission.trace
    except ValueError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


def _run_recruitment_context(site_submission: contracts.SubmitRunRequest) -> _RunRecruitmentContext:
    platform_context = site_submission.platform_context
    if isinstance(platform_context, ProlificContext):
        return {
            "recruitment_platform": platform_context.platform,
            "recruiter_study_id": platform_context.study_id,
            "recruiter_participant_id": platform_context.prolific_pid,
            "recruiter_session_id": platform_context.session_id,
        }
    if isinstance(platform_context, BaseMechanicalTurkContext):
        return {
            "recruitment_platform": platform_context.platform,
            "recruiter_study_id": platform_context.hit_id,
            "recruiter_participant_id": platform_context.worker_id,
            "recruiter_session_id": platform_context.assignment_id,
        }
    if isinstance(platform_context, NoPlatformContext):
        return {
            "recruitment_platform": platform_context.platform,
            "recruiter_study_id": None,
            "recruiter_participant_id": None,
            "recruiter_session_id": None,
        }
    raise ValueError(f"Unsupported platform context: {type(platform_context).__name__}.")


def _infer_start_recruitment_context(
    request: fastapi.Request,
) -> _RunRecruitmentContext | _MturkPreviewContext:
    mturk_context = _infer_mturk_start_context(request=request)
    prolific_context = _infer_prolific_start_context(request=request)
    if mturk_context is not None and prolific_context is not None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Multiple platform contexts detected.",
        )
    if mturk_context is not None:
        return mturk_context
    if prolific_context is not None:
        return prolific_context
    return _RunRecruitmentContext(
        recruitment_platform="NoPlatform",
        recruiter_study_id=None,
        recruiter_participant_id=None,
        recruiter_session_id=None,
    )


def _infer_mturk_start_context(
    request: fastapi.Request,
) -> _RunRecruitmentContext | _MturkPreviewContext | None:
    assignment_id = request.query_params.get("assignmentId")
    hit_id = request.query_params.get("hitId")
    worker_id = request.query_params.get("workerId")
    turk_submit_to = request.query_params.get("turkSubmitTo")
    looks_like_mturk = any(
        value is not None for value in (assignment_id, hit_id, worker_id, turk_submit_to)
    )
    if not looks_like_mturk:
        return None
    if assignment_id == "ASSIGNMENT_ID_NOT_AVAILABLE":
        return _MturkPreviewContext(preview=True)
    if not turk_submit_to or not hit_id or not assignment_id or not worker_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Missing required parameters in the query for MTurk platform.",
        )

    try:
        turk_submit_to_host = urlsplit(turk_submit_to).hostname
    except ValueError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Invalid turkSubmitTo URL in MTurk platform context.",
        ) from exc
    if turk_submit_to_host == "www.mturk.com":
        platform: Platform = "MechanicalTurk"
    elif turk_submit_to_host == "workersandbox.mturk.com":
        platform = "MechanicalTurkSandbox"
    else:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Unknown turkSubmitTo host in MTurk platform context.",
        )

    return _RunRecruitmentContext(
        recruitment_platform=platform,
        recruiter_study_id=hit_id,
        recruiter_participant_id=worker_id,
        recruiter_session_id=assignment_id,
    )


def _infer_prolific_start_context(request: fastapi.Request) -> _RunRecruitmentContext | None:
    prolific_pid = request.query_params.get("PROLIFIC_PID")
    study_id = request.query_params.get("STUDY_ID")
    session_id = request.query_params.get("SESSION_ID")
    completion_code = request.query_params.get("prolificCompletionCode")
    looks_like_prolific = any(
        value is not None for value in (prolific_pid, study_id, session_id, completion_code)
    )
    if not looks_like_prolific:
        return None
    if not prolific_pid or not study_id or not session_id or not completion_code:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Missing required parameters in the query for Prolific platform.",
        )
    return _RunRecruitmentContext(
        recruitment_platform="Prolific",
        recruiter_study_id=study_id,
        recruiter_participant_id=prolific_pid,
        recruiter_session_id=session_id,
    )


def _submit_run_response(run_record: RunRecord) -> contracts.SubmitRunResponse:
    return contracts.SubmitRunResponse(
        run_id=run_record.run_id,
        site_id=run_record.site_id,
        condition_id=run_record.condition_id,
        status=run_record.status,
        recruitment_platform=run_record.recruitment_platform,
        recruiter_study_id=run_record.recruiter_study_id,
        recruiter_participant_id=run_record.recruiter_participant_id,
        recruiter_session_id=run_record.recruiter_session_id,
        is_archived=run_record.is_archived,
        timestamp_created=as_utc(run_record.timestamp_created),
        timestamp_submitted=(
            as_utc(run_record.timestamp_submitted)
            if run_record.timestamp_submitted is not None
            else None
        ),
    )


def _participant_id_for_context(recruitment_context: _RunRecruitmentContext) -> str:
    participant_id = recruitment_context["recruiter_participant_id"]
    if participant_id is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Participant id is required to start this Site.",
        )
    return participant_id


def _assignment_counts_by_condition(
    session: sqlmodel.Session,
    site_id: SiteId,
) -> dict[SiteConditionId, int]:
    statement = sqlmodel.select(
        SiteAssignmentRecord.condition_id,
        func.count(),
    )
    statement = statement.where(sqlmodel.col(SiteAssignmentRecord.site_id) == site_id)
    statement = statement.group_by(sqlmodel.col(SiteAssignmentRecord.condition_id))
    return {condition_id: count for condition_id, count in session.exec(statement).all()}


def _tie_break_hash(
    *,
    site_id: SiteId,
    participant_id: str,
    condition_id: SiteConditionId,
) -> str:
    payload = f"{site_id}:{participant_id}:{condition_id}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def _choose_assignment_condition(
    *,
    site_id: SiteId,
    participant_id: str,
    condition_records: tuple[SiteConditionRecord, ...],
    assignment_counts: dict[SiteConditionId, int],
) -> SiteConditionRecord:
    total_weight = sum(condition.allocation_weight for condition in condition_records)
    total_assignments = sum(assignment_counts.values())

    def priority(condition: SiteConditionRecord) -> tuple[Fraction, str]:
        current_count = assignment_counts.get(condition.condition_id, 0)
        deficit = (
            Fraction(
                (total_assignments + 1) * condition.allocation_weight,
                total_weight,
            )
            - current_count
        )
        return (
            deficit,
            _tie_break_hash(
                site_id=site_id,
                participant_id=participant_id,
                condition_id=condition.condition_id,
            ),
        )

    return max(condition_records, key=priority)


def _get_or_create_assignment(
    *,
    session: sqlmodel.Session,
    site_id: SiteId,
    participant_id: str,
) -> SiteAssignmentRecord:
    assignment_record = session.get(SiteAssignmentRecord, (site_id, participant_id))
    if assignment_record is not None:
        return assignment_record

    condition_records = _get_site_condition_records(session=session, site_id=site_id)
    if not condition_records:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Site is missing Conditions.",
        )
    condition_record = _choose_assignment_condition(
        site_id=site_id,
        participant_id=participant_id,
        condition_records=condition_records,
        assignment_counts=_assignment_counts_by_condition(session=session, site_id=site_id),
    )
    assignment_record = SiteAssignmentRecord(
        site_id=site_id,
        participant_id=participant_id,
        condition_id=condition_record.condition_id,
    )
    session.add(assignment_record)
    try:
        session.flush()
    except exc.IntegrityError:
        session.rollback()
        assignment_record = session.get(SiteAssignmentRecord, (site_id, participant_id))
        if assignment_record is None:
            raise
    return assignment_record


# %% Serve Site
@router.get("/s/{site_id}", include_in_schema=False)
def serve_site(
    request: fastapi.Request,
    site_id: SiteId,
    session: SessionDep,
    settings: SettingsDep,
) -> fastapi.Response:
    """Serve a participant-facing NodeKit Site."""

    _get_public_site_record(session=session, site_id=site_id)

    recruitment_context = _infer_start_recruitment_context(request=request)
    run_record = None
    condition_record = None
    if "preview" not in recruitment_context:
        run_recruitment_context = cast(_RunRecruitmentContext, recruitment_context)
        if run_recruitment_context["recruitment_platform"] == "NoPlatform":
            nodekit_participant_id = request.query_params.get(NODEKIT_PARTICIPANT_ID_PARAM)
            if nodekit_participant_id is None:
                redirect_url = _with_nodekit_participant_id(
                    site_url=_site_start_url(
                        request=request,
                        settings=settings,
                        site_id=site_id,
                    ),
                    request=request,
                    nodekit_participant_id=str(uuid4()),
                )
                return fastapi.responses.RedirectResponse(
                    url=redirect_url,
                    status_code=fastapi.status.HTTP_307_TEMPORARY_REDIRECT,
                )
            run_recruitment_context["recruiter_participant_id"] = nodekit_participant_id

        participant_id = _participant_id_for_context(run_recruitment_context)
        assignment_record = _get_or_create_assignment(
            session=session,
            site_id=site_id,
            participant_id=participant_id,
        )
        condition_record = _get_site_condition_record(
            session=session,
            site_id=site_id,
            condition_id=assignment_record.condition_id,
        )
        run_record = RunRecord(
            run_id=uuid4(),
            site_id=site_id,
            condition_id=condition_record.condition_id,
            status=RunStatus.STARTED,
            **run_recruitment_context,
            is_archived=False,
        )
        session.add(run_record)
        session.commit()
        session.refresh(run_record)
    else:
        condition_records = _get_site_condition_records(session=session, site_id=site_id)
        if not condition_records:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Site is missing Conditions.",
            )
        condition_record = condition_records[0]

    if condition_record.site_artifact_url is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Site Condition is missing a frozen artifact URL.",
        )

    nodekit_submit_to = (
        _submit_url(request=request, settings=settings, site_id=site_id, run_id=run_record.run_id)
        if run_record is not None
        else None
    )
    redirect_url = prepare_site_url(
        site_url=_with_request_query(site_url=condition_record.site_artifact_url, request=request),
        platform="none",
        nodekit_submit_to=nodekit_submit_to,
    )
    return fastapi.responses.RedirectResponse(
        url=redirect_url,
        status_code=fastapi.status.HTTP_307_TEMPORARY_REDIRECT,
    )


# %% Submit Run
@router.post("/s/{site_id}/runs/{run_id}/submit", include_in_schema=False)
def submit_run(
    site_id: SiteId,
    run_id: RunId,
    submit_run_request: contracts.SubmitRunRequest,
    session: SessionDep,
) -> contracts.SubmitRunResponse:
    """Accept a browser-native SiteSubmission and complete a started Run."""

    _get_public_site_record(session=session, site_id=site_id)
    run_record = session.get(RunRecord, run_id)
    if run_record is None or run_record.site_id != site_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="Run not found.",
        )
    if run_record.status != RunStatus.STARTED:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_409_CONFLICT,
            detail="Run has already been submitted.",
        )

    _validate_site_submission_trace(submit_run_request)
    recruitment_context = _run_recruitment_context(submit_run_request)
    existing_recruiter_participant_id = run_record.recruiter_participant_id
    run_record.status = RunStatus.SUBMITTED
    run_record.recruitment_platform = recruitment_context["recruitment_platform"]
    run_record.recruiter_study_id = recruitment_context["recruiter_study_id"]
    run_record.recruiter_participant_id = (
        existing_recruiter_participant_id
        if recruitment_context["recruitment_platform"] == "NoPlatform"
        else recruitment_context["recruiter_participant_id"]
    )
    run_record.recruiter_session_id = recruitment_context["recruiter_session_id"]
    run_record.site_submission_json_gzip = _gzip_site_submission(submit_run_request)
    run_record.timestamp_submitted = utc_now()
    session.add(run_record)
    session.commit()
    session.refresh(run_record)

    return _submit_run_response(run_record)
