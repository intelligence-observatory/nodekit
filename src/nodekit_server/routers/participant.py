"""Participant-facing routes for nodekit-server."""

import gzip
from typing import TypedDict
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from uuid import uuid4

import fastapi
import sqlmodel

from nodekit import prepare_site_url
from nodekit._internal.ops.build_site.types import (
    BaseMechanicalTurkContext,
    NoPlatformContext,
    ProlificContext,
)
import nodekit.server.contracts as contracts
from nodekit.server.values import RunStatus, SiteId
from nodekit.server.values import RunId
from nodekit.values import Platform
from nodekit_server.deps import SessionDep, SettingsDep
from nodekit_server.records import RunRecord, SiteRecord, as_utc, utc_now


# %% Router
router = fastapi.APIRouter()


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


def _submit_url(
    request: fastapi.Request,
    settings: SettingsDep,
    site_id: SiteId,
    run_id: RunId,
) -> str:
    base_url = settings.public_base_url or str(request.base_url)
    return f"{base_url.rstrip('/')}/s/{site_id}/runs/{run_id}/submit"


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


def _gzip_site_submission(site_submission: contracts.SubmitRunRequest) -> bytes:
    return gzip.compress(site_submission.model_dump_json().encode("utf-8"), mtime=0)


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


# %% Serve Site
@router.get("/s/{site_id}", include_in_schema=False)
def serve_site(
    request: fastapi.Request,
    site_id: SiteId,
    session: SessionDep,
    settings: SettingsDep,
) -> fastapi.Response:
    """Serve a participant-facing NodeKit Site."""

    site_record = _get_public_site_record(session=session, site_id=site_id)
    if site_record.site_artifact_url is None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Site is missing a frozen artifact URL.",
        )

    recruitment_context = _infer_start_recruitment_context(request=request)
    run_record = None
    if "preview" not in recruitment_context:
        run_record = RunRecord(
            run_id=uuid4(),
            site_id=site_id,
            status=RunStatus.STARTED,
            **recruitment_context,
            is_archived=False,
        )
        session.add(run_record)
        session.commit()
        session.refresh(run_record)

    nodekit_submit_to = (
        _submit_url(request=request, settings=settings, site_id=site_id, run_id=run_record.run_id)
        if run_record is not None
        else None
    )
    redirect_url = prepare_site_url(
        site_url=_with_request_query(site_url=site_record.site_artifact_url, request=request),
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

    recruitment_context = _run_recruitment_context(submit_run_request)
    run_record.status = RunStatus.SUBMITTED
    run_record.recruitment_platform = recruitment_context["recruitment_platform"]
    run_record.recruiter_study_id = recruitment_context["recruiter_study_id"]
    run_record.recruiter_participant_id = recruitment_context["recruiter_participant_id"]
    run_record.recruiter_session_id = recruitment_context["recruiter_session_id"]
    run_record.site_submission_json_gzip = _gzip_site_submission(submit_run_request)
    run_record.timestamp_submitted = utc_now()
    session.add(run_record)
    session.commit()
    session.refresh(run_record)

    return _submit_run_response(run_record)
