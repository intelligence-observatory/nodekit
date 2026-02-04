import nodekit as nk
from common import render

card = nk.cards.TextCard(
    text="Hello world!",
    region=nk.Region(x=0, y=300, w=600, h=90),
)
sensor = nk.sensors.SliderSensor(
    duration_msec=10000,
    num_bins=6,
    initial_bin_index=3,
    show_bin_markers=True,
    region=nk.Region(x=0, y=100, w=500, h=100),
    confirm_button=nk.cards.TextCard(text="Confirm", region=nk.Region(x=0, y=0, w=120, h=80)),
)
board_color = "#ffffffff"
node = nk.Node(
    card=card,
    board_color=board_color,
    sensor=sensor,
)


render(card=card, sensor=sensor, board_color=board_color, filename="slider_rs")
graph = nk.concat([node])
nk.play(graph)
