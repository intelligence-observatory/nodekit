from pathlib import Path

import numpy as np
from PIL import Image, ImageFont, ImageDraw
from state import get_state
from nodekit_rs import Renderer

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


def paste(arr: np.ndarray, index: int) -> None:
    im = Image.fromarray(arr)
    header_position = header_positions[index]
    # Paste.
    image.paste(im, (header_position[0], header_position[1] + title_height))
    # Annotate.
    draw.text(header_position, f"t={state.t_msec}", font=font)


state = get_state()
# Create the renderer.
renderer = Renderer()
# t=0
board = renderer.render(state)
paste(board, 0)

state.t_msec = 150
state.set_pointer(x=0.2, y=-0.345)
board = renderer.render(state)
paste(board, 1)

state.t_msec = 220
state.set_pointer(x=-0.3, y=0.4)
board = renderer.render(state)
paste(board, 2)

state.t_msec = 600
state.set_pointer(x=0.1, y=-0.2)
board = renderer.render(state)
paste(board, 3)

# Save the image.
image.save(Path(__file__).parent.joinpath("multiframe.png").resolve().as_posix())
image.show()
