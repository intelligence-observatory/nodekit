from pathlib import Path
import nodekit.assets
import nodekit.cards
from nodekit import Region
from nodekit_rs import State


def get_state() -> State:
    d = Path(__file__).parent.parent
    cards = [
        nodekit.cards.ImageCard(
            region=Region(x=-0.25, y=-0.25, w=0.25, h=0.5, z_index=0),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        nodekit.cards.VideoCard(
            region=Region(x=0, y=0, w=0.33, h=0.25, z_index=1),
            video=nodekit.assets.Video.from_path(
                d.joinpath("nodekit-rs-video/test-video.mp4").resolve()
            ),
        ),
        nodekit.cards.TextCard(
            region=Region(x=-0.5, y=-0.5, w=1, h=0.1, z_index=2),
            text="# Click the **test image**",
            justification_horizontal="left",
            text_color="#000000FF",
            background_color="#E6E6E600",
        ),
    ]
    return State(board_color="#AAAAAAFF", cards=cards)
