import base64
import gzip
import re
from pathlib import Path

import nodekit as nk
import pydantic
import pytest

from nodekit._internal.types.assets import RelativePath
from nodekit._internal.utils.hashing import hash_string
from nodekit._internal.utils.iter_assets import iter_assets


ASSET_DIR = Path(__file__).parent / "assets"
GRAPH_LIST_ADAPTER = pydantic.TypeAdapter(list[nk.Graph])


def _load_built_graphs(entrypoint_path: Path) -> list[nk.Graph]:
    html = entrypoint_path.read_text()
    graphs_gz_b64 = re.search(r"const graphsGzB64 = `(?P<graphs>.*?)`;", html, re.DOTALL)
    assert graphs_gz_b64 is not None
    graphs_json = gzip.decompress(
        base64.b64decode("".join(graphs_gz_b64.group("graphs").split()))
    ).decode("utf-8")
    return GRAPH_LIST_ADAPTER.validate_json(graphs_json)


def _graph_list_hash(graphs: list[nk.Graph]) -> str:
    return hash_string(s=GRAPH_LIST_ADAPTER.dump_json(graphs).decode("utf-8"))


def _asset_graph(asset_path: Path) -> nk.Graph:
    image = nk.assets.Image.from_path(asset_path)
    return nk.Graph(
        nodes={
            "start": nk.Node(
                card=nk.cards.ImageCard(
                    image=image,
                    region=nk.Region(x=0, y=0, w=200, h=200),
                ),
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )


def test_build_site_outputs_site_with_assets(tmp_path: Path, graph_with_assets: nk.Graph):
    site_dir = tmp_path / "site"

    result = nk.build_site(graph=graph_with_assets, savedir=site_dir)

    entrypoint_path = result.site_root / result.entrypoint
    assert entrypoint_path.exists()

    for dependency in result.dependencies:
        dep_path = result.site_root / dependency
        assert dep_path.exists()

    built_graphs = _load_built_graphs(entrypoint_path=entrypoint_path)
    assert len(built_graphs) == 1
    built_graph = built_graphs[0]
    graph_hash = _graph_list_hash(built_graphs)

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


def test_build_site_outputs_site_with_multiple_graphs(tmp_path: Path, graph_with_assets: nk.Graph):
    site_dir = tmp_path / "site"
    different_graph = graph_with_assets.model_copy(deep=True)
    different_graph.annotation = {"condition": "different"}

    result = nk.build_site(graph=[graph_with_assets, different_graph], savedir=site_dir)

    entrypoint_path = result.site_root / result.entrypoint
    built_graphs = _load_built_graphs(entrypoint_path=entrypoint_path)
    graph_hash = _graph_list_hash(built_graphs)

    assert result.entrypoint == Path("graphs") / f"{graph_hash}.html"
    assert built_graphs[0].annotation == graph_with_assets.annotation
    assert built_graphs[1].annotation == different_graph.annotation


def test_build_site_saves_assets_from_all_graphs(tmp_path: Path):
    site_dir = tmp_path / "site"
    png_graph = _asset_graph(
        ASSET_DIR / "629cd38bb1526395e0a01e0eb6985b973ea1077b170911f221b1b84c9d3446d8.png"
    )
    svg_graph = _asset_graph(ASSET_DIR / "fixation-cross.svg")

    result = nk.build_site(graph=[png_graph, svg_graph], savedir=site_dir)

    entrypoint_path = result.site_root / result.entrypoint
    built_graphs = _load_built_graphs(entrypoint_path=entrypoint_path)

    for built_graph in built_graphs:
        for asset in iter_assets(graph=built_graph):
            assert isinstance(asset.locator, RelativePath)
            asset_abs = entrypoint_path.parent / asset.locator.relative_path
            assert asset_abs.exists()
            assert asset.locator.relative_path.parts[0:2] == ("..", "assets")


def test_build_site_is_deterministic_for_same_graph_list(
    tmp_path: Path, graph_with_assets: nk.Graph
):
    first_dir = tmp_path / "site-1"
    second_dir = tmp_path / "site-2"
    different_graph = graph_with_assets.model_copy(deep=True)
    different_graph.annotation = {"condition": "different"}

    first_result = nk.build_site(graph=[graph_with_assets, different_graph], savedir=first_dir)
    second_result = nk.build_site(graph=[graph_with_assets, different_graph], savedir=second_dir)

    first_entrypoint = (first_result.site_root / first_result.entrypoint).read_text()
    second_entrypoint = (second_result.site_root / second_result.entrypoint).read_text()

    assert first_result.entrypoint == second_result.entrypoint
    assert first_entrypoint == second_entrypoint


def test_build_site_rejects_empty_graph_list(tmp_path: Path):
    site_dir = tmp_path / "site"

    with pytest.raises(ValueError, match="graph list must be nonempty"):
        nk.build_site(graph=[], savedir=site_dir)


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


def test_build_site_slug_raises_for_different_graph_list(
    tmp_path: Path, graph_with_assets: nk.Graph
):
    site_dir = tmp_path / "site"
    different_graph = graph_with_assets.model_copy(deep=True)
    different_graph.annotation = {"condition": "different"}

    nk.build_site(graph=[graph_with_assets], savedir=site_dir, slug="shared")

    with pytest.raises(ValueError, match=r"Slug collision at graphs/shared\.html"):
        nk.build_site(graph=[graph_with_assets, different_graph], savedir=site_dir, slug="shared")
