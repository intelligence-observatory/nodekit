import base64
import gzip
import re
from pathlib import Path

import nodekit as nk

from nodekit._internal.types.assets import RelativePath
from nodekit._internal.utils.iter_assets import iter_assets


def test_build_site_outputs_site_with_assets(tmp_path: Path, graph_with_assets: nk.Graph):
    site_dir = tmp_path / "site"

    result = nk.build_site(graph=graph_with_assets, savedir=site_dir)

    entrypoint_path = result.site_root / result.entrypoint
    assert entrypoint_path.exists()

    for dependency in result.dependencies:
        dep_path = result.site_root / dependency
        assert dep_path.exists()

    html = entrypoint_path.read_text()
    graph_gz_b64 = re.search(r"const graphGzB64 = `(?P<graph>.*?)`;", html, re.DOTALL)
    assert graph_gz_b64 is not None
    graph_json = gzip.decompress(
        base64.b64decode("".join(graph_gz_b64.group("graph").split()))
    ).decode("utf-8")
    built_graph = nk.Graph.model_validate_json(graph_json)

    for asset in iter_assets(graph=built_graph):
        assert isinstance(asset.locator, RelativePath)
        asset_abs = entrypoint_path.parent / asset.locator.relative_path
        assert asset_abs.exists()
        assert asset.locator.relative_path.parts[0:3] == ("..", "..", "assets")


def test_build_site_entrypoint_renders_visible_load_error(
    tmp_path: Path, graph_with_assets: nk.Graph
):
    site_dir = tmp_path / "site"

    result = nk.build_site(graph=graph_with_assets, savedir=site_dir)

    entrypoint_path = result.site_root / result.entrypoint
    html = entrypoint_path.read_text()

    assert "Unable to load this NodeKit site" in html
    assert "renderLoadError(message);" in html
    assert 'throw new Error("DecompressionStream is not available in this browser.")' in html
