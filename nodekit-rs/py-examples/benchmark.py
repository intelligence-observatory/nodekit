from time import time
from state import get_state
from nodekit_rs import Renderer

state = get_state()
renderer = Renderer()
state.t_msec = 300

its = 1000
t0 = time()
for i in range(its):
    renderer.render(state)
print((time() - t0) / its)