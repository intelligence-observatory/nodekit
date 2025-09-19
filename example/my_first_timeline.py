import nodekit as nk
import random
import time
import glob
from pathlib import Path

random.seed(42)


# %% Create a sequence of simple Nodes in which the Participant must click on a fixation point:
def make_basic_fixation_node(
        fixation_x: float,
        fixation_y: float,
) -> nk.Node:
    """
    Creates a simple Node which places a fixation point at the specified coordinates.
    The Node ends when the participant clicks on the fixation point.
    """

    # Configure your Cards, which give context to the Participant:
    circle_card = nk.cards.ShapeCard(
        x=fixation_x,
        y=fixation_y,
        w=0.0375,
        h=0.0375,
        shape='ellipse',
        color='#ffffff',
    )

    vertical_bar = nk.cards.ShapeCard(
        x=fixation_x,
        y=fixation_y,
        w=circle_card.w * 0.075,
        h=circle_card.h * 0.9,
        shape='rectangle',
        color='#000000',
    )

    horizontal_bar = nk.cards.ShapeCard(
        x=fixation_x,
        y=fixation_y,
        w=circle_card.w * 0.9,
        h=circle_card.h * 0.075,
        shape='rectangle',
        color='#000000',
    )

    color_card = nk.cards.ShapeCard(
        shape='rectangle',
        color='#32a852',
        x=0, y=0, w=0.1, h=0.1,
    )

    # Define your Sensors, which will detect an Action from the Participant:
    clicked_fixation_dot_sensor = nk.sensors.ClickSensor(
        region=nk.regions.ShapeRegion(
            shape='ellipse',
            x=fixation_x,
            y=fixation_y,
            w = circle_card.w,
            h = circle_card.h,
        )
    )
    spacebar_sensor = nk.sensors.KeySensor(key=' ')
    timeout_sensor = nk.sensors.TimeoutSensor(t_start=5000)

    # Set up your ConsequenceMap, which maps Actions to Consequences
    positive_card = nk.cards.TextCard(
        text='Yay',
        x=0, y=0, w=0.5, h=0.5,
        t_end=200,
    )

    negative_card = nk.cards.TextCard(
        text='Boo',
        x=0, y=0, w=0.5, h=0.5,
        t_end=400,
    )

    outcomes = [
        nk.Outcome(
            sensor_id=clicked_fixation_dot_sensor.sensor_id,
            cards=[positive_card],
            bonus_amount_usd='0.01'
        ),
        nk.Outcome(
            sensor_id=spacebar_sensor.sensor_id,
            cards=[negative_card],
            bonus_amount_usd='-0.01'
        ),
        nk.Outcome(
            sensor_id=timeout_sensor.sensor_id,
            cards=[negative_card],
            bonus_amount_usd='-0.05'
        )
    ]

    return nk.Node(
        cards=[color_card, circle_card, vertical_bar, horizontal_bar],
        sensors=[clicked_fixation_dot_sensor, spacebar_sensor],
        outcomes=outcomes,
    )


def make_image_node(
        image_file: nk.assets.ImageFile
) -> nk.Node:
    image_card = nk.cards.ImageCard(
        image=image_file.identifier,
        x=0, y=0, w=0.5, h=0.5,
    )

    text_card = nk.cards.TextCard(
        text='Press space to continue',
        x=0, y=-0.4, w=0.5, h=0.1,
    )

    return nk.Node(
        cards=[image_card, text_card],
        sensors=[nk.sensors.KeySensor(key=' ')],
    )


def make_video_node(
        video_file: nk.assets.VideoFile
) -> nk.Node:

    video_card = nk.cards.VideoCard(
        x=0, y=0, w=0.5, h=0.5,
        video=video_file.identifier,
    )

    text_card = nk.cards.TextCard(
        text='Press space to continue',
        x=0, y=-0.4, w=0.5, h=0.1,
    )

    return nk.Node(
        cards=[video_card, text_card],
        sensors=[nk.sensors.KeySensor(key=' ')],
    )


def make_instructions_node(
        text: str,
) -> nk.Node:
    text_card = nk.cards.TextCard(
        text=text,
        x=0, y=0, w=0.8, h=0.8,
        background_color='#ffffff',
        justification_horizontal='left',
        justification_vertical='top',
    )

    continue_button = nk.cards.TextCard(
        text='Continue',
        x=0, y=-0.45, w=0.3, h=0.05,
        background_color='#32a852',
        text_color='#ffffff',
        t_start=1000,
    )

    sensor = nk.sensors.ClickSensor(
        t_start=1000,
        region=nk.regions.ShapeRegion(
            shape='rectangle',
            x=continue_button.x,
            y=continue_button.y,
            w=continue_button.w,
            h=continue_button.h
        )
    )

    return nk.Node(
        cards=[
            text_card,
            continue_button,
        ],
        sensors=[sensor],
    )


# %% Load Asset Files
my_image_files = []
for path in sorted(glob.glob('./example_images/*')):
    image_file = nk.assets.ImageFile.from_path(path)
    my_image_files.append(image_file)

my_video_files = []
for path in sorted(glob.glob('./example_videos/*.mp4')):
    video_file = nk.assets.VideoFile.from_path(path)
    my_video_files.append(video_file)

# %%
nodes = []

nodes.extend(
    [
        make_instructions_node("# Welcome!\n\nThis is a test task.", ),
        make_instructions_node("## Instructions\n\nBla bla bla."),
    ]
)

for video_file in my_video_files:
    node = make_video_node(
        video_file=video_file
    )
    nodes.append(node)

for image_file in my_image_files[:5]:
    node = make_image_node(
        image_file=image_file
    )
    nodes.append(node)

for _ in range(2):
    # Randomly sample fixation points:
    node = make_basic_fixation_node(
        fixation_x=round(random.uniform(-0.3, 0.3), 2),
        fixation_y=round(random.uniform(-0.3, 0.3), 2)
    )
    nodes.append(node)

timeline = nk.Timeline(
    nodes=nodes,
)

Path('timeline.json').write_text(timeline.model_dump_json(indent=2))

# %% Play the Timeline:
play_session = nk.play(
    timeline=timeline,
    asset_files=my_image_files + my_video_files
)

# %% Wait until the end event is observed:
while True:
    events = play_session.list_events()
    if any(isinstance(event, nk.events.EndEvent) for event in events):
        break
    time.sleep(5)

# %% Can compute authoritative bonus based on the events and the bonus rules:
bonus_usd = nk.ops.calculate_bonus_usd(
    events=events,
    timeline=timeline,
)
print(f"Computed bonus: ${bonus_usd}")
