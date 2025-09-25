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
        sensors={
            'clicked-fixation': clicked_fixation_dot_sensor
        },
    )

    # Make main Node:
    stimulus_card = nk.cards.ImageCard(
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        image=stimulus_image,
        start_msec=0,
        end_msec=200,
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
        sensors={
            'L': clicked_left_sensor,
            'R': clicked_right_sensor,
            'TO': timeout_sensor,
        },
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
        sensors={
            'wait': positive_timeout_sensor
        },
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
        sensors={
            'wait': negative_timeout_sensor
        },
    )


    trial_graph = nk.Graph(
        nodes={
            'fixation': fixation_node,
            'main': main_node,
            'positive': positive_node,
            'negative': negative_node,
        },
        start='fixation',
        transitions={
            'fixation': {
                'clicked-fixation': 'main'
            },
            'main': {
                'R': 'positive' if correct_choice == 'R' else 'negative',
                'L': 'positive' if correct_choice == 'L' else 'negative',
                'TO': 'negative',
            },
        },
    )
    return trial_graph



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

my_trial = make_triplet_trial(
    fixation_image=my_image_files[0].identifier,
    stimulus_image=my_image_files[1].identifier,
    choice_left_image=my_image_files[2].identifier,
    choice_right_image=my_image_files[3].identifier,
    correct_choice='L',
)

fixation_card = nk.cards.TextCard(
    x=0,
    y=0,
    w=0.0375,
    h=0.0375,
    text='yo',
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
    sensors={
        'clicked-fixation': clicked_fixation_dot_sensor
    },
)

graph = nk.Graph.from_sequence(
    [fixation_node,my_trial,my_trial, fixation_node]
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
