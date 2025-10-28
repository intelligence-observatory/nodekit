from PIL import Image

from nodekit_rs import render, Frame
from nodekit import *

node = Node(
    cards={
        "a": cards.ImageCard(
            image=assets.Image.from_path("nodekit-rs-image/test_image.png"),
            x=0.4,
            y=0.4,
            w=0.25,
            h=0.3,
        ),
        "b": cards.VideoCard(
            video=assets.Video.from_path("mp4.ia.mp4"), x=0, y=0, w=0.33, h=0.25
        ),
    },
    sensors={"s": sensors.TimeoutSensor(timeout_msec=20000)},
)

result = render(node=node, cursor_x=0.2, cursor_y=0.3, time=0)
Image.frombytes("RGB", (768, 768), result.visual.buffer).show()

result = render(node=node, cursor_x=0.2, cursor_y=-0.1, time=1500)
Image.frombytes("RGB", (768, 768), result.visual.buffer).show()
