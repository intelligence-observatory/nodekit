from typing import Tuple
import nodekit as nk

import random
import math


# %%
def make_fitts_trial(
    target_size: float,
    target_position: Tuple[float, float],
    home_position: Tuple[float, float] = (0, 0),
) -> nk.Graph:
    background_color = "#ffffff"
    target_color = "#b8b8b8"

    home_node = nk.Node(
        board_color=background_color,
        stimulus=None,
        sensor=nk.sensors.SelectSensor(
            choices={
                "clicked-home": nk.cards.TextCard(
                    region=nk.Region(
                        x=home_position[0],
                        y=home_position[1],
                        w=0.05,
                        h=0.05,
                    ),
                    text="",
                    background_color=target_color,
                )
            }
        ),
    )

    target_node = nk.Node(
        board_color=background_color,
        stimulus=None,
        sensor=nk.sensors.SelectSensor(
            choices={
                "clicked-target": nk.cards.TextCard(
                    region=nk.Region(
                        x=target_position[0],
                        y=target_position[1],
                        w=target_size,
                        h=target_size,
                    ),
                    text="",
                    background_color=target_color,
                )
            }
        ),
    )

    return nk.Graph(
        start="home-node",
        nodes={
            "home-node": home_node,
            "target-node": target_node,
        },
        transitions={
            "home-node": nk.transitions.Go(to="target-node"),
            "target-node": nk.transitions.End(),
        },
    )


if __name__ == "__main__":

    def sample_target_parameters(w: float) -> Tuple[float, float]:
        # Maximum radius to keep target fully inside
        r_max = 0.5 - w

        # Sample radius uniformly in area (sqrt)
        r_min = 0.05
        r = math.sqrt(random.uniform(r_min**2, r_max**2))

        theta = random.uniform(0, 2 * math.pi)
        x, y = r * math.cos(theta), r * math.sin(theta)

        return x, y

    def sample_size() -> float:
        return random.uniform(0.05, 0.15)

    random.seed(0)
    fitts_trials = []
    for i_trial in range(30):
        w = sample_size()
        x, y = sample_target_parameters(w)
        fitts_trials.append(
            make_fitts_trial(
                target_position=(x, y),
                target_size=w,
            )
        )

    graph = nk.concat(fitts_trials)
    nk.save_graph(graph, "fitts-demo.nkg")
    # %%

    trace = nk.play(graph)
