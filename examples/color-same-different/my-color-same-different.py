import nodekit as nk
from typing import Tuple
import random


# %%
def make_same_different_node(
    color_left: Tuple[int, int, int],
    color_right: Tuple[int, int, int],
):
    def to_hex(R, G, B):
        hex_str = f"#{R:02x}{G:02x}{B:02x}"
        return hex_str

    # Make fixation Node
    fixation_card = nk.cards.ImageCard(
        image=nk.assets.Image.from_path("fixation-cross.svg"),
        x=0,
        y=0,
        w=0.05,
        h=0.05,
    )

    fixation_node = nk.Node(
        cards={"fixation": fixation_card},
        sensors={"fixated": nk.sensors.KeySensor(key=" ")},
    )

    left_card = nk.cards.TextCard(  # Hack; I should add the ShapeCard back in...
        background_color=to_hex(*color_left),
        text=" ",
        x=-0.25,
        y=0,
        w=0.4,
        h=0.4,
    )
    right_card = nk.cards.TextCard(
        background_color=to_hex(*color_right),
        w=left_card.w,
        h=left_card.h,
        text=left_card.text,
        x=0.25,
        y=0,
    )

    key_reminder = nk.cards.TextCard(
        background_color=to_hex(200, 200, 200),
        text="Same (f) or Different (j)?",
        x=0,
        y=-0.35,
        w=0.35,
        h=0.07,
    )

    stimulus_node = nk.Node(
        cards={
            "left-color": left_card,
            "right-color": right_card,
            "key-reminder": key_reminder,
        },
        sensors={
            "same": nk.sensors.KeySensor(key="f"),
            "different": nk.sensors.KeySensor(key="j"),
        },
    )

    punish_node = nk.Node(
        cards={
            "punish-feedback": nk.cards.TextCard(
                text="WRONG",
                font_size=0.1,
                x=0,
                y=0,
                w=0.5,
                h=0.1,
                text_color=to_hex(50, 50, 50),
            )
        },
        sensors={
            "wait": nk.sensors.WaitSensor(
                duration_msec=1000,
            )
        },
    )

    reward_node = nk.Node(
        cards={
            "punish-feedback": nk.cards.TextCard(
                text="CORRECT",
                font_size=0.1,
                x=0,
                y=0,
                w=0.5,
                h=0.1,
                text_color=to_hex(50, 50, 50),
            )
        },
        sensors={"wait": nk.sensors.WaitSensor(duration_msec=200)},
    )
    same = color_left == color_right

    graph = nk.Graph(
        nodes={
            "fixation": fixation_node,
            "main": stimulus_node,
            "punish": punish_node,
            "reward": reward_node,
        },
        transitions={
            "fixation": {"fixated": "main"},
            "main": {
                "same": "punish" if not same else "reward",
                "different": "punish" if same else "reward",
            },
        },
        start="fixation",
    )
    return graph


# %%
if __name__ == "__main__":

    def get_delta():
        return random.random() * 50 - 25

    random.seed(0)
    trials = []
    for _ in range(50):
        color1 = (
            random.randint(0, 255),
            random.randint(0, 255),
            random.randint(0, 255),
        )

        if random.random() < 0.5:
            color2 = color1
        else:
            # Just vary overall i guess
            color2 = tuple(max(0, min(255, int(c + get_delta()))) for c in color1)

        trial = make_same_different_node(
            color_left=color1,
            color_right=color2,
        )
        trials.append(trial)

    graph = nk.concat(trials)
    nk.play(graph)
