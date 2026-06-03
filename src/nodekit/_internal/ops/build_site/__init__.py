import re
import base64
import gzip
import os
from pathlib import Path

import jinja2
import pydantic

from nodekit._internal.ops.open_asset_save_asset import save_asset
from nodekit._internal.ops.transform_asset_locators import transform_asset_locators
from nodekit._internal.types.assets import RelativePath
from nodekit._internal.types.graph import Graph
from nodekit._internal.types.values import MediaType, SHA256
from nodekit._internal.utils.get_browser_bundle import get_browser_bundle
from nodekit._internal.utils.get_extension_from_media_type import (
    get_extension_from_media_type,
)
from nodekit._internal.utils.hashing import hash_string
from nodekit._internal.utils.iter_assets import iter_assets


# %%
class BuildSiteResult(pydantic.BaseModel):
    site_root: Path = pydantic.Field(
        description="The absolute path to the folder containing the site."
    )
    entrypoint: Path = pydantic.Field(
        description="The path of the entrypoint HTML file, relative to the root."
    )
    dependencies: list[Path] = pydantic.Field(
        description="List of paths to all files needed by the entrypoint HTML, relative to the root."
    )


# %%
_SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def _get_entrypoint_relative_path(
    graph_serialized: str,
    slug: str | None,
) -> Path:
    if slug is None:
        entrypoint_stem = hash_string(s=graph_serialized)
    else:
        if not _SLUG_PATTERN.fullmatch(slug):
            raise ValueError(
                "Slug must contain only lowercase letters, digits, and single hyphens "
                "between alphanumeric groups."
            )
        entrypoint_stem = slug

    return Path("graphs") / f"{entrypoint_stem}.html"


def _get_asset_relative_path(asset_media_type: MediaType, asset_sha256: SHA256) -> Path:
    return (
        Path("assets")
        / asset_media_type
        / f"{asset_sha256}.{get_extension_from_media_type(asset_media_type)}"
    )


def build_site(
    graph: Graph | list[Graph],
    savedir: os.PathLike | str,
    slug: str | None = None,
) -> BuildSiteResult:
    """Build a static website for one or more Graphs and save it to disk.

    Args:
        graph: Graph to serialize and render into a site, or a nonempty list
            of Graphs. If a list is provided, the static page selects one Graph
            i.i.d. from the uniform distribution on each page load. This
            assignment does not guarantee balanced sample counts.
        savedir: Directory to write the site into.
        slug: Optional human-readable URL slug for the entrypoint HTML file.

    Returns:
        BuildSiteResult with the site root, entrypoint, and dependency list.

    Raises:
        ValueError: If savedir is not a directory.
        ValueError: If graph is an empty list.
        ValueError: If slug is invalid or collides with a different built Graph.

    Site layout:
        ```
        assets/
            {mime-type-1}/{mime-type-2}/{sha256}.{ext}
        runtime/
            nodekit.{js-digest}.js
            nodekit.{css-digest}.css
        graphs/
            {graph-payload-digest}.html (if slug is None)
            {slug}.html (if slug is provided)
        ```
    """
    savedir = Path(savedir)
    if not savedir.exists():
        savedir.mkdir(parents=True, exist_ok=True)

    if not savedir.is_dir():
        raise ValueError(f"Savedir must be a directory: {savedir}")

    if isinstance(graph, list):
        if len(graph) == 0:
            raise ValueError("graph list must be nonempty.")
        graphs = graph
    else:
        graphs = [graph]

    dependencies = []

    # Ensure the browser runtime is saved to the appropriate location:
    browser_bundle = get_browser_bundle()
    css_relative_path = Path("runtime") / f"nodekit.{browser_bundle.css_sha256}.css"
    js_relative_path = Path("runtime") / f"nodekit.{browser_bundle.js_sha256}.js"
    css_abs_path = savedir / css_relative_path
    js_abs_path = savedir / js_relative_path
    dependencies.append(css_relative_path)
    dependencies.append(js_relative_path)
    if not css_abs_path.exists():
        css_abs_path.parent.mkdir(parents=True, exist_ok=True)
        css_abs_path.write_text(browser_bundle.css)
    if not js_abs_path.exists():
        js_abs_path.parent.mkdir(parents=True, exist_ok=True)
        js_abs_path.write_text(browser_bundle.js)

    # Ensure all assets saved to the appropriate location:
    for graph in graphs:
        for asset in iter_assets(graph=graph):
            asset_relative_path = _get_asset_relative_path(
                asset_media_type=asset.media_type,
                asset_sha256=asset.sha256,
            )
            asset_abs_path = savedir / asset_relative_path
            dependencies.append(asset_relative_path)
            if not asset_abs_path.exists():
                # Copy the asset to the savepath:
                asset_abs_path.parent.mkdir(parents=True, exist_ok=True)
                save_asset(
                    asset=asset,
                    path=asset_abs_path,
                )

    graphs = [
        transform_asset_locators(
            graph=graph,
            transform=lambda asset: RelativePath(
                relative_path=Path("..")
                / _get_asset_relative_path(
                    asset_media_type=asset.media_type,
                    asset_sha256=asset.sha256,
                )
            ),
        )
        for graph in graphs
    ]

    # Render the HTML site using the Jinja2 template:
    jinja2_location = Path(__file__).parent / "harness.j2"
    jinja2_loader = jinja2.FileSystemLoader(searchpath=jinja2_location.parent)
    jinja2_env = jinja2.Environment(loader=jinja2_loader)
    # Save the graph site:
    _graph_list_adapter = pydantic.TypeAdapter(list[Graph])
    graphs_serialized = _graph_list_adapter.dump_json(graphs).decode("utf-8")
    graphs_gz_bytes = gzip.compress(graphs_serialized.encode("utf-8"), mtime=0)
    graphs_gz_b64 = base64.b64encode(graphs_gz_bytes).decode("ascii")
    graphs_gz_b64_wrapped = "\n".join(
        graphs_gz_b64[i : i + 120] for i in range(0, len(graphs_gz_b64), 120)
    )
    entrypoint_relative_path = _get_entrypoint_relative_path(
        graph_serialized=graphs_serialized, slug=slug
    )

    template = jinja2_env.get_template(jinja2_location.name)
    rendered_html = template.render(
        graphs_gz_b64=graphs_gz_b64_wrapped,
        css_path=Path("..") / css_relative_path,
        js_path=Path("..") / js_relative_path,
    )
    graph_html_path = savedir / entrypoint_relative_path
    graph_html_path.parent.mkdir(parents=True, exist_ok=True)
    if graph_html_path.exists() and graph_html_path.read_text() != rendered_html:
        raise ValueError(f"Slug collision at {entrypoint_relative_path}")
    graph_html_path.write_text(rendered_html)

    return BuildSiteResult(
        site_root=savedir.resolve(),
        entrypoint=entrypoint_relative_path,
        dependencies=dependencies,
    )
