import base64
import gzip
import re
from pathlib import Path

import nodekit as nk
import pytest

from nodekit._internal.types.assets import RelativePath
from nodekit._internal.utils.hashing import hash_string
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
    graph_hash = hash_string(s=built_graph.model_dump_json())

    assert result.entrypoint == Path("graphs") / f"{graph_hash}.html"

    for asset in iter_assets(graph=built_graph):
        assert isinstance(asset.locator, RelativePath)
        asset_abs = entrypoint_path.parent / asset.locator.relative_path
        assert asset_abs.exists()
        assert asset.locator.relative_path.parts[0:2] == ("..", "assets")


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


def test_build_site_is_deterministic_for_same_graph(tmp_path: Path, graph_with_assets: nk.Graph):
    first_dir = tmp_path / "site-1"
    second_dir = tmp_path / "site-2"

    first_result = nk.build_site(graph=graph_with_assets, savedir=first_dir)
    second_result = nk.build_site(graph=graph_with_assets, savedir=second_dir)

    first_entrypoint = (first_result.site_root / first_result.entrypoint).read_text()
    second_entrypoint = (second_result.site_root / second_result.entrypoint).read_text()

    assert first_result.entrypoint == second_result.entrypoint
    assert first_entrypoint == second_entrypoint


def test_build_site_slug_uses_flat_entrypoint(tmp_path: Path, graph_with_assets: nk.Graph):
    site_dir = tmp_path / "site"

    result = nk.build_site(graph=graph_with_assets, savedir=site_dir, slug="my-graph")

    assert result.entrypoint == Path("graphs") / "my-graph.html"
    assert (result.site_root / result.entrypoint).exists()


@pytest.mark.parametrize(
    "slug",
    ["My-Graph", "my_graph", "-my-graph", "my-graph-", "my--graph"],
)
def test_build_site_rejects_invalid_slug(tmp_path: Path, graph_with_assets: nk.Graph, slug: str):
    site_dir = tmp_path / "site"

    with pytest.raises(
        ValueError,
        match="Slug must contain only lowercase letters, digits, and single hyphens",
    ):
        nk.build_site(graph=graph_with_assets, savedir=site_dir, slug=slug)


def test_build_site_slug_is_idempotent_for_same_graph(tmp_path: Path, graph_with_assets: nk.Graph):
    site_dir = tmp_path / "site"

    first_result = nk.build_site(graph=graph_with_assets, savedir=site_dir, slug="shared")
    second_result = nk.build_site(graph=graph_with_assets, savedir=site_dir, slug="shared")

    first_entrypoint = (first_result.site_root / first_result.entrypoint).read_text()
    second_entrypoint = (second_result.site_root / second_result.entrypoint).read_text()

    assert first_result.entrypoint == Path("graphs") / "shared.html"
    assert second_result.entrypoint == Path("graphs") / "shared.html"
    assert first_entrypoint == second_entrypoint


def test_build_site_slug_raises_for_different_graph(tmp_path: Path, graph_with_assets: nk.Graph):
    site_dir = tmp_path / "site"

    nk.build_site(graph=graph_with_assets, savedir=site_dir, slug="shared")

    different_graph = graph_with_assets.model_copy(deep=True)
    different_graph.transitions["start"] = nk.transitions.Go(to="start")

    with pytest.raises(ValueError, match=r"Slug collision at graphs/shared\.html"):
        nk.build_site(graph=different_graph, savedir=site_dir, slug="shared")
