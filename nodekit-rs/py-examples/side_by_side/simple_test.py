import nodekit as nk
from common import ASSETS_DIRECTORY, render

cards = {
    'image': nk.cards.ImageCard(
        region=nk.Region(x=-512, y=-512, w=256, h=512, z_index=0),
        image=nk.assets.Image.from_path(
            ASSETS_DIRECTORY.joinpath("test_image.png").resolve()
        ),
    ),
    'video': nk.cards.VideoCard(
        region=nk.Region(x=0, y=0, w=256, h=256, z_index=1),
        video=nk.assets.Video.from_path(
            ASSETS_DIRECTORY.joinpath("test-video.mp4").resolve()
        ),
    ),
    'text': nk.cards.TextCard(
        region=nk.Region(x=0, y=0, w=1024, h=1024, z_index=2),
        text=ASSETS_DIRECTORY.joinpath('lorem.txt').read_text(encoding='utf-8'),
        justification_horizontal="left",
        text_color="#000000FF",
        background_color="#E6E6E611",
    ),
}
card = nk.cards.CompositeCard(children=cards)

board_color = '#FFAAAAFF'

render(card=card, board_color=board_color, filename='simple_test_rs')


# TODO
node = nk.Node(card=card,
               sensor=nk.sensors.WaitSensor(duration_msec=10000),
               board_color=board_color)
graph = nk.concat([node])
nk.play(graph)