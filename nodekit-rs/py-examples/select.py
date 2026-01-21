from pathlib import Path
from PIL import Image
import nodekit as nk
from nodekit_rs import Renderer, State

src_directory = Path(__file__).parent.joinpath("select").resolve()


def image_card(x: int, y: int, filename: str) -> nk.cards.ImageCard:
    return nk.cards.ImageCard(
        region=nk.Region(x=x, y=y, w=128, h=128, z_index=None),
        image=nk.assets.Image.from_path(src_directory.joinpath(f"{filename}.png")),
    )


card = nk.cards.TextCard(
    region=nk.Region(x=0, y=400, w=1024, h=200, z_index=2),
    text="# Select the square labeled C",
    justification_horizontal="center",
    text_color="#000000FF",
    background_color="#E6E6E611",
)
confirm_button = nk.cards.TextCard(
    region=nk.Region(x=0, y=-400, w=200, h=60, z_index=10),
    text="Done",
    justification_horizontal="center",
    text_color="#000000FF",
    background_color="#FF00FFFF",
)
sensor = nk.sensors.MultiSelectSensor(
    choices={
        "a": image_card(-200, 0, "a"),
        "b": image_card(0, 0, "b"),
        "c": image_card(200, 0, "c"),
    },
    min_selections=0,
    max_selections=3,
    confirm_button=confirm_button,
)
state = State(board_color="#DDDDDDFF", card=card, sensor=sensor)
state.select(choice="b", select=True)
state.hover(choice="c")
state.set_pointer(x=245, y=20)
renderer = Renderer()
board = renderer.render(state=state)

Image.fromarray(board).show()
