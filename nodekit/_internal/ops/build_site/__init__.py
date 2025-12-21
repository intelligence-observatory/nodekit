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
        description="The path of the index html (relative to the root)."
    )
    dependencies: list[Path] = pydantic.Field(
        description="List of paths to all files needed by the index html, relative to the root."
    )


def build_site(
    graph: Graph,
    savedir: os.PathLike | str,
) -> BuildSiteResult:
    """Build a static website for a Graph and save it to disk.

    Args:
        graph: Graph to serialize and render into a site.
        savedir: Directory to write the site into.

    Returns:
        BuildSiteResult with the site root, entrypoint, and dependency list.

    Raises:
        ValueError: If savedir is not a directory.

    Site layout:
        * assets/
            {mime-type-1}/{mime-type-2}/{sha256}.{ext}
        * runtime/
            nodekit.{js-digest}.js
            nodekit.{css-digest}.css
        * graphs/
            {graph_digest}/
                index.html
                graph.json
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

        # Mutate the asset locator in the graph to be a RelativePath - relative to the graph!:
        asset.locator = RelativePath(relative_path=Path("../..") / asset_relative_path)

    # Render the HTML site using the Jinja2 template:
    jinja2_location = Path(__file__).parent / "harness.j2"
    jinja2_loader = jinja2.FileSystemLoader(searchpath=jinja2_location.parent)
    jinja2_env = jinja2.Environment(loader=jinja2_loader)
    template = jinja2_env.get_template(jinja2_location.name)
    rendered_html = template.render(
        graph=graph.model_dump(mode="json"),
        css_path=Path("../..") / css_relative_path,
        js_path=Path("../..") / js_relative_path,
    )

    # Save the graph site:
    graph_serialized = graph.model_dump_json()
    graph_digest = hash_string(s=graph_serialized)
    graph_dir = savedir / "graphs" / graph_digest
    graph_dir.mkdir(parents=True, exist_ok=True)
    graph_html_path = graph_dir / "index.html"
    graph_html_path.write_text(rendered_html)

    return BuildSiteResult(
        site_root=savedir.resolve(),
        entrypoint=graph_html_path.relative_to(savedir),
        dependencies=dependencies,
    )
