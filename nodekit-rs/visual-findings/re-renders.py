from pathlib import Path

import nodekit as nk
import PIL.Image
from nodekit_rs import Renderer, State


# %%
renderer = Renderer()
board = Renderer.empty_board()
root = Path(__file__).resolve().parents[1]
video_path = root.joinpath("nodekit-rs-video", "test-video.mp4").resolve()
out_dir = Path(__file__).parent / "frames"
out_dir.mkdir(exist_ok=True)

cards = {
    "video": nk.cards.VideoCard(
        region=nk.Region(x=0, y=0, w=1024, h=768, z_index=0),
        video=nk.assets.Video.from_path(video_path),
    ),
    "text": nk.cards.TextCard(
        text="Overlay text should stay the same shade across frames.",
        background_color="#00000033",
        text_color="#FFFFFFCC",
        region=nk.Region(x=0, y=0, w=900, h=220, z_index=1),
        justification_vertical="center",
        justification_horizontal="left",
    ),
}
card = nk.cards.CompositeCard(children=cards)
state = State(board_color="#808080ff", card=card)
renderer.set_pointer_visibility(False)


# %%
for i in range(60):
    state.t_msec = i * 33
    renderer.render_to(state, board)
    img = PIL.Image.fromarray(board)
    img.save(out_dir / f"frame_{i:03d}.png")
