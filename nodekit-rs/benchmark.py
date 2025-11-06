from time import time
from nodekit._internal.ml import Client, graph, noop
from nodekit import *

node = Node(
    cards={
        "a": cards.ImageCard(
            image=assets.Image.from_path("nodekit-rs-image/test_image.png"),
            x=-0.25,
            y=-0.25,
            w=0.25,
            h=0.5,
        ),
        "b": cards.VideoCard(
            video=assets.Video.from_path("nodekit-rs-video/test-video.mp4"), x=0, y=0, w=0.33, h=0.25,
        ),
        "c": cards.TextCard(
            text="Click the **test image**",
            x=-0.5,
            y=-0.5,
            w=1,
            h=0.1,
            justification_vertical='top',
            background_color="#E6E6E600".lower()
        )
    },
    sensors={"s": sensors.TimeoutSensor(timeout_msec=20000)},
)

node_id = "0"
g = Graph(start=node_id,
          nodes={node_id: node},
          transitions={})

client = Client()
response = client.tick(graph(g))
t0 = time()
while not response.finished:
    response = client.tick(noop())
print(time() - t0)