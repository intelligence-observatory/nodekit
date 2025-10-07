import os
import zipfile

from nodekit._internal.ops.collect_asset_files import collect_asset_files
from nodekit._internal.ops.hash_asset_file import get_extension
from nodekit._internal.types.graph import Graph

GraphId = str

def pack(
    graph: Graph,
    path: str | os.PathLike,
) -> None:
    """
    Packs the Graph into a .nkg file, which is a .zip archive with the following structure:

    graph.json
    assets/
        {mime-type-1}/{mime-type-2}/{sha256}.{ext}
    """
    # Write the manifest.json

    # Collect the AssetFiles from the Graph:
    asset_files = collect_asset_files(graph=graph)

    # Ensure the given path ends with .nkg or has no extension:
    if not str(path).endswith('.nkg'):
        path = f"{path}.nkg"
    if not str(path).endswith('.nkg'):
        raise ValueError(f"Path must end with .nkg: {path}")

    # Open a zip file for writing:
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Write graph.json
        graph_json_path = 'graph.json'
        zf.writestr(graph_json_path, graph.model_dump_json())

        # Copy assets
        for asset in asset_files:
            extension = get_extension(media_type=asset.mime_type)
            asset_path = os.path.join('assets', asset.mime_type, f"{asset.sha256}.{extension}")
            source_path = asset.path
            zf.write(source_path, asset_path)

    # No return value




def unpack(
    path: str | os.PathLike,
) -> Graph:
    """
    Unpacks a .nkg file from disk and returns the corresponding Graph object.
    All AssetFiles in the Graph are backed by the asset files in the .nkg archive.
    The user is responsible for ensuring the .nkg file is not moved or edited while the Graph is in use.
    """
    raise NotImplementedError
