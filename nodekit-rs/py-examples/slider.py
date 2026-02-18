from pathlib import Path
from PIL import Image
import nodekit as nk

d = Path(__file__).parent.joinpath("slider")
d.mkdir(parents=True, exist_ok=True)

card = nk.cards.TextCard(
    text="Hello world!",
    region=nk.Region(x=0, y=300, w=600, h=90),
)
sensor = nk.sensors.SliderSensor(
    duration_msec=10000,
    num_bins=6,
    initial_bin_index=0,
    show_bin_markers=True,
    region=nk.Region(x=0, y=100, w=500, h=100),
    confirm_button=nk.cards.TextCard(
        text="Confirm", region=nk.Region(x=0, y=0, w=120, h=80), background_color="#EDEDEDAA"
    ),
)
board_color = "#ffffffff"
state = nk.experimental.renderer.State(board_color=board_color, card=card, sensor=sensor)
state.set_pointer(0, 300)
renderer = nk.experimental.renderer.Renderer()
board = renderer.render(state=state)
Image.fromarray(board).save(d.joinpath("0.png").as_posix())

# Move the thumb and set the slider as committed.
state.set_slider(bin=3, committed=True, confirm_button_state='enabled')
board = renderer.render(state=state)
Image.fromarray(board).save(d.joinpath("1.png").as_posix())

# Move the pointer and hover over the confirm button.
state.set_pointer(0, 0)
state.set_slider(bin=3, committed=True, confirm_button_state='hovering')
board = renderer.render(state=state)
Image.fromarray(board).save(d.joinpath("2.png").as_posix())
