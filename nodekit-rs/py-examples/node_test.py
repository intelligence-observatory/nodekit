from PIL import Image

from state import get_state
from nodekit_rs import Renderer

state = get_state()
renderer = Renderer()
state.t_msec = 300
board = renderer.render(state)

# TODO wrap this elsewhere
Image.frombytes("RGB", (768, 768), board).show()
