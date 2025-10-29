import nodekit as nk
from typing import Tuple
import math

def make_mts_trial(
        stimulus: nk.assets.Image,
        choices: Tuple[nk.assets.Image],
        i_correct_choice: int,
        show_feedback: bool,
) -> nk.Graph:
    if not len(choices) == 8:
        raise ValueError

    # Fixation node
    fixation_cross = nk.cards.ImageCard(image=nk.assets.Image.from_path('fixation-cross.svg'), x=0, y=0, w=0.05, h=0.05)
    fixation_node = nk.Node(
        cards={
            'fixation-cross': fixation_cross,
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

    # Main node
    stimulus_size = 0.375
    viewing_time_msec=100
    post_stim_delay=100
    choice_size = 0.2
    stimulus_card = nk.cards.ImageCard(
        image=stimulus,
        x=0,
        y=0,
        w=stimulus_size,
        h=stimulus_size,
        start_msec=0,
        end_msec=viewing_time_msec,
    )
    choice_cards = {}
    choice_sensors = {}
    main_transitions = {} # sensor_id: 'punish' | 'reward'
    def get_xy(i:int):
        # Around a circle of radius. Starts at 12
        theta_cur = 2 * math.pi * (i/8)
        radius = stimulus_size*1.05
        x = math.cos(theta_cur) * radius
        y = math.sin(theta_cur) * radius
        return x, y



    for i in range(len(choices)):
        xcur, ycur = get_xy(i)
        card = nk.cards.ImageCard(
            image=choices[i],
            start_msec=viewing_time_msec + post_stim_delay,
            w=choice_size,
            h=choice_size,
            x=xcur,
            y=ycur,
        )
        choice_cards[f'choice{i}'] = card
        sensor_id = f'selected-choice{i}'
        choice_sensors[sensor_id] = nk.sensors.ClickSensor(
            x=card.x,
            y=card.y,
            w=choice_size,
            h=choice_size,
            mask='ellipse',
            start_msec=card.start_msec,
        )

        main_transitions[sensor_id] = 'punish' if i_correct_choice != i else 'reward'

    main_node = nk.Node(
        cards={
            'stimulus': stimulus_card,
        } | choice_cards,
        sensors=choice_sensors,
        effects=[
            nk.effects.HidePointerEffect(start_msec=0, end_msec=viewing_time_msec+post_stim_delay),
        ]
    )

    # Punish node
    punish_color = (200, 0, 0)
    def RGB_to_hex(RGB):
        return '#%02x%02x%02x' % RGB
    punish_node = nk.Node(
        cards={
            'feedback': nk.cards.TextCard(
                text='Incorrect.',
                text_color=RGB_to_hex(punish_color),
                x=0,y=0,w=0.5,h=0.5,font_size=0.08,
            )
        },
        sensors={
            'wait': nk.sensors.TimeoutSensor(
                timeout_msec=1000
            )
        }
    )

    reward_color = (50, 50, 200)
    reward_node = nk.Node(
        cards={
            'feedback': nk.cards.TextCard(
                text='Correct!',
                text_color=RGB_to_hex(reward_color),
                x=0, y=0, w=0.5, h=0.5, font_size=0.08,
            )
        },
        sensors={
            'wait': nk.sensors.TimeoutSensor(
                timeout_msec=300
            )
        }
    )

    transitions={
        'fixation': {
            'clicked-fixation': 'main',
        },
    }
    if show_feedback:
        transitions['main'] = main_transitions
    trial = nk.Graph(
        nodes={
            'fixation': fixation_node,
            'main':main_node,
            'punish': punish_node,
            'reward': reward_node,
        },
        transitions=transitions,
        start='fixation'
    )
    return trial


# %%
if __name__ == '__main__':
    import glob
    from pathlib import Path
    token_imagepaths = glob.glob("./token-images/*.png")
    class_to_token = {Path(path).stem :nk.assets.Image.from_path(path) for path in token_imagepaths}
    class_to_stims={}
    for c in class_to_token.keys():
        class_to_stims[c] = [nk.assets.Image.from_path(p) for p in glob.glob(f'./stimulus-images/{c}/*.png')]


    # Make trials
    import random
    random.seed(0)
    num_trials = 100
    classes = sorted(class_to_token.keys())
    trials = []
    for i in range(num_trials):
        stim_class = random.choice(classes)
        stim_image = random.choice(class_to_stims[stim_class])
        match_token = class_to_token[stim_class]
        # Get distractors not including the match token
        num_distractors = 7
        distractor_pool = [c for c in classes if c != stim_class]
        distractor_classes = random.sample(distractor_pool, num_distractors)
        distractor_tokens = [class_to_token[c] for c in distractor_classes]

        choices = [match_token] + distractor_tokens
        i_shuffled = random.sample(range(len(choices)), len(choices))
        i_correct_choice = i_shuffled.index(0)

        trial = make_mts_trial(
            stimulus=stim_image,
            choices=[choices[i] for i in i_shuffled],
            i_correct_choice=i_correct_choice,
            show_feedback=True,
        )
        trials.append(trial)



    graph = nk.concat(trials)
    nk.play(graph)





