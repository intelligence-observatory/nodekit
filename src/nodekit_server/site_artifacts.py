"""Frozen participant-facing Site artifact publishing."""

import base64
import gzip
import html

from nodekit import Graph, VERSION
from nodekit._internal.utils.get_browser_bundle import get_browser_bundle
from nodekit.server.values import SiteConditionId, SiteId
from nodekit_server.storage import (
    SiteArtifactStore,
    runtime_css_artifact_key,
    runtime_js_artifact_key,
    site_condition_index_artifact_key,
    site_index_artifact_key,
)


# %% Artifact metadata
class PublishedSiteArtifacts:
    """Metadata for frozen Site artifacts persisted with a Site record."""

    def __init__(
        self,
        *,
        site_artifact_storage_key: str,
        site_artifact_url: str,
        runtime_js_storage_key: str,
        runtime_css_storage_key: str,
        runtime_js_sha256: str,
        runtime_css_sha256: str,
        frozen_nodekit_version: str,
    ):
        self.site_artifact_storage_key = site_artifact_storage_key
        self.site_artifact_url = site_artifact_url
        self.runtime_js_storage_key = runtime_js_storage_key
        self.runtime_css_storage_key = runtime_css_storage_key
        self.runtime_js_sha256 = runtime_js_sha256
        self.runtime_css_sha256 = runtime_css_sha256
        self.frozen_nodekit_version = frozen_nodekit_version


# %% Rendering
def graph_gz_b64(graph_json_gzip: bytes) -> str:
    """Return wrapped base64 for gzipped Graph JSON bytes."""

    graph_gz_b64_value = base64.b64encode(graph_json_gzip).decode("ascii")
    return "\n".join(
        graph_gz_b64_value[i : i + 120] for i in range(0, len(graph_gz_b64_value), 120)
    )


def render_site_html(
    *,
    graph_json_gzip: bytes,
    js_url: str,
    css_url: str,
) -> str:
    """Render frozen participant-facing HTML for a Graph."""

    payload = graph_gz_b64(graph_json_gzip)
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
        const graphGzB64 = `{payload}`;
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


# %% Publishing
def publish_site_artifacts(
    *,
    site_id: SiteId,
    condition_id: SiteConditionId | None = None,
    graph: Graph,
    store: SiteArtifactStore,
) -> PublishedSiteArtifacts:
    """Publish frozen Site HTML and runtime bundle artifacts."""

    browser_bundle = get_browser_bundle()
    graph_json_gzip = gzip.compress(graph.model_dump_json().encode("utf-8"), mtime=0)

    js_key = store.storage_key_for_artifact(runtime_js_artifact_key(str(browser_bundle.js_sha256)))
    css_key = store.storage_key_for_artifact(
        runtime_css_artifact_key(str(browser_bundle.css_sha256))
    )
    site_key = store.storage_key_for_artifact(
        site_index_artifact_key(site_id)
        if condition_id is None
        else site_condition_index_artifact_key(site_id=site_id, condition_id=condition_id)
    )

    if not store.exists(js_key):
        store.put_bytes(
            storage_key=js_key,
            content=browser_bundle.js.encode("utf-8"),
            media_type="application/javascript",
        )
    if not store.exists(css_key):
        store.put_bytes(
            storage_key=css_key,
            content=browser_bundle.css.encode("utf-8"),
            media_type="text/css",
        )

    html_content = render_site_html(
        graph_json_gzip=graph_json_gzip,
        js_url=store.resolve_url(js_key),
        css_url=store.resolve_url(css_key),
    )
    store.put_bytes(
        storage_key=site_key,
        content=html_content.encode("utf-8"),
        media_type="text/html",
    )

    return PublishedSiteArtifacts(
        site_artifact_storage_key=site_key,
        site_artifact_url=store.resolve_url(site_key),
        runtime_js_storage_key=js_key,
        runtime_css_storage_key=css_key,
        runtime_js_sha256=str(browser_bundle.js_sha256),
        runtime_css_sha256=str(browser_bundle.css_sha256),
        frozen_nodekit_version=VERSION,
    )
