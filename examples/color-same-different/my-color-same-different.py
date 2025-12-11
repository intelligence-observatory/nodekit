import random
from typing import Tuple, cast

import nodekit as nk


# %%
def make_same_different_node(
    color_left: tuple[int, int, int],
    color_right: tuple[int, int, int],
):
    def to_hex(R, G, B):
        hex_str = f"#{R:02x}{G:02x}{B:02x}"
        return hex_str

    # Make fixation Node

    fixation_node = nk.Node(
        stimulus=nk.cards.ImageCard(
            image=nk.assets.Image.from_path("fixation-cross.svg"),
            region=nk.Region(
                x=0,
                y=0,
                w=0.05,
                h=0.05,
            ),
        ),
        sensor=nk.sensors.KeySensor(keys=[" "]),
    )

    stim_size = 0.4

    comparison_node = nk.Node(
        stimulus=nk.cards.CompositeCard(
            children={
                "left-color": nk.cards.TextCard(  # Hack; I should add the ShapeCard back in...
                    background_color=to_hex(*color_left),
                    text=" ",
                    region=nk.Region(
                        x=-0.25,
                        y=0,
                        w=stim_size,
                        h=stim_size,
                    ),
                ),
                "right-color": nk.cards.TextCard(
                    background_color=to_hex(*color_right),
                    text=" ",
                    region=nk.Region(
                        x=0.25,
                        y=0,
                        w=stim_size,
                        h=stim_size,
                    ),
                ),
                "key-reminder": nk.cards.TextCard(
                    background_color=to_hex(200, 200, 200),
                    text="Same (f) or Different (j)?",
                    region=nk.Region(
                        x=0,
                        y=-0.35,
                        w=0.35,
                        h=0.07,
                    ),
                ),
            }
        ),
        sensor=nk.sensors.KeySensor(keys=["f", "j"]),
    )

    punish_node = nk.Node(
        stimulus=nk.cards.TextCard(
            text="WRONG",
            font_size=0.1,
            region=nk.Region(
                x=0,
                y=0,
                w=0.5,
                h=0.1,
            ),
            text_color=to_hex(50, 50, 50),
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=1000),
    )

    reward_node = nk.Node(
        stimulus=nk.cards.TextCard(
            text="CORRECT",
            font_size=0.1,
            region=nk.Region(
                x=0,
                y=0,
                w=0.5,
                h=0.1,
            ),
            text_color=to_hex(50, 50, 50),
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=200),
    )

    expected_key = "f" if color_left == color_right else "j"

    graph = nk.Graph(
        nodes={
            "fixation": fixation_node,
            "main": comparison_node,
            "punish": punish_node,
            "reward": reward_node,
        },
        transitions={
            "fixation": nk.transitions.Go(to="main"),
            "main": nk.transitions.IfThenElse(
                if_=nk.expressions.Eq(
                    lhs=nk.expressions.GetDictValue(
                        d=nk.expressions.LastAction(),
                        key=nk.expressions.Lit(value="key"),
                    ),
                    rhs=nk.expressions.Lit(value=expected_key),
                ),
                then=nk.transitions.Go(to="reward"),
                else_=nk.transitions.Go(to="punish"),
            ),
            "punish": nk.transitions.End(),
            "reward": nk.transitions.End(),
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
        color1: Tuple[int, int, int] = (
            random.randint(0, 255),
            random.randint(0, 255),
            random.randint(0, 255),
        )

        if random.random() < 0.5:
            color2 = color1
        else:
            # Just vary overall i guess
            color2 = cast(
                Tuple[int, int, int],
                tuple(max(0, min(255, int(c + get_delta()))) for c in color1),
            )

        trial = make_same_different_node(
            color_left=color1,
            color_right=color2,
        )
        trials.append(trial)

    graph = nk.concat(trials)
    nk.play(graph)
