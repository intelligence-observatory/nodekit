from types import ModuleType

from fastapi.testclient import TestClient


# %%
def test_home_page_returns_operational_landing_page(server_main: ModuleType) -> None:
    with TestClient(server_main.app) as client:
        response = client.get("/")

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/html")
    assert "NodeKit Server" in response.text
    assert 'href="/health"' in response.text
    assert 'href="/docs"' in response.text
    assert 'href="/redoc"' in response.text
    assert "nodekit.server.Client" in response.text
