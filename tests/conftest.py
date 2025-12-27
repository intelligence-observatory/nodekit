from pathlib import Path

import pytest

import nodekit as nk

ASSET_DIR = Path(__file__).parent / "assets"


def _make_graph_with_assets() -> nk.Graph:
    png_asset = nk.assets.Image.from_path(
        ASSET_DIR / "629cd38bb1526395e0a01e0eb6985b973ea1077b170911f221b1b84c9d3446d8.png"
    )
    svg_asset = nk.assets.Image.from_path(ASSET_DIR / "fixation-cross.svg")
    video_asset = nk.assets.Video.from_path(ASSET_DIR / "test-video.mp4")

    stimulus = nk.cards.CompositeCard(
        children={
            "png-card": nk.cards.ImageCard(
                image=png_asset,
                region=nk.Region(x=-200, y=100, w=200, h=200),
            ),
            "svg-card": nk.cards.ImageCard(
                image=svg_asset,
                region=nk.Region(x=200, y=100, w=150, h=150),
            ),
            "video-card": nk.cards.VideoCard(
                video=video_asset,
                region=nk.Region(x=0, y=-200, w=250, h=180),
            ),
        }
    )

    return nk.Graph(
        nodes={
            "start": nk.Node(
                card=stimulus,
                sensor=nk.sensors.WaitSensor(duration_msec=1),
            ),
        },
        transitions={"start": nk.transitions.End()},
        start="start",
    )


@pytest.fixture
def graph_with_assets() -> nk.Graph:
    return _make_graph_with_assets()
