from pathlib import Path
from PIL import Image, ImageFont, ImageDraw
from nodekit_rs import (
    Card,
    Rect,
    Timer,
    JustificationHorizontal,
    JustificationVertical,
    Renderer,
    State,
)

# Use this image for the final render.
font_size = 20
font_padding = 4
title_height = font_size + font_padding * 2
board_dimension = 768
dimension = board_dimension * 2 + title_height * 2
image = Image.new("RGB", (dimension, dimension))
font_path = Path(
    "../nodekit-rs-text/fonts/Inter/Inter-VariableFont_opsz,wght.ttf"
).resolve()
font = ImageFont.truetype(font_path.as_posix(), font_size)
draw = ImageDraw.Draw(image)
# Define the header positions.
header_positions = [
    (font_padding, font_padding),
    (font_padding * 2 + board_dimension, font_padding),
    (font_padding, font_padding + title_height + board_dimension),
    (font_padding * 2 + board_dimension, font_padding + title_height + board_dimension),
]


def paste_bitmap(bitmap: bytes, index: int) -> None:
    im = Image.frombytes("RGB", (board_dimension, board_dimension), bitmap)
    header_position = header_positions[index]
    # Paste.
    image.paste(im, (header_position[0], header_position[1] + title_height))
    # Annotate.
    draw.text(header_position, f"t={state.t_msec}", font=font)


d = Path(__file__).parent.parent
# Define the state using provisional card models.
state = State(
    board_color="#AAAAAAFF",
    cards=[
        Card.image_card(
            rect=Rect(-0.25, -0.25, 0.25, 0.5),
            timer=Timer(0, None),
            path=d.joinpath("nodekit-rs-image/test_image.png").resolve(),
            z_index=0,
        ),
        Card.video_card(
            rect=Rect(0, 0, 0.33, 0.25),
            timer=Timer(100, 500),
            path=d.joinpath("nodekit-rs-video/test-video.mp4").resolve(),
            z_index=1,
            looped=False,
        ),
        Card.text_card(
            rect=Rect(-0.5, -0.5, 1, 0.1),
            timer=Timer(200, None),
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

# Create the renderer.
renderer = Renderer()
# t=0
board = renderer.render(state)
paste_bitmap(board, 0)

# At t=100, the video card appears.
state.t_msec = 150
state.set_pointer(x=0.2, y=-0.345)
board = renderer.render(state)
paste_bitmap(board, 1)

# At t=200, the text card appears.
state.t_msec = 220
state.set_pointer(x=-0.3, y=0.4)
board = renderer.render(state)
paste_bitmap(board, 2)

# At t=500, the video card disappears.
state.t_msec = 600
state.set_pointer(x=0.1, y=-0.2)
board = renderer.render(state)
paste_bitmap(board, 3)

# Save the image.
image.save(Path(__file__).parent.joinpath("multiframe.png").resolve().as_posix())
image.show()
