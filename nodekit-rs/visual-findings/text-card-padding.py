from nodekit_rs import Renderer, State
import nodekit as nk
from PIL import Image


# %%
renderer = Renderer()
card = nk.cards.TextCard(
    text='Hello **world!**',
    background_color="#eb403434",
    region=nk.Region(
        x=0, y=0, w = 500, h=100,
    ),
    justification_vertical='center',
    justification_horizontal='left',
)

state = State(board_color="#808080ff", card= card)
state.set_pointer(20, 20)
image = renderer.empty_board(
)

renderer.render_to(state, image)

nk.play(nk.Node(
    card=card,
    sensor=nk.sensors.KeySensor(keys=['f', 'j']), board_color="#808080ff",
))
image = Image.fromarray(image)
image.save('hello_nodekit_rs.png')
