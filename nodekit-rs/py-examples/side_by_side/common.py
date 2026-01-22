from pathlib import Path
from PIL import Image
import nodekit as nk

ASSETS_DIRECTORY = Path(__file__).parent.joinpath("assets").resolve()


def render(card: nk.cards.Card, board_color: str, filename: str) -> None:
    """
    Render using nodekit-rs
    """

    path = Path(__file__).parent.joinpath(f"output/{filename}.png").resolve()
    renderer = nk.experimental.renderer.Renderer()
    renderer.set_pointer_visibility(False)
    board = renderer.render(
        nk.experimental.renderer.State(
            card=card, board_color=board_color, sensor=nk.sensors.WaitSensor(duration_msec=10000)
        )
    )
    Image.fromarray(board).save(path)
