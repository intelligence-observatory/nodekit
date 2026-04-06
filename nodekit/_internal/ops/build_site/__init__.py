import re
import base64
import gzip
import os
from pathlib import Path

import jinja2
import pydantic

from nodekit._internal.ops.open_asset_save_asset import save_asset
from nodekit._internal.types.assets import RelativePath
from nodekit._internal.types.graph import Graph
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


def build_site(
    graph: Graph,
    savedir: os.PathLike | str,
    slug: str | None = None,
) -> BuildSiteResult:
    """Build a static website for a Graph and save it to disk.

    Args:
        graph: Graph to serialize and render into a site.
        savedir: Directory to write the site into.
        slug: Optional human-readable URL slug for the entrypoint HTML file.

    Returns:
        BuildSiteResult with the site root, entrypoint, and dependency list.

    Raises:
        ValueError: If savedir is not a directory.
        ValueError: If slug is invalid or collides with a different built Graph.

    Site layout:
        ```
        assets/
            {mime-type-1}/{mime-type-2}/{sha256}.{ext}
        runtime/
            nodekit.{js-digest}.js
            nodekit.{css-digest}.css
        graphs/
            {graph_digest}.html (if slug is None)
            {slug}.html (if slug is provided)
        ```
    """
    savedir = Path(savedir)
    if not savedir.exists():
        savedir.mkdir(parents=True, exist_ok=True)

    if not savedir.is_dir():
        raise ValueError(f"Savedir must be a directory: {savedir}")

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
    graph = graph.model_copy(deep=True)
    for asset in iter_assets(graph=graph):
        asset_relative_path = (
            Path("assets")
            / asset.media_type
            / f"{asset.sha256}.{get_extension_from_media_type(asset.media_type)}"
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

        # Mutate the asset locator in the Graph to be relative to the entrypoint HTML.
        asset.locator = RelativePath(relative_path=Path("..") / asset_relative_path)

    # Render the HTML site using the Jinja2 template:
    jinja2_location = Path(__file__).parent / "harness.j2"
    jinja2_loader = jinja2.FileSystemLoader(searchpath=jinja2_location.parent)
    jinja2_env = jinja2.Environment(loader=jinja2_loader)
    # Save the graph site:
    graph_serialized = graph.model_dump_json()
    graph_gz_bytes = gzip.compress(graph_serialized.encode("utf-8"), mtime=0)
    graph_gz_b64 = base64.b64encode(graph_gz_bytes).decode("ascii")
    graph_gz_b64_wrapped = "\n".join(
        graph_gz_b64[i : i + 120] for i in range(0, len(graph_gz_b64), 120)
    )
    entrypoint_relative_path = _get_entrypoint_relative_path(
        graph_serialized=graph_serialized, slug=slug
    )

    template = jinja2_env.get_template(jinja2_location.name)
    rendered_html = template.render(
        graph_gz_b64=graph_gz_b64_wrapped,
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
