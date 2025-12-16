import nodekit as nk
import math


# %%
def RGB_to_hex(RGB: tuple[int, int, int]):
    return "#%02x%02x%02x" % RGB


def make_mts_trial(
    stimulus: nk.assets.Image,
    choices: list[nk.assets.Image],
    i_correct_choice: int,
) -> nk.Graph:
    if not len(choices) == 8:
        raise ValueError

    # Fixation node
    fixation_cross = nk.cards.ImageCard(
        image=nk.assets.Image.from_path("fixation-cross.svg"),
        region=nk.Region(x=0, y=0, w=0.05, h=0.05),
    )

    fixation_node = nk.Node(
        sensor=nk.sensors.SelectSensor(choices={"fixation": fixation_cross}),
    )

    # Stimulus node
    stimulus_size = 0.375
    viewing_time_msec = 100
    post_stim_delay = 100
    choice_size = 0.2

    stimulus_node = nk.Node(
        stimulus=nk.cards.ImageCard(
            image=stimulus,
            region=nk.Region(
                x=0,
                y=0,
                w=stimulus_size,
                h=stimulus_size,
            ),
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=viewing_time_msec),
        hide_pointer=True,
    )

    # ISI node
    isi_node = nk.Node(
        stimulus=None,
        sensor=nk.sensors.WaitSensor(duration_msec=post_stim_delay),
        hide_pointer=True,
    )

    # Choice node
    choice_cards = {}

    def get_xy(i: int):
        # Around a circle of radius. Starts at 12
        theta_cur = 2 * math.pi * (i / 8)
        radius = stimulus_size * 1.05
        x = math.cos(theta_cur) * radius
        y = math.sin(theta_cur) * radius
        return x, y

    for i in range(len(choices)):
        xcur, ycur = get_xy(i)
        card = nk.cards.ImageCard(
            image=choices[i],
            region=nk.Region(
                w=choice_size,
                h=choice_size,
                x=xcur,
                y=ycur,
            ),
        )
        choice_cards[f"choice{i}"] = card

    choice_node = nk.Node(
        stimulus=None,
        sensor=nk.sensors.SelectSensor(choices=choice_cards),
    )

    # Punish node
    punish_color = (200, 0, 0)
    punish_node = nk.Node(
        stimulus=nk.cards.TextCard(
            text="Incorrect.",
            text_color=RGB_to_hex(punish_color),
            region=nk.Region(
                x=0,
                y=0,
                w=0.5,
                h=0.5,
            ),
            font_size=0.08,
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=1000),
    )

    reward_color = (50, 50, 200)
    reward_node = nk.Node(
        stimulus=nk.cards.TextCard(
            text="Correct!",
            text_color=RGB_to_hex(reward_color),
            region=nk.Region(
                x=0,
                y=0,
                w=0.5,
                h=0.5,
            ),
            font_size=0.08,
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=300),
    )

    trial = nk.Graph(
        nodes={
            "fixation": fixation_node,
            "stimulus": stimulus_node,
            "isi": isi_node,
            "choice": choice_node,
            "punish": punish_node,
            "reward": reward_node,
        },
        transitions={
            "fixation": nk.transitions.Go(to="stimulus"),
            "stimulus": nk.transitions.Go(to="isi"),
            "isi": nk.transitions.Go(to="choice"),
            "choice": nk.transitions.IfThenElse(
                if_=nk.expressions.Eq(
                    lhs=nk.expressions.LastAction(),
                    rhs=nk.expressions.Lit(value=f"choice{i_correct_choice}"),
                ),
                then=nk.transitions.Go(to="reward"),
                else_=nk.transitions.Go(to="punish"),
            ),
            "punish": nk.transitions.End(),
            "reward": nk.transitions.End(),
        },
        start="fixation",
    )
    return trial


# %%
if __name__ == "__main__":
    # %%
    import glob
    from pathlib import Path

    token_imagepaths = glob.glob("./token-images/*.png")
    class_to_token = {Path(path).stem: nk.assets.Image.from_path(path) for path in token_imagepaths}
    class_to_stims = {}
    for c in class_to_token.keys():
        class_to_stims[c] = [
            nk.assets.Image.from_path(p) for p in glob.glob(f"./stimulus-images/{c}/*.png")
        ]

    # Make trials
    import random

    random.seed(0)
    num_trials = 10
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
        )

        trials.append(trial)

    graph = nk.concat(trials)

    # %%
    from nodekit._internal.ops.simulation.simulate import simulate
    from nodekit._internal.ops.simulation.dummy_agent import DummyAgent

    trace = simulate(
        graph=graph,
        agent=DummyAgent(seed=0),
    )
