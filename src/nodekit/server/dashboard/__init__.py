"""Local dashboard entrypoints."""

import os
import socket
import webbrowser

import uvicorn

from nodekit.server.client import Client

from .app import create_dashboard_app
from .cache import _DashboardCache, clear_dashboard_cache

__all__ = ["clear_dashboard_cache", "start_dashboard"]


# %% Dashboard
def start_dashboard(
    client: Client | None = None,
    *,
    cache_dir: os.PathLike[str] | str | None = None,
    host: str = "127.0.0.1",
    port: int = 0,
    open_browser: bool = True,
) -> None:
    """Start the local NodeKit dashboard and block until interrupted.

    Args:
        client: Optional NodeKit server client used for manual dashboard refreshes.
        cache_dir: Optional persistent cache root. If omitted, NodeKit uses
            `NODEKIT_DASHBOARD_CACHE_DIR` or the operating-system user cache directory.
        host: Interface for the local dashboard server.
        port: Local port. Use `0` to bind an available port.
        open_browser: Whether to open the dashboard URL in the default browser.
    """

    cache = _DashboardCache(client=client, cache_dir=cache_dir)
    app = create_dashboard_app(cache=cache)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((host, port))
    sock.listen(2048)
    actual_port = sock.getsockname()[1]
    display_host = "127.0.0.1" if host in {"0.0.0.0", "::"} else host
    url = f"http://{display_host}:{actual_port}"

    print(f"NodeKit dashboard: {url}")
    print(f"NodeKit dashboard cache: {cache.db_path}")
    if open_browser:
        webbrowser.open(url)

    config = uvicorn.Config(
        app=app,
        host=host,
        port=actual_port,
        log_level="info",
        access_log=False,
    )
    server = uvicorn.Server(config=config)
    try:
        server.run(sockets=[sock])
    except KeyboardInterrupt:
        pass
    finally:
        sock.close()
