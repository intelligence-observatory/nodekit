import glob
from pathlib import Path
import nodekit as nk
from typing import Literal

# %%
def make_triplet_trial(
        fixation_image: nk.assets.ImageIdentifier,
        stimulus_image: nk.assets.ImageIdentifier,
        choice_left_image: nk.assets.ImageIdentifier,
        choice_right_image: nk.assets.ImageIdentifier,
        correct_choice: Literal['L', 'R']
) -> nk.Graph:
    """
    Returns a Graph representing a single trial of a triplet task.
    """

    # Make fixation Node:
    fixation_card = nk.cards.ImageCard(
        x=0,
        y=0,
        w=0.0375,
        h=0.0375,
        image=fixation_image,
    )
    clicked_fixation_dot_sensor = nk.sensors.ClickSensor(
        mask='ellipse',
        x=fixation_card.x,
        y=fixation_card.y,
        w=fixation_card.w,
        h=fixation_card.h,
    )

    fixation_node = nk.Node(
        cards=[fixation_card],
        sensors=[clicked_fixation_dot_sensor],
    )

    # Make main Node:
    stimulus_card = nk.cards.ImageCard(
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        image=stimulus_image,
        start_msec=0,
        end_msec =200,
    )
    choice_left_card = nk.cards.ImageCard(
        x=-0.25,
        y=-0.3,
        w=0.2,
        h=0.2,
        image=choice_left_image,
        start_msec=200,
    )
    choice_right_card = nk.cards.ImageCard(
        x=0.25,
        y=-0.3,
        w=0.2,
        h=0.2,
        image=choice_right_image,
        start_msec=200,
    )

    clicked_left_sensor = nk.sensors.ClickSensor(
        mask='rectangle',
        x=choice_left_card.x,
        y=choice_left_card.y,
        w=choice_left_card.w,
        h=choice_left_card.h,
        start_msec=200,
    )
    clicked_right_sensor = nk.sensors.ClickSensor(
        mask='rectangle',
        x=choice_right_card.x,
        y=choice_right_card.y,
        w=choice_right_card.w,
        h=choice_right_card.h,
        start_msec=200,
    )

    timeout_sensor = nk.sensors.TimeoutSensor(
        start_msec=2000,
    )
    main_node = nk.Node(
        cards=[
            stimulus_card,
            choice_left_card,
            choice_right_card,
        ],
        sensors=[
            clicked_left_sensor,
            clicked_right_sensor,
            timeout_sensor,
        ],
    )

    # Make positive feedback Node:
    positive_card = nk.cards.TextCard(
        text='Correct!',
        font_size=0.05,
        x=0, y=0, w=0.5, h=0.5,
        background_color='#32a852',
        text_color='#ffffff',
        justification_horizontal='center',
        justification_vertical='center',
    )
    positive_timeout_sensor = nk.sensors.TimeoutSensor(
        start_msec=500,
    )
    positive_node = nk.Node(
        cards=[positive_card],
        sensors=[positive_timeout_sensor],
    )

    # Make negative feedback Node:
    negative_card = nk.cards.TextCard(
        text='Incorrect.',
        font_size=0.05,
        x=0, y=0, w=0.5, h=0.5,
        background_color='#a83232',
        text_color='#ffffff',
        justification_horizontal='center',
        justification_vertical='center',
    )
    negative_timeout_sensor = nk.sensors.TimeoutSensor(
        start_msec=1000,
    )

    negative_node = nk.Node(
        cards=[negative_card],
        sensors=[negative_timeout_sensor],
    )

    # Define transitions:
    nodes = [
        fixation_node,
        main_node,
        positive_node,
        negative_node,
    ]

    transitions = [
        nk.Transition(
            node_index=0,
            sensor_index=0,
            next_node_index=1,
        ),
        nk.Transition(
            node_index=1,
            sensor_index=0 if correct_choice == 'L' else 1,
            next_node_index=2,
        ),
        nk.Transition(
            node_index=1,
            sensor_index=1 if correct_choice == 'L' else 0,
            next_node_index=3,
        ),
        nk.Transition(
            node_index=1,
            sensor_index=2,
            next_node_index='END',
        ),
        nk.Transition(
            node_index=2,
            sensor_index=0,
            next_node_index='END',
        ),
    ]

    trial_graph = nk.Graph(
        nodes=nodes,
        start_node_index =0,
        transitions=transitions,
    )
    return trial_graph





# %% Helper functions to create Nodes:
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
        start_msec=200,
    )

    sensor = nk.sensors.ClickSensor(
        start_msec=200,
        x=continue_button.x,
        y=continue_button.y,
        w=continue_button.w,
        h=continue_button.h,
    )

    return nk.Node(
        cards=[
            text_card,
            continue_button,
        ],
        sensors=[sensor],
    )


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

    # Define your Sensors, which will detect an Action from the Participant:
    clicked_fixation_dot_sensor = nk.sensors.ClickSensor(
        mask='ellipse',
        x=fixation_x,
        y=fixation_y,
        w=fixation_circle.w,
        h=fixation_circle.h,
    )
    spacebar_sensor = nk.sensors.KeySensor(key=' ')
    timeout_sensor = nk.sensors.TimeoutSensor(start_msec=2000)

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

nodes.append(
    make_instructions_node("# Welcome!\n\nThis is a test task.", )
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

nodes.append(
    make_basic_fixation_node(
        fixation_x=0.4,
        fixation_y=-0.3,
        fixation_image=my_image_files[0]
    )
)

# %% Wire up transitions
transitions = [
    nk.Transition(
        node_index=0,
        sensor_index=0,
        next_node_index=1,
    ),

    nk.Transition(
        node_index=1,
        sensor_index=0,
        next_node_index=2,
    ),

    nk.Transition(
        node_index=2,
        sensor_index=0,
        next_node_index='END',
    )
]

# %%
graph = nk.Graph(
    nodes=nodes,
    transitions=transitions,
    start_node_index=0,
)

graph = make_triplet_trial(
    fixation_image=my_image_files[0].identifier,
    stimulus_image=my_image_files[1].identifier,
    choice_left_image=my_image_files[2].identifier,
    choice_right_image=my_image_files[3].identifier,
    correct_choice='L',
)


Path('timeline.json').write_text(graph.model_dump_json(indent=2))

# %% Play the Timeline:
trace = nk.play(
    timeline=graph,
    asset_files=my_image_files + my_video_files
)

# %%
print(f'Observed {len(trace.events)} events:')
for event in trace.events:
    print(event.event_type)
