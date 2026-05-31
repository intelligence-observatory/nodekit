"""Health check routes for nodekit-server."""

import fastapi


# %% Router
router = fastapi.APIRouter()


@router.get("/health", include_in_schema=False)
def get_health() -> dict[str, str]:
    """Return a simple health check response."""

    return {"status": "ok"}
