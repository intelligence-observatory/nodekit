from PIL import Image

from state import get_state
import nodekit as nk

state = get_state()
renderer = nk.experimental.renderer.Renderer()
state.t_msec = 300
board = renderer.render(state)

Image.fromarray(board).show()
