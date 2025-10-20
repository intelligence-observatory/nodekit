from typing import Tuple
import nodekit as nk

# %%
def make_fitts_trial(
        target_size: float,
        target_position: Tuple[float, float],
        maximum_time_msec: float = 2000,
        home_position: Tuple[float, float] = (0, 0),
        show_positive_feedback: bool = False
) -> nk.Graph:
    background_color = '#ffffff'
    target_colors = '#b8b8b8'
    home_card = nk.cards.TextCard(
        selectable=True,
        x=home_position[0],
        y=home_position[1],
        w=0.05,
        h=0.05,
        text='',
        background_color=target_colors,
    )
    home_node = nk.Node(
        board_color=background_color,
        cards={
            'home-card': home_card
        },
        sensors={
            'clicked-home': nk.sensors.ClickSensor(
                x=home_card.x,
                y=home_card.y,
                w=home_card.w,
                h=home_card.h,
            )
        }
    )

    target_card = nk.cards.TextCard(
        selectable=True,
        x=target_position[0],
        y=target_position[1],
        w=target_size,
        h=target_size,
        text='',
        background_color=target_colors,
    )
    target_node = nk.Node(
        board_color=background_color,
        cards={
            'target-card': target_card
        },
        sensors={
            'clicked-target': nk.sensors.ClickSensor(
                x=target_card.x,
                y=target_card.y,
                w=target_card.w,
                h=target_card.h,
            ),
            'timed-out': nk.sensors.TimeoutSensor(
                timeout_msec=maximum_time_msec,
            )
        }
    )

    positive_node = nk.Node(
        board_color=background_color,
        cards={
            'positive-text': nk.cards.TextCard(
                x=0,
                y=0,
                w=0.5,
                h=0.5,
                text='Good job!',
                text_color="#34a4eb",
                font_size=0.05,
            )
        },
        sensors={
            'wait': nk.sensors.TimeoutSensor(
                timeout_msec=400,
            )
        },
    )

    negative_node = nk.Node(
        board_color=background_color,
        cards={
            'negative-text': nk.cards.TextCard(
                x=0,
                y=0,
                w=0.5,
                h=0.5,
                text='Too slow.',
                text_color="#eb345b",
                font_size=0.05,
            )
        },
        sensors={
            'wait': nk.sensors.TimeoutSensor(
                timeout_msec=3000,
            )
        },
    )

    transitions = {
        'home-node': {
            'clicked-home': 'target-node',
        },
        'target-node': {

            'timed-out': 'negative-node'
        }
    }

    if show_positive_feedback:
        transitions['target-node']['clicked-target'] ='positive-node'

    return nk.Graph(
        start='home-node',
        nodes={
            'home-node': home_node,
            'target-node': target_node,
            'positive-node': positive_node,
            'negative-node': negative_node,
        },
        transitions=transitions,
    )


import random
import math

def sample_target_parameters(w: float) -> Tuple[float, float]:
    # Maximum radius to keep target fully inside
    r_max = 0.5 - w

    # Sample radius uniformly in area (sqrt)
    r_min = 0.05
    r = math.sqrt(random.uniform(r_min ** 2, r_max ** 2))

    theta = random.uniform(0, 2 * math.pi)
    x, y = r * math.cos(theta), r * math.sin(theta)

    return x, y

def sample_size() -> float:
    return random.uniform(0.05, 0.15)


random.seed(0)
fitts_trials = []
for i_trial in range(10):
    w = sample_size()
    x, y = sample_target_parameters(w)
    fitts_trials.append(
        make_fitts_trial(
            target_position=(x, y),
            target_size=w,
            show_positive_feedback=i_trial < 2
        )
    )

graph = nk.concat(fitts_trials)
nk.save_graph(graph, 'fitts-demo.nkg')
# %%
trace = nk.play(graph)

