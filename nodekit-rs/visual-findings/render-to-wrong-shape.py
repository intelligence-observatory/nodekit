import numpy as np
import nodekit as nk
from nodekit_rs import Renderer, State


# %%
renderer = Renderer()
card = nk.cards.TextCard(
    text="This should render once, then crash on a bad buffer shape.",
    region=nk.Region(x=0, y=0, w=700, h=160),
    justification_vertical="center",
    justification_horizontal="left",
    text_color="#ffffffff",
    background_color="#00000033",
)
state = State(board_color="#808080ff", card=card)
renderer.set_pointer_visibility(False)

good = Renderer.empty_board()
renderer.render_to(state, good)


# %% panics in Rust and aborts Python due to a shape mismatch
bad = np.zeros((768, 1024, 2), dtype=np.uint8)
renderer.render_to(state, bad)


