
import nodekit as nk
from typing import Literal
from pathlib import Path

"""
This example is inspired by an experiment designed by by T. O'Connell and Y. Bai at MIT BCS. They 
also kindly provided the instructions text and example stimuli.  

Warmup:
- Central fixation cross with "Click the cross sign"
- Central movie shown
- Two choice movies show up: "which object did you see previously" annotated on top. Movies loop indefinitely.
- Correct / incorrect screen which must accept any key to continue.

Main: 
- No feedback.
"""


def make_trial(
        stimulus: nk.assets.Video,
        left: nk.assets.Video,
        right: nk.assets.Video,
        correct_choice: Literal['left', 'right'],
) -> nk.Graph:
    # Make fixation node
    fixation_cross = nk.cards.TextCard(text=r'\+', font_size=0.03, x=0, y=0, w=0.05, h=0.05)
    fixation_cross = nk.cards.ImageCard(image=nk.assets.Image.from_path('fixation-cross.svg'), x=0, y=0, w=0.05, h=0.05)
    fixation_annotation = nk.cards.TextCard(
        text='Click the cross sign.',
        x=0,
        y=-0.2,
        w=1,
        h=0.05,
        justification_horizontal='center',
    )
    fixation_node = nk.Node(
        cards={
            'fixation-cross': fixation_cross,
            #'fixation-annotation': fixation_annotation,
        },
        sensors={
            'clicked-fixation': nk.sensors.ClickSensor(
                x=fixation_cross.x,
                y=fixation_cross.y,
                w=fixation_cross.w,
                h=fixation_cross.h,
                mask='ellipse',
            )
        }
    )

    # Make the main node
    video_size = 0.4
    stimulus_duration = 400
    post_stimulus_delay = 100
    stimulus_video = nk.cards.VideoCard(
        x=0,
        y=0,
        w=video_size,
        h=video_size,
        start_msec=0,
        end_msec=stimulus_duration,
        video=stimulus,
        muted=True,
        loop=False,
    )

    choice_left_video = nk.cards.VideoCard(
        x=-0.3,
        y=0,
        w=video_size,
        h=video_size,
        start_msec=stimulus_duration + post_stimulus_delay,
        loop=True,
        video=left
    )

    choice_right_video = nk.cards.VideoCard(
        x=0.3,
        y=0,
        w=video_size,
        h=video_size,
        start_msec=stimulus_duration + post_stimulus_delay,
        loop=True,
        video=right
    )

    prompt = nk.cards.TextCard(
        text='Which object did you see previously?',
        start_msec=stimulus_duration + post_stimulus_delay,
        x=0,
        y=0.35,
        w=0.35,
        h=0.1,
        background_color='#c8c8c8',
    )

    click_left = nk.sensors.ClickSensor(
        x=choice_left_video.x,
        y=choice_left_video.y,
        w=choice_left_video.w,
        h=choice_left_video.h,
        start_msec=choice_left_video.start_msec,
    )

    click_right = nk.sensors.ClickSensor(
        x=choice_right_video.x,
        y=choice_right_video.y,
        w=choice_right_video.w,
        h=choice_right_video.h,
        start_msec=choice_right_video.start_msec,
    )

    main_node = nk.Node(
        cards={
            'stimulus-video': stimulus_video,
            'choice-left-video': choice_left_video,
            'choice-right-video': choice_right_video,
            'prompt': prompt,
        },
        sensors={
            'clicked-left': click_left,
            'clicked-right': click_right,
        },
        effects=[
            nk.effects.HidePointerEffect(
                start_msec=0,
                end_msec=stimulus_video.end_msec,
            )
        ]
    )

    # Make feedback nodes
    correct_string = "**Correct!**\nPress the spacebar to continue."
    incorrect_string = "Sorry, **wrong choice.**\nPress the spacebar to continue."

    correct_node = nk.Node(
        cards={
            'feedback': nk.cards.TextCard(
                text=correct_string,
                x=0, y=0, w=0.5, h=0.15,
                justification_horizontal='center',
                background_color='#c8c8c8',
            )
        },
        sensors={
            'press-spacebar': nk.sensors.KeySensor(
                key=' ',
            )
        }
    )

    incorrect_node = nk.Node(
        cards={
            'feedback': nk.cards.TextCard(
                text=incorrect_string,
                x=0, y=0, w=0.5, h=0.15,
                justification_horizontal='center',
                background_color='#c8c8c8',
            )
        },
        sensors={
            'press-spacebar': nk.sensors.KeySensor(
                key=' ',
            )
        }
    )

    graph = nk.Graph(
        start='fixation',
        nodes={
            'fixation': fixation_node,
            'main': main_node,
            'correct': correct_node,
            'incorrect': incorrect_node,
        },
        transitions={
            'fixation': {
                'clicked-fixation': 'main',
            },
            'main': {
                'clicked-left': 'correct' if correct_choice == 'left' else 'incorrect',
                'clicked-right': 'correct' if correct_choice == 'right' else 'incorrect',
            }
        }
    )

    return graph


def make_sfm_instructions() -> nk.Graph:
    def make_page(markdown_string: str, page_index: int) -> nk.Node:
        text_card = nk.cards.TextCard(
            text=markdown_string,
            x=0, y=0, w=0.8, h=0.75,
            background_color='#c8c8c8',
            justification_horizontal='left',
            justification_vertical='top',
        )
        next_button = nk.cards.TextCard(
            selectable=True,
            x=0.25,
            y=-0.45,
            w=0.15,
            h=0.1,
            text='Next',
            background_color='#c8c8c8',
        )

        sensors = {
            'next': nk.sensors.ClickSensor(
                x=next_button.x,
                y=next_button.y,
                w=next_button.w,
                h=next_button.h,
            ),
        }
        cards = {
            'next': next_button,
            'text': text_card,
        }
        if page_index > 0:
            prev_button = nk.cards.TextCard(
                selectable=True,
                x=-0.25,
                y=-0.45,
                w=next_button.w,
                h=next_button.h,
                text='Prev',
                background_color='#c8c8c8',
            )
            cards['prev'] = prev_button
            sensors['prev'] = nk.sensors.ClickSensor(
                x=prev_button.x,
                y=prev_button.y,
                w=prev_button.w,
                h=prev_button.h,

            )

        return nk.Node(
            cards=cards,
            sensors=sensors
        )

    pages = [
        './instructions/instructions1.md',
        './instructions/instructions2.md',
        './instructions/instructions3.md',
        './instructions/instructions4.md',
    ]
    nodes = {}
    for i_page, page in enumerate(pages):
        page = Path(page).read_text()
        nodes[f'page{i_page}'] = make_page(page, i_page)

    # Wire up transitions (manually, bla)
    transitions = {
        'page0': {
            'next': 'page1'
        },
        'page1': {
            'prev': 'page0',
            'next': 'page2'
        },
        'page2': {
            'prev': 'page1',
            'next': 'page3'
        },
        'page3': {
            'prev': 'page2',
        }
    }

    return nk.Graph(
        nodes=nodes,
        transitions=transitions,
        start='page0',
    )


# %%
instructions = make_sfm_instructions()
easy_trial = make_trial(
    stimulus=nk.assets.Video.from_path('./stimuli/gestalt_0/1.mp4'),
    left=nk.assets.Video.from_path('./stimuli/gestalt_0/2.mp4'),
    right=nk.assets.Video.from_path('./stimuli/gestalt_0/8.mp4'),
    correct_choice='left',
)

trial_2 = make_trial(
    stimulus=nk.assets.Video.from_path('./stimuli/2/2-stim.mp4'),
    left=nk.assets.Video.from_path('./stimuli/2/2-left.mp4'),
    right=nk.assets.Video.from_path('./stimuli/2/2-right.mp4'),
    correct_choice='left',
)

trial_3 = make_trial(
    stimulus=nk.assets.Video.from_path('./stimuli/3/3-stim.mp4'),
    left=nk.assets.Video.from_path('./stimuli/3/3-left.mp4'),
    right=nk.assets.Video.from_path('./stimuli/3/3-right.mp4'),
    correct_choice='right',
)

graph = nk.concat(
    [
        #instructions,
        easy_trial,
        trial_2,
        trial_3,
    ]
)

nk.save_graph(graph, 'sfm.nkg')
# %%
nk.play(graph)
