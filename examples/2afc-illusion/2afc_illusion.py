import random
from dataclasses import dataclass
from typing import Dict, List, Literal

import nodekit as nk

"""
This example was developed by Jaykishan Patel (@JaykishanPatel).
"""


# %%
def RGB_to_hex(RGB: tuple[int, int, int]) -> str:
    return "#%02x%02x%02x" % RGB


Side = Literal["left", "right"]


@dataclass(frozen=True)
class TrialSpec:
    left_path: str
    right_path: str
    left_correct: bool


# %%
def sample_trials(
    ill_names: List[str],
    lum_levels: List[str],
    n_trials: int,
    gap: int,
    seed: int,
    directory="illusion_images/",
) -> List[TrialSpec]:
    # Get the maximum index for the low luminance level with gap in mind
    max_low = len(lum_levels) - gap

    rng = random.Random(seed)
    trials = []
    for _ in range(n_trials):
        # randomly select illusion
        ill = rng.choice(ill_names)

        # randomly select low luminance level
        i_low = rng.randint(0, max_low - 1)
        low_lum = lum_levels[i_low]
        high_lum = lum_levels[i_low + gap]

        low_path = f"{directory}{ill}_{low_lum}.png"
        high_path = f"{directory}{ill}_{high_lum}.png"

        # randomize which side gets the brighter image
        left_correct = rng.random() < 0.5

        if left_correct:
            left_path, right_path = high_path, low_path
        else:
            left_path, right_path = low_path, high_path

        trials.append(
            TrialSpec(
                left_path=left_path,
                right_path=right_path,
                left_correct=left_correct,
            )
        )
    return trials


# %%
def build_3stage_graph(
    s1: List[TrialSpec],
    s2: List[TrialSpec],
    s3: List[TrialSpec],
    *,
    stim_size: int = 400,
    reward_msec: int = 500,
    punish_msec: int = 500,
) -> nk.Graph:
    if not (len(s1) == len(s2) == len(s3)):
        raise ValueError("s1, s2, s3 must have the same length")
    N = len(s1)

    # Get the next trial index from the same stage with wrap-around
    def nxt(t: int) -> int:
        return (t + 1) % N

    # Create a stage and trial key string
    def key(stage: int, t: int, part: str) -> str:
        return f"s{stage}t{t}_{part}"  # s2t4_stim means stage 2, trial 4, stimulus part

    stage_specs = {1: s1, 2: s2, 3: s3}

    # Create all the nodes
    nodes: Dict[str, nk.Node | nk.Graph] = {}

    for stage in (1, 2, 3):
        for t, spec in enumerate(stage_specs[stage]):
            mask = f"illusion_images/{spec.left_path.split('/')[-1].split('_')[0]}-mask.png"

            # mask
            mask_card = nk.cards.ImageCard(
                image=nk.assets.Image.from_path(mask),
                region=nk.Region(x=0, y=0, w=stim_size, h=stim_size),
            )
            instruction_card = nk.cards.TextCard(
                text="Compare the green region in both images and select the one that appears brighter.\n\nPress space to continue.",
                text_color="#60C9AF",
                region=nk.Region(x=0, y=300, w=1000, h=200),
                font_size=30,
            )
            children: Dict[str, nk.cards.Card] = {
                "mask": mask_card,
                "instruction": instruction_card,
            }

            nodes[key(stage, t, "mask")] = nk.Node(
                card=nk.cards.CompositeCard(children=children),
                sensor=nk.sensors.KeySensor(keys=[" "]),
            )

            # stimulus pair
            left_region = nk.Region(x=-250, y=0, w=stim_size, h=stim_size)
            right_region = nk.Region(x=250, y=0, w=stim_size, h=stim_size)

            left_card = nk.cards.ImageCard(
                image=nk.assets.Image.from_path(spec.left_path),
                region=left_region,
            )
            right_card = nk.cards.ImageCard(
                image=nk.assets.Image.from_path(spec.right_path),
                region=right_region,
            )
            key_card = nk.cards.TextCard(
                text=f"""trial {key(stage, t, "stim")} 
                        Press ← for left, → for right""",
                text_color="#FFFFFF",
                region=nk.Region(x=0, y=400, w=800, h=200),
                font_size=30,
            )

            children: Dict[str, nk.cards.Card] = {
                "left": left_card,
                "right": right_card,
                "key": key_card,
            }

            nodes[key(stage, t, "stim")] = nk.Node(
                card=nk.cards.CompositeCard(children=children),
                sensor=nk.sensors.KeySensor(keys=["ArrowLeft", "ArrowRight"]),
            )

            # feedback
            nodes[key(stage, t, "reward")] = nk.Node(
                card=nk.cards.TextCard(
                    text="Correct!",
                    text_color="#3232c8",
                    region=nk.Region(x=0, y=0, w=600, h=300),
                    font_size=80,
                ),
                sensor=nk.sensors.WaitSensor(duration_msec=reward_msec),
            )
            nodes[key(stage, t, "punish")] = nk.Node(
                card=nk.cards.TextCard(
                    text="Incorrect.",
                    text_color="#c80000",
                    region=nk.Region(x=0, y=0, w=600, h=300),
                    font_size=80,
                ),
                sensor=nk.sensors.WaitSensor(duration_msec=punish_msec),
            )

    # ----- Transitions -----
    transitions: Dict[str, nk.transitions.Transition] = {}

    for stage in (1, 2, 3):
        for t, spec in enumerate(stage_specs[stage]):
            mask = key(stage, t, "mask")
            stim = key(stage, t, "stim")
            reward = key(stage, t, "reward")
            punish = key(stage, t, "punish")

            transitions[mask] = nk.transitions.Go(to=stim)

            pressed_key = nk.expressions.LastAction()
            correct_key = nk.expressions.Lit(
                value="ArrowLeft" if spec.left_correct else "ArrowRight"
            )
            is_correct = nk.expressions.Eq(lhs=pressed_key, rhs=correct_key)

            transitions[stim] = nk.transitions.IfThenElse(
                if_=is_correct,
                then=nk.transitions.Go(to=reward),
                else_=nk.transitions.Go(to=punish),
            )

            # wrong: always move to S1(t+1).mask
            transitions[punish] = nk.transitions.Go(to=key(1, nxt(t), "mask"))

            # correct: S1(t) progress to S2(t), S2(t) progress to S3(t), S3(t) ends
            transitions[reward] = (
                nk.transitions.Go(to=key(stage + 1, t, "mask"))
                if stage < 3
                else nk.transitions.End()
            )

    return nk.Graph(nodes=nodes, transitions=transitions, start=key(1, 0, "mask"))


# %%
if __name__ == "__main__":
    directory = "illusion_images/"
    ill_names = ["koffkas", "simcon", "simcona", "argyle"]
    lum_levels = ["0p10", "0p20", "0p30", "0p40", "0p50"]

    s1 = sample_trials(
        ill_names,
        lum_levels,
        n_trials=5,
        gap=3,
        seed=0,
    )

    s2 = sample_trials(ill_names, lum_levels, n_trials=5, gap=2, seed=1)

    s3 = sample_trials(
        ill_names,
        lum_levels,
        n_trials=5,
        gap=1,
        seed=2,
    )

    graph = build_3stage_graph(s1, s2, s3)
    nk.play(graph)
