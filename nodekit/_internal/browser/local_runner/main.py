import atexit
import dataclasses
import hashlib
import threading
import time
from pathlib import Path
from typing import List, Dict

import fastapi
import fastapi.responses
import fastapi.templating
import pydantic
import uvicorn

from nodekit._internal.browser.browser_bundle import get_browser_bundle
from nodekit._internal.types.assets import AssetFile
from nodekit._internal.types.events.events import Event, EventTypeEnum
from nodekit._internal.types.trace import Trace
from nodekit._internal.ops.collect_asset_files import collect_asset_files
from nodekit import Graph


# %%
class LocalRunner:
    def __init__(
        self,
        port: int = 7651,
        host: str = "127.0.0.1",
    ):
        self._lock = threading.RLock()
        self._thread: threading.Thread | None = None
        self._server: uvicorn.Server | None = None
        self._running = False

        self.port = port
        self.host = host

        # In-memory state of the runner:
        self._graph: Graph | None = None
        self._events: List[Event] = []

        self.asset_id_to_file: Dict[str, AssetFile] = {}

        # Initialize FastAPI app
        self.app = self._build_app()
        atexit.register(self.shutdown)

    def ensure_running(self):
        with self._lock:
            if self._running:
                return

            config = uvicorn.Config(
                app=self.app,
                host=self.host,
                port=self.port,
                log_level="info",
            )
            self._server = uvicorn.Server(config=config)
            self._thread = threading.Thread(target=self._server.run, daemon=True)
            self._thread.start()
            self._running = True

    def shutdown(self):
        with self._lock:
            if not self._running:
                return

            if self._server is not None:
                self._server.should_exit = True
            if self._thread is not None:
                self._thread.join(timeout=5.0)

            self._running = False
            self._server = None
            self._thread = None

    def set_graph(self, graph: Graph):
        with self._lock:
            # Reset Graph and Events
            self._graph = graph
            self._events = []

    def mount_asset_files(self, asset_files: List[AssetFile] | None):
        with self._lock:
            if asset_files is None:
                return

            for asset_file in asset_files:
                self.asset_id_to_file[asset_file.sha256] = asset_file

    def _build_app(self) -> fastapi.FastAPI:
        app = fastapi.FastAPI()

        # Mount the static JS and CSS files
        bundle = get_browser_bundle()

        def _sha(text: str) -> str:
            return hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]

        NODEKIT_JS_HASH = _sha(bundle.js)
        NODEKIT_CSS_HASH = _sha(bundle.css)

        # Mount the jinja2 template at ./site-template.j2:
        templates = fastapi.templating.Jinja2Templates(directory=Path(__file__).parent)

        # Cache-busted asset endpoints
        @app.get("/static/nodekit.{js_hash}.js", name="get_nodekit_javascript")
        def get_nodekit_javascript(js_hash: str) -> fastapi.responses.PlainTextResponse:
            if not js_hash == NODEKIT_JS_HASH:
                raise fastapi.HTTPException(status_code=404, detail="JS not found")
            return fastapi.responses.PlainTextResponse(
                bundle.js, media_type="application/javascript"
            )

        @app.get("/static/nodekit.{css_hash}.css", name="get_nodekit_css")
        def get_nodekit_css(css_hash: str) -> fastapi.responses.PlainTextResponse:
            if not css_hash == NODEKIT_CSS_HASH:
                raise fastapi.HTTPException(status_code=404, detail="CSS not found")
            return fastapi.responses.PlainTextResponse(
                bundle.css, media_type="text/css"
            )

        @app.get("/health")
        def health():
            return fastapi.Response(status_code=fastapi.status.HTTP_204_NO_CONTENT)

        @app.get("/assets/{asset_id}")
        async def get_asset(asset_id: str):
            ...

            try:
                asset_file = self.asset_id_to_file[asset_id]
            except KeyError:
                raise fastapi.HTTPException(
                    status_code=404, detail=f"Asset with ID {asset_id} not found."
                )

            return fastapi.responses.FileResponse(
                path=asset_file.path, media_type=asset_file.mime_type
            )

        @app.get("/")
        def site(
            request: fastapi.Request,
        ) -> fastapi.responses.HTMLResponse:
            if self._graph is None:
                raise fastapi.HTTPException(
                    status_code=404,
                    detail="No Graph is currently being served. Call `nodekit.play` first.",
                )

            # Package asset urls:
            asset_urls = []
            for asset_id in sorted(self.asset_id_to_file.keys()):
                asset_file = self.asset_id_to_file[asset_id]
                asset_urls.append(
                    dict(
                        identifier=asset_file.model_dump(mode="json"),
                        url=str(request.url_for("get_asset", asset_id=asset_id)),
                    )
                )

            return templates.TemplateResponse(
                request=request,
                name="site-template.j2",
                context={
                    "graph": self._graph.model_dump(mode="json"),
                    "asset_urls": asset_urls,
                    "nodekit_javascript_link": request.url_for(
                        "get_nodekit_javascript",
                        js_hash=NODEKIT_JS_HASH,
                    ),
                    "nodekit_css_link": request.url_for(
                        "get_nodekit_css",
                        css_hash=NODEKIT_CSS_HASH,
                    ),
                    "submit_event_url": request.url_for(
                        "submit_event",
                    ),
                },
            )

        @app.post("/submit")
        def submit_event(
            event: dict,
        ) -> fastapi.Response:
            # Event is a type alias which is a Union of multiple concrete event types.
            # Need a TypeAdapter for this.
            typeadapter = pydantic.TypeAdapter(Event)
            event = typeadapter.validate_python(event)
            print(f"Received {event.event_type.value}")
            self._events.append(event)
            return fastapi.Response(status_code=fastapi.status.HTTP_204_NO_CONTENT)

        return app

    @property
    def url(self) -> str:
        return f"http://{self.host}:{self.port}"

    def list_events(self) -> List[Event]:
        with self._lock:
            return list(self._events)


# %% Singleton instance of the LocalRunner
_runner: LocalRunner | None = None


def _get_runner() -> LocalRunner:
    global _runner
    if _runner is None:
        _runner = LocalRunner()
    return _runner


# %%
@dataclasses.dataclass
class PlaySession:
    url: str

    def list_events(self) -> List[Event]:
        """
        Returns the Events for the current session.
        Todo: this might diverge if `nodekit.play` is called again.
        """
        runner = _get_runner()
        return runner.list_events()


def play(
    graph: Graph,
) -> Trace:
    """
    Runs the Graph at http://localhost:{port}.
    Blocks until the Trace is complete.
    """

    runner = _get_runner()
    runner.ensure_running()
    runner.set_graph(graph)

    # Collect the AssetFiles from the Graph:
    asset_files = collect_asset_files(graph)
    runner.mount_asset_files(asset_files)
    print("Play the Graph at:\n", runner.url)

    # Wait until the End Event is observed:
    while True:
        # Todo: make this better; add a timeout
        events = runner.list_events()
        if any([e.event_type == EventTypeEnum.TraceEndedEvent for e in events]):
            break
        time.sleep(5)

    # Shut down the server:
    runner.shutdown()

    return Trace(events=events)
