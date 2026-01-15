from pathlib import Path
import nodekit.assets
import nodekit.cards
from nodekit import Region
from nodekit_rs import State


def get_state() -> State:
    d = Path(__file__).parent.parent
    cards = {
        'image': nodekit.cards.ImageCard(
            region=Region(x=-256, y=-256, w=256, h=512, z_index=0),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        'video': nodekit.cards.VideoCard(
            region=Region(x=100, y=50, w=410, h=614, z_index=1),
            video=nodekit.assets.Video.from_path(
                d.joinpath("nodekit-rs-video/test-video.mp4").resolve()
            ),
        ),
        'text': nodekit.cards.TextCard(
            region=Region(x=-512, y=-384, w=1024, h=200, z_index=2),
            text="# Click the **test image**",
            justification_horizontal="left",
            text_color="#000000FF",
            background_color="#E6E6E611",
        ),
    }
    card = nodekit.cards.CompositeCard(children=cards)
    return State(board_color="#AAAAAAFF", card=card)
