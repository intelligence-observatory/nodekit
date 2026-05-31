"""Participant-facing routes for nodekit-server."""

import base64
import gzip
import html
from uuid import uuid4

import fastapi
import sqlmodel

import nodekit.server.contracts as contracts
from nodekit._internal.utils.get_browser_bundle import get_browser_bundle
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


def _runtime_url(
    request: fastapi.Request,
    settings: SettingsDep,
    path: str,
) -> str:
    base_url = settings.public_base_url or str(request.base_url)
    return f"{base_url.rstrip('/')}{path}"


def _graph_gz_b64(graph_json_gzip: bytes) -> str:
    graph_gz_b64 = base64.b64encode(graph_json_gzip).decode("ascii")
    return "\n".join(graph_gz_b64[i : i + 120] for i in range(0, len(graph_gz_b64), 120))


def _render_site_html(
    request: fastapi.Request,
    settings: SettingsDep,
    site_record: SiteRecord,
) -> str:
    browser_bundle = get_browser_bundle()
    js_url = _runtime_url(
        request=request,
        settings=settings,
        path=f"/runtime/nodekit.{browser_bundle.js_sha256}.js",
    )
    css_url = _runtime_url(
        request=request,
        settings=settings,
        path=f"/runtime/nodekit.{browser_bundle.css_sha256}.css",
    )
    graph_gz_b64 = _graph_gz_b64(site_record.graph_json_gzip)

    return f"""<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>NodeKit</title>
    <link rel="shortcut icon" href="">

    <!-- NodeKit -->
    <script src="{html.escape(js_url)}"></script>
    <link href="{html.escape(css_url)}" rel="stylesheet">
    <script>
        const graphGzB64 = `{graph_gz_b64}`;
        function renderLoadError(message) {{
            document.body.innerHTML = `
                <main style="font-family: sans-serif; max-width: 48rem; margin: 4rem auto; padding: 0 1.5rem; line-height: 1.5;">
                    <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Unable to load this NodeKit site</h1>
                    <p style="margin-bottom: 0.75rem;">
                        This browser could not decode the embedded Graph payload required to start the task.
                    </p>
                    <pre style="white-space: pre-wrap; word-break: break-word; background: #f5f5f5; padding: 1rem; border-radius: 0.5rem;">${{message}}</pre>
                </main>
            `;
        }}
        async function loadGraph() {{
            if (typeof DecompressionStream === "undefined") {{
                throw new Error("DecompressionStream is not available in this browser.");
            }}
            const normalizedB64 = graphGzB64.replace(/\\s+/g, "");
            const gzBytes = Uint8Array.from(atob(normalizedB64), (c) => c.charCodeAt(0));
            const decompressed = new Blob([gzBytes]).stream().pipeThrough(new DecompressionStream("gzip"));
            const graphJson = await new Response(decompressed).text();
            const graph = JSON.parse(graphJson);
            await NodeKit.play(graph);
        }}
        window.onload = async () => {{
            try {{
                await loadGraph();
            }} catch (error) {{
                const message = error instanceof Error ? error.message : String(error);
                renderLoadError(message);
                console.error(error);
            }}
        }};
    </script>
</head>
<body></body>
</html>
"""


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
    if "nodekitSubmitTo" not in request.query_params:
        redirect_url = request.url.include_query_params(
            nodekitSubmitTo=_submit_url(request=request, settings=settings, site_id=site_id)
        )
        return fastapi.responses.RedirectResponse(
            url=str(redirect_url),
            status_code=fastapi.status.HTTP_307_TEMPORARY_REDIRECT,
        )

    return fastapi.responses.HTMLResponse(
        content=_render_site_html(
            request=request,
            settings=settings,
            site_record=site_record,
        )
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
