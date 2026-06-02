"""Participant-facing routes for nodekit-server."""

import gzip
from urllib.parse import urlsplit, urlunsplit
from uuid import uuid4

import fastapi
import sqlmodel

from nodekit import prepare_site_url
import nodekit.server.contracts as contracts
from nodekit.server.values import RunStatus, SiteId
from nodekit_server.deps import SessionDep, SettingsDep
from nodekit_server.records import RunRecord, SiteRecord, as_utc


# %% Router
router = fastapi.APIRouter()


# %% Helpers
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
        site_submission_json_gzip=_gzip_site_submission(submit_run_request),
        is_archived=False,
    )
    session.add(run_record)
    session.commit()
    session.refresh(run_record)

    return contracts.SubmitRunResponse(
        run_id=run_record.run_id,
        site_id=run_record.site_id,
        status=run_record.status,
        is_archived=run_record.is_archived,
        timestamp_created=as_utc(run_record.timestamp_created),
    )
