import nodekit as nk
from common import render

image = nk.assets.Image.from_path("assets/san-diego.png")
image_card = nk.cards.ImageCard(
    image=image,
    region=nk.Region(
        x=0,
        y=200,
        h=600,
        w=1000,
    ),
)

prompt = "Describe everything you notice in this image, as if you were explaining it to someone who can’t see it."
prompt_card = nk.cards.TextCard(
    text=prompt,
    region=nk.Region(x=0, y=-150, h=200, w=600),
)
card = nk.cards.CompositeCard(
            children={
                "image": image_card,
                "prompt": prompt_card,
            }
        )

board_color = "#ffffffff"
node = nk.Node(
        card=nk.cards.CompositeCard(
            children={
                "image": image_card,
                "prompt": prompt_card,
            }
        ),
        board_color=board_color,
        sensor=nk.sensors.WaitSensor(duration_msec=10000)
    )


render(card=card, board_color=board_color, filename='image_free_response_nodekit_rs')
graph = nk.concat([node])
nk.play(graph)
