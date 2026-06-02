"""Participant-facing routes for nodekit-server."""

import gzip
from typing import TypedDict
from urllib.parse import urlsplit, urlunsplit
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
from nodekit.values import Platform
from nodekit_server.deps import SessionDep, SettingsDep
from nodekit_server.records import RunRecord, SiteRecord, as_utc


# %% Router
router = fastapi.APIRouter()


# %% Helpers
class _RunRecruitmentContext(TypedDict):
    recruitment_platform: Platform
    recruiter_study_id: str | None
    recruiter_participant_id: str | None
    recruiter_session_id: str | None


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
) -> str:
    base_url = settings.public_base_url or str(request.base_url)
    return f"{base_url.rstrip('/')}/s/{site_id}/submit"


def _with_request_query(site_url: str, request: fastapi.Request) -> str:
    """Return a Site URL with the incoming request query parameters preserved."""

    if not request.url.query:
        return site_url

    split_url = urlsplit(site_url)
    query = split_url.query
    if query:
        query = f"{query}&{request.url.query}"
    else:
        query = request.url.query
    return urlunsplit(
        (
            split_url.scheme,
            split_url.netloc,
            split_url.path,
            query,
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

    redirect_url = prepare_site_url(
        site_url=_with_request_query(site_url=site_record.site_artifact_url, request=request),
        platform="none",
        nodekit_submit_to=_submit_url(request=request, settings=settings, site_id=site_id),
    )
    return fastapi.responses.RedirectResponse(
        url=redirect_url,
        status_code=fastapi.status.HTTP_307_TEMPORARY_REDIRECT,
    )


# %% Submit Run
@router.post("/s/{site_id}/submit", include_in_schema=False)
def submit_run(
    site_id: SiteId,
    submit_run_request: contracts.SubmitRunRequest,
    session: SessionDep,
) -> contracts.SubmitRunResponse:
    """Accept a browser-native SiteSubmission and create a Run."""

    _get_public_site_record(session=session, site_id=site_id)
    run_record = RunRecord(
        run_id=uuid4(),
        site_id=site_id,
        status=RunStatus.SUBMITTED,
        **_run_recruitment_context(submit_run_request),
        site_submission_json_gzip=_gzip_site_submission(submit_run_request),
        is_archived=False,
    )
    session.add(run_record)
    session.commit()
    session.refresh(run_record)

    return _submit_run_response(run_record)
