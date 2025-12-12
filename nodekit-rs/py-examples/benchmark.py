from pathlib import Path
from time import time
from state import get_state
import nodekit.assets
import nodekit.cards
from nodekit import Region
from nodekit_rs import Renderer, State

d = Path(__file__).parent.parent


def rgb() -> State:
    cards = [
        nodekit.cards.ImageCard(
            region=Region(x=-0.25, y=-0.25, w=0.25, h=0.5, z_index=0),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        nodekit.cards.ImageCard(
            region=Region(x=0, y=0, w=0.33, h=0.25, z_index=1),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        nodekit.cards.TextCard(
            region=Region(x=-0.5, y=-0.5, w=1, h=0.1, z_index=2),
            text="# Click the **test image**",
            justification_horizontal="left",
            text_color="#000000FF",
            background_color="#E6E6E6FF",
        ),
    ]
    return State(board_color="#AAAAAAFF", cards=cards)


def rgba() -> State:
    cards = [
        nodekit.cards.ImageCard(
            region=Region(x=-0.25, y=-0.25, w=0.25, h=0.5, z_index=0),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        nodekit.cards.ImageCard(
            region=Region(x=0, y=0, w=0.33, h=0.25, z_index=1),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        nodekit.cards.TextCard(
            region=Region(x=-0.5, y=-0.5, w=1, h=0.1, z_index=2),
            text="# Click the **test image**",
            justification_horizontal="left",
            text_color="#000000FF",
            background_color="#E6E6E633",
        ),
    ]
    return State(board_color="#AAAAAAFF", cards=cards)


renderer = Renderer()


def benchmark(state: State, message: str) -> None:
    print(message)
    its = 1000
    # Ignore the first frame because that's when assets are cached.
    renderer.render(state)
    t0 = time()
    for i in range(its):
        renderer.render(state)
    print(1 / ((time() - t0) / its), "FPS")


def benchmark_to(state: State, message: str) -> None:
    board = Renderer.empty_board()
    print(message)
    its = 1000
    t0 = time()
    for i in range(its):
        renderer.render_to(state, board)
    print(1 / ((time() - t0) / its), "FPS")


if __name__ == "__main__":
    benchmark(rgb(), "RGB:")
    benchmark_to(rgb(), "RGB (in place):")
    benchmark(rgba(), "RGBA:")
    benchmark_to(rgba(), "RGBA (in place):")
    benchmark(get_state(), "RGBA + Video:")
    benchmark_to(get_state(), "RGBA + Video (in place):")
