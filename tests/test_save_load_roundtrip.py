from pathlib import Path

import nodekit as nk

from nodekit._internal.types.assets import ZipArchiveInnerPath
from nodekit._internal.utils.iter_assets import iter_assets


def test_save_load_roundtrip_preserves_assets(tmp_path: Path, graph_with_assets: nk.Graph):
    archive_path = tmp_path / "graph.nkg"

    saved_path = nk.save_graph(graph_with_assets, archive_path)
    loaded_graph = nk.load_graph(saved_path)

    assert isinstance(loaded_graph, nk.Graph)

    original_assets = {
        (asset.sha256, asset.media_type) for asset in iter_assets(graph=graph_with_assets)
    }
    loaded_assets = {(asset.sha256, asset.media_type) for asset in iter_assets(graph=loaded_graph)}
    assert loaded_assets == original_assets

    for asset in iter_assets(graph=loaded_graph):
        assert isinstance(asset.locator, ZipArchiveInnerPath)
        assert asset.locator.zip_archive_path == saved_path.resolve()
