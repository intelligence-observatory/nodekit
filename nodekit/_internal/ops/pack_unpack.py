from typing import Dict
import os

from nodekit._internal.types.assets import AssetFile
from nodekit._internal.types.cards.cards import (
    ImageCard,
    VideoCard,
)
from nodekit._internal.types.common import (
    MimeType,
    SHA256,
)
from nodekit._internal.types.graph import Graph


def pack(
    path: str | os.PathLike,
    graph: Graph,
) -> None:
    """
    Packs the Graph into a .nkg file, which is a .zip archive with the following structure:

    graph.json
    assets/
        {mime-type-1}/{mime-type-2}/{sha256}.{ext}

    """
    # Copy all Assets to assets/ folder
    # Write the manifest.json
    # Collect the AssetFiles from all Nodes:

    assets: Dict[MimeType, Dict[SHA256, AssetFile]] = {}
    for node in graph.nodes.values():
        for card in node.cards:
            if isinstance(card, ImageCard):
                image = card.image
                if image.mime_type not in assets:
                    assets[image.mime_type] = {}
                assets[image.mime_type][image.sha256] = image
            elif isinstance(card, VideoCard):
                video = card.video
                if video.mime_type not in assets:
                    assets[video.mime_type] = {}
                assets[video.mime_type][video.sha256] = video
    raise NotImplementedError


def unpack(
    path: str | os.PathLike,
) -> Graph:
    """
    Unpacks a .nkg file from disk and returns the corresponding Graph object.
    All AssetFiles in the Graph are backed by the asset files in the .nkg archive.
    The user is responsible for ensuring the .nkg file is not moved or edited while the Graph is in use.
    """
    raise NotImplementedError
