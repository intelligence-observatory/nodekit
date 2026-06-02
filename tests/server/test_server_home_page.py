from types import ModuleType

from fastapi.testclient import TestClient

from nodekit import VERSION


# %%
def test_home_page_returns_operational_landing_page(server_main: ModuleType) -> None:
    with TestClient(server_main.app) as client:
        response = client.get("/")

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/html")
    assert "NodeKit Server" in response.text
    assert f"v{VERSION}" in response.text
    assert 'href="/health"' in response.text
    assert 'href="/docs"' in response.text
    assert 'href="/redoc"' not in response.text
    assert "github.com/intelligence-observatory/nodekit" not in response.text


# %%
def test_redoc_route_is_disabled(server_main: ModuleType) -> None:
    with TestClient(server_main.app) as client:
        response = client.get("/redoc")

    assert response.status_code == 404
