from pathlib import Path
from time import time
from state import get_state
import nodekit.assets
import nodekit.cards
from nodekit import Region
from nodekit_rs import Renderer, State

d = Path(__file__).parent.parent


def rgb() -> State:
    cards = {
        'image_0': nodekit.cards.ImageCard(
            region=Region(x=-256, y=-256, w=256, h=512, z_index=0),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        'image_1': nodekit.cards.ImageCard(
            region=Region(x=0, y=0, w=170, h=256, z_index=1),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        'text': nodekit.cards.TextCard(
            region=Region(x=-512, y=-512, w=1, h=51, z_index=2),
            text="# Click the **test image**",
            justification_horizontal="left",
            text_color="#000000FF",
            background_color="#E6E6E6FF",
        ),
    }
    card = nodekit.cards.CompositeCard(children=cards)
    return State(board_color="#AAAAAAFF", card=card)


def rgba() -> State:
    cards = {
        'image_0': nodekit.cards.ImageCard(
            region=Region(x=-256, y=-256, w=256, h=512, z_index=0),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        'image_1': nodekit.cards.ImageCard(
            region=Region(x=0, y=0, w=170, h=256, z_index=1),
            image=nodekit.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        'text': nodekit.cards.TextCard(
            region=Region(x=-512, y=-512, w=1000, h=51, z_index=2),
            text="# Click the **test image**",
            justification_horizontal="left",
            text_color="#000000FF",
            background_color="#E6E6E633",
        ),
    }
    card = nodekit.cards.CompositeCard(children=cards)
    return State(board_color="#AAAAAAFF", card=card)


renderer = Renderer()


def benchmark(state: State, message: str) -> str:
    print(message)
    its = 1000
    # Ignore the first frame because that's when assets are cached.
    renderer.render(state)
    t0 = time()
    q = False
    for i in range(its):
        if q:
            state.t_msec = 1
            q = False
        else:
            state.t_msec = 0
            q = True
        renderer.render(state)
    fps = f'{1 / ((time() - t0) / its)} FPS'
    print(fps)
    return f'{message} {fps}'


def benchmark_to(state: State, message: str) -> str:
    board = Renderer.empty_board()
    print(message)
    its = 1000
    t0 = time()
    q = False
    for i in range(its):
        if q:
            state.t_msec = 1
            q = False
        else:
            state.t_msec = 0
            q = True
        renderer.render_to(state, board)
    fps = f'{1 / ((time() - t0) / its)} FPS'
    print(fps)
    return f'{message} {fps}'


if __name__ == "__main__":
    b0 = benchmark(rgb(), "RGB:")
    b1 = benchmark_to(rgb(), "RGB (in place):")
    b2 = benchmark(rgba(), "RGBA:")
    b3 = benchmark_to(rgba(), "RGBA (in place):")
    b4 = benchmark(get_state(), "RGBA + Video:")
    b5 = benchmark_to(get_state(), "RGBA + Video (in place):")
    Path(__file__).parent.joinpath('benchmark.txt').write_text('\n\n'.join([b0, b1, b2, b3, b4, b5]))
