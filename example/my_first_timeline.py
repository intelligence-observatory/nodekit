import glob
import random
from pathlib import Path

import nodekit as nk

random.seed(42)


# %% Create a sequence of simple Nodes in which the Participant must click on a fixation point:
def make_basic_fixation_node(
        fixation_image: nk.assets.ImageFile,
        fixation_x: float,
        fixation_y: float,
) -> nk.Node:
    """
    Creates a simple Node which places a fixation point at the specified coordinates.
    The Node ends when the participant clicks on the fixation point.
    """

    # Configure your Cards, which give context to the Participant:
    fixation_circle = nk.cards.ImageCard(
        x=fixation_x,
        y=fixation_y,
        w=0.0375,
        h=0.0375,
        image=fixation_image.identifier,
    )

    # Define outcomes
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

    positive_outcome = nk.Outcome(
        cards=[positive_card],
    )
    negative_outcome1 = nk.Outcome(
        cards=[negative_card],
    )
    negative_outcome2 = nk.Outcome(
        cards=[negative_card],
    )

    # Define your Sensors, which will detect an Action from the Participant:
    clicked_fixation_dot_sensor = nk.sensors.ClickSensor(
        mask='ellipse',
        x=fixation_x,
        y=fixation_y,
        w=fixation_circle.w,
        h=fixation_circle.h,
        outcome=positive_outcome,
    )
    spacebar_sensor = nk.sensors.KeySensor(key=' ', outcome=negative_outcome2)
    timeout_sensor = nk.sensors.TimeoutSensor(t_start=2000, outcome=negative_outcome1)

    return nk.Node(
        cards=[fixation_circle],
        sensors=[clicked_fixation_dot_sensor, spacebar_sensor, timeout_sensor],
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
        t_start=200,
    )

    sensor = nk.sensors.ClickSensor(
        t_start=200,
        x=continue_button.x,
        y=continue_button.y,
        w=continue_button.w,
        h=continue_button.h,
        mask='rectangle',
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
        fixation_y=round(random.uniform(-0.3, 0.3), 2),
        fixation_image=my_image_files[0]
    )
    nodes.append(node)

timeline = nk.Timeline(
    nodes=nodes,
)

Path('timeline.json').write_text(timeline.model_dump_json(indent=2))

# %% Play the Timeline:
trace = nk.play(
    timeline=timeline,
    asset_files=my_image_files + my_video_files
)

# %%
print(f'Observed {len(trace.events)} events:')
for event in trace.events:
    print(event.event_type)
