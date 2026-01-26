from pathlib import Path
from PIL import Image

import nodekit as nk


cards = {
    'a': nk.cards.ImageCard(
        image=nk.assets.Image.from_path((Path(__file__).parent.joinpath('select/a.png').resolve())),
    region=nk.Region(x=0, y=300, w=100, h=100, z_index=0)),
    'b': nk.cards.TextCard(text='Describe the **image** show above.',
                           region=nk.Region(x=0, y=100, w=1024, h=200),
                           background_color='#00000000',
                           text_color='#000000ff',
                           font_size=28)
}
card = nk.cards.CompositeCard(children=cards)
sensor = nk.sensors.TextEntrySensor(duration_msec=10000,
                                    prompt='Enter text here',
                                    region=nk.Region(x=0, y=-100, w=400, h=300))

state = nk.experimental.renderer.State(card=card, sensor=sensor, board_color='#ffffffff')
state.set_pointer(x=-300, y=400)
renderer = nk.experimental.renderer.Renderer()
board = renderer.render(state=state)

out = Path(__file__).parent.joinpath('text_entry').resolve()
Image.fromarray(board).save(out.joinpath('0.png').as_posix())

state.set_pointer(x=-50, y=-160)
state.set_text_entry(text='A black letter "A" on a white background')
board = renderer.render(state=state)
Image.fromarray(board).save(out.joinpath('1.png').as_posix())