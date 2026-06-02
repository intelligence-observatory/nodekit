"""Runtime bundle routes for nodekit-server."""

import fastapi

from nodekit._internal.utils.get_browser_bundle import get_browser_bundle


# %% Router
router = fastapi.APIRouter()


# %% Helpers
_CACHE_HEADERS = {"Cache-Control": "public, max-age=31536000, immutable"}


# %% Runtime
@router.get("/runtime/nodekit.{js_sha256}.js", include_in_schema=False)
def get_nodekit_javascript(js_sha256: str) -> fastapi.Response:
    """Serve the content-addressed NodeKit browser JavaScript bundle."""

    browser_bundle = get_browser_bundle()
    if js_sha256 != browser_bundle.js_sha256:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="Runtime bundle not found.",
        )

    return fastapi.Response(
        content=browser_bundle.js,
        media_type="application/javascript",
        headers=_CACHE_HEADERS,
    )


@router.get("/runtime/nodekit.{css_sha256}.css", include_in_schema=False)
def get_nodekit_css(css_sha256: str) -> fastapi.Response:
    """Serve the content-addressed NodeKit browser CSS bundle."""

    browser_bundle = get_browser_bundle()
    if css_sha256 != browser_bundle.css_sha256:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail="Runtime bundle not found.",
        )

    return fastapi.Response(
        content=browser_bundle.css,
        media_type="text/css",
        headers=_CACHE_HEADERS,
    )
