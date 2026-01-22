from pathlib import Path
from time import time
from state import get_state
import nodekit as nk

d = Path(__file__).parent.parent


def rgb() -> nk.experimental.renderer.State:
    cards = {
        "image_0": nk.cards.ImageCard(
            region=nk.Region(x=-256, y=-256, w=256, h=512, z_index=0),
            image=nk.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        "image_1": nk.cards.ImageCard(
            region=nk.Region(x=0, y=0, w=170, h=256, z_index=1),
            image=nk.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        "text": nk.cards.TextCard(
            region=nk.Region(x=-512, y=-512, w=1, h=51, z_index=2),
            text="# Click the **test image**",
            justification_horizontal="left",
            text_color="#000000FF",
            background_color="#E6E6E6FF",
        ),
    }
    card = nk.cards.CompositeCard(children=cards)
    return nk.experimental.renderer.State(
        board_color="#AAAAAAFF", card=card, sensor=nk.sensors.WaitSensor(duration_msec=10000)
    )


def rgba() -> nk.experimental.renderer.State:
    cards = {
        "image_0": nk.cards.ImageCard(
            region=nk.Region(x=-256, y=-256, w=256, h=512, z_index=0),
            image=nk.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        "image_1": nk.cards.ImageCard(
            region=nk.Region(x=0, y=0, w=170, h=256, z_index=1),
            image=nk.assets.Image.from_path(
                d.joinpath("nodekit-rs-image/test_image.png").resolve()
            ),
        ),
        "text": nk.cards.TextCard(
            region=nk.Region(x=-512, y=-512, w=1000, h=51, z_index=2),
            text="# Click the **test image**",
            justification_horizontal="left",
            text_color="#000000FF",
            background_color="#E6E6E633",
        ),
    }
    card = nk.cards.CompositeCard(children=cards)
    return nk.experimental.renderer.State(
        board_color="#AAAAAAFF", card=card, sensor=nk.sensors.WaitSensor(duration_msec=10000)
    )


renderer = nk.experimental.renderer.Renderer()


def benchmark(state: nk.experimental.renderer.State, message: str) -> str:
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
    fps = f"{1 / ((time() - t0) / its)} FPS"
    print(fps)
    return f"{message} {fps}"


def benchmark_to(state: nk.experimental.renderer.State, message: str) -> str:
    board = nk.experimental.renderer.Renderer.empty_board()
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
    fps = f"{1 / ((time() - t0) / its)} FPS"
    print(fps)
    return f"{message} {fps}"


if __name__ == "__main__":
    b0 = benchmark(rgb(), "RGB:")
    b1 = benchmark_to(rgb(), "RGB (in place):")
    b2 = benchmark(rgba(), "RGBA:")
    b3 = benchmark_to(rgba(), "RGBA (in place):")
    b4 = benchmark(get_state(), "RGBA + Video:")
    b5 = benchmark_to(get_state(), "RGBA + Video (in place):")
    Path(__file__).parent.joinpath("benchmark.txt").write_text(
        "\n\n".join([b0, b1, b2, b3, b4, b5])
    )
