from nodekit._internal.types.graph import Graph
from nodekit._internal.types.assets import AssetFile
from nodekit._internal.types.cards.cards import (
    ImageCard,
    VideoCard,
)
from nodekit._internal.types.common import (
    MediaType,
    SHA256,
)
from typing import Dict, List


def collect_asset_files(graph: Graph) -> List[AssetFile]:
    assets: Dict[MediaType, Dict[SHA256, AssetFile]] = {}
    for node in graph.nodes.values():
        for card in node.cards:
            if isinstance(card, ImageCard):
                image = card.image
                if image.media_type not in assets:
                    assets[image.media_type] = {}
                assets[image.media_type][image.sha256] = image
            elif isinstance(card, VideoCard):
                video = card.video
                if video.media_type not in assets:
                    assets[video.media_type] = {}
                assets[video.media_type][video.sha256] = video

    # Return as list:
    asset_files: List[AssetFile] = []
    for mime_type_dict in assets.values():
        asset_files.extend(mime_type_dict.values())
    return asset_files
