from pathlib import Path
from nodekit_rs import (
    Card,
    Rect,
    Timer,
    JustificationHorizontal,
    JustificationVertical,
    State,
)


def get_state() -> State:
    d = Path(__file__).parent.parent
    return State(
        "#AAAAAAFF",
        [
            Card.image_card(
                rect=Rect(-0.25, -0.25, 0.25, 0.5),
                timer=Timer(0, None),
                path=d.joinpath("nodekit-rs-image/test_image.png").resolve(),
                z_index=0,
            ),
            Card.video_card(
                rect=Rect(0, 0, 0.33, 0.25),
                timer=Timer(0, None),
                path=d.joinpath("nodekit-rs-video/test-video.mp4").resolve(),
                z_index=1,
                looped=False,
            ),
            Card.text_card(
                rect=Rect(-0.5, -0.5, 1, 0.1),
                timer=Timer(0, None),
                justification_horizontal=JustificationHorizontal.Left,
                justification_vertical=JustificationVertical.Top,
                background_color="#E6E6E600",
                font_size=0.02,
                text="Click the **test image**",
                text_color="#000000FF",
                z_index=2,
            ),
        ],
    )
