from pathlib import Path
from PIL import Image
import nodekit as nk
from nodekit_rs import Renderer, State

ASSETS_DIRECTORY = Path(__file__).parent.joinpath('assets').resolve()

def render(card: nk.cards.Card, board_color: str, filename: str) -> None:
    """
    Render using nodekit-rs
    """

    p = Path(__file__).parent.joinpath(f'output/{filename}.png').resolve()
    board = Renderer().render(State(card=card, board_color=board_color))
    Image.fromarray(board).save(p)
