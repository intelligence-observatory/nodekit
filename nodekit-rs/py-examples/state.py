from pathlib import Path
import nodekit as nk


def get_state() -> nk.experimental.renderer.State:
    d = Path(__file__).parent.parent
    cards = {
        "image": nk.cards.ImageCard(
            region=nk.Region(x=-256, y=-256, w=256, h=512, z_index=0),
            image=nk.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        "video": nk.cards.VideoCard(
            region=nk.Region(x=100, y=50, w=410, h=614, z_index=1),
            video=nk.assets.Video.from_path(
                d.joinpath("nodekit-rs-video/test-video.mp4").resolve()
            ),
        ),
        "text": nk.cards.TextCard(
            region=nk.Region(x=-512, y=-384, w=1024, h=200, z_index=2),
            text="# Click the **test image**",
            justification_horizontal="left",
            text_color="#000000FF",
            background_color="#E6E6E611",
        ),
    }
    card = nk.cards.CompositeCard(children=cards)
    return nk.experimental.renderer.State(
        board_color="#AAAAAAFF", card=card, sensor=nk.sensors.WaitSensor(duration_msec=10000)
    )
