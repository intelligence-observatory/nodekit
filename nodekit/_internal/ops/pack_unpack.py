import os
import shutil
import zipfile
from pathlib import Path
from typing import Dict, Tuple

from nodekit._internal.ops.hash_asset_file import get_extension
from nodekit._internal.types.assets import ZipArchiveInnerPath, RelativePath, AssetLocator
from nodekit._internal.types.cards.cards import (
    ImageCard,
    VideoCard,
)
from nodekit._internal.types.common import MediaType, SHA256
from nodekit._internal.types.graph import Graph


# %%
def _get_archive_relative_path(media_type: MediaType, sha256: SHA256) -> Path:
    """
    Returns the relative path within the .nkg archive for a given asset.
    """
    extension = get_extension(media_type)
    return Path("assets") / media_type / f"{sha256}.{extension}"


# %%
def pack(
    graph: Graph,
    path: str | os.PathLike,
) -> Path:
    """
    Packs the Graph model into a .nkg file, which is the canonical representation of a Graph.
    A .nkg file is a .zip archive with the following structure:

    graph.json
    assets/
        {mime-type-1}/{mime-type-2}/{sha256}.{ext}
    """
    # Ensure the given path ends with .nkg or has no extension:
    path = Path(path)
    if not str(path).endswith(".nkg"):
        raise ValueError(f"Path must end with .nkg: {path}")

    if path.exists():
        raise ValueError(f"Path already exists: {path}")

    if not path.parent.exists():
        raise ValueError(f"Parent directory does not exist: {path.parent}")

    # Deep copy the Graph, as we will be modifying it so that all AssetLocators are RelativePathAssetLocators:
    graph = graph.model_copy(deep=True)

    # Mutate all AssetLocators in the Graph to be RelativePathAssetLocators:
    supplied_asset_locators: Dict[Tuple[MediaType, SHA256], AssetLocator] = {}
    relative_asset_locators: Dict[Tuple[MediaType, SHA256], RelativePath] = {}
    for node in graph.nodes.values():
        for card in node.cards:
            if isinstance(card, ImageCard):
                asset = card.image
            elif isinstance(card, VideoCard):
                asset = card.video
            else:
                continue

            # Log the asset locator if we haven't seen it before:
            asset_key = (asset.media_type, asset.sha256)
            if asset_key not in supplied_asset_locators:
                supplied_asset_locators[asset_key] = asset.locator.model_copy()
                relative_asset_locators[asset_key] = RelativePath(
                    relative_path=_get_archive_relative_path(
                        media_type=asset.media_type, sha256=asset.sha256
                    )
                )

            # Mutate the AssetLocator to be a RelativePathAssetLocator:
            asset.locator = relative_asset_locators[asset_key]

    # Open a temporary zip file for writing:
    temp_path = path.with_suffix(".nkg.tmp")
    if temp_path.exists():
        raise ValueError(f"Temporary path already exists: {temp_path}")

    try:
        with zipfile.ZipFile(temp_path, "w", zipfile.ZIP_DEFLATED) as myzip:
            # Write all asset files to the archive:
            for asset_key, asset_locator in supplied_asset_locators.items():
                with asset_locator.open() as src_file:
                    media_type, sha256 = asset_key
                    archive_relative_path = _get_archive_relative_path(
                        media_type, sha256
                    )
                    with myzip.open(str(archive_relative_path), "w") as dst_file:
                        shutil.copyfileobj(src_file, dst_file)

            # Write the graph.json file:
            myzip.writestr("graph.json", graph.model_dump_json(indent=2))

        # Rename the temporary file to the final path:
        temp_path.rename(path)
    finally:
        if temp_path.exists():
            temp_path.unlink()
    return Path(path)


# %%
def unpack(
    path: str | os.PathLike,
) -> Graph:
    """
    Unpacks a .nkg file from disk and returns the corresponding Graph object.
    All AssetFiles in the Graph are backed by the asset files in the .nkg archive.
    The user is responsible for ensuring the .nkg file is not moved or edited while the Graph is in use.
    """

    if not str(path).endswith(".nkg"):
        raise ValueError(f"Invalid path given; must end with .nkg: {path}")

    # Open the zip file for reading:
    with zipfile.ZipFile(path, "r") as zf:
        # Read graph.json
        with zf.open("graph.json") as f:
            graph = Graph.model_validate_json(f.read().decode("utf-8"))

        # Mutate all AssetLocators in the Graph from RelativePath to ZipArchiveInnerPath:
        for node in graph.nodes.values():
            for card in node.cards:
                if isinstance(card, ImageCard):
                    asset = card.image
                elif isinstance(card, VideoCard):
                    asset = card.video
                else:
                    continue

                # Raise a ValueError if the asset locator is not a RelativePath:
                if not isinstance(asset.locator, RelativePath):
                    raise ValueError(
                        f".nkg encoding error: Asset's locator is not a RelativePath: {asset}"
                    )

                # Mutate the asset locator
                asset.locator = ZipArchiveInnerPath(
                    zip_archive_path=Path(path), inner_path=asset.locator.relative_path
                )

    return graph
