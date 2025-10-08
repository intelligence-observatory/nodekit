import os
import zipfile
from pathlib import Path
from typing import Dict

from nodekit._internal.ops.hash_asset_file import get_extension
from nodekit._internal.types.common import (
    MediaType,
    SHA256,
)
from nodekit._internal.types.graph import Graph, Manifest


# %%
def pack(
    graph: Graph,
    path: str | os.PathLike,
) -> Path:
    """
    Packs the Graph into a .nkg file, which is a .zip archive with the following structure:

    manifest.json
    assets/
        {mime-type-1}/{mime-type-2}/{sha256}.{ext}
    """
    # Ensure the given path ends with .nkg or has no extension:
    if not str(path).endswith('.nkg'):
        raise ValueError(f"Path must end with .nkg: {path}")

    manifest = graph._manifest

    # Package assets:
    assets: Dict[MediaType, Dict[SHA256, Path]] = {}
    for asset in asset_files:
        if asset.media_type not in assets:
            assets[asset.media_type] = {}
        extension = get_extension(media_type=asset.media_type)
        asset_path = Path('assets') / asset.media_type / f"{asset.sha256}.{extension}"
        assets[asset.media_type][asset.sha256] = asset_path


    # Open a zip file for writing:
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Write manifest.json
        manifest_json_path = 'manifest.json'
        zf.writestr(manifest_json_path, manifest.model_dump_json())

        # Copy assets
        for media_type in manifest.assets:
            for sha256, asset_path in manifest.assets[media_type].items():
                source_path = graph.asset_store. # todo
                zf.write(source_path, asset_path)

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

    if not str(path).endswith('.nkg'):
        raise ValueError(f"Path must end with .nkg: {path}")

    # Open the zip file for reading:
    with zipfile.ZipFile(path, 'r') as zf:
        # Read graph.json, ignoring any Image.path validators
        manifest_json_path = 'manifest.json'
        with zf.open(manifest_json_path) as f:
            manifest_json = f.read().decode('utf-8')
            manifest = Manifest.model_validate_json(manifest_json)

        # Back the AssetFiles in the Graph with the files in the zip archive:
        ...

    return graph