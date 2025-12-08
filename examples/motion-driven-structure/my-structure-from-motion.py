import nodekit as nk
from typing import Literal

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


# %%
def make_trial(
    stimulus: nk.assets.Video,
    left: nk.assets.Video,
    right: nk.assets.Video,
    correct_choice: Literal["left", "right"],
) -> nk.Graph:
    # Fixation node
    fixation_cross = nk.cards.ImageCard(
        image=nk.assets.Image.from_path("fixation-cross.svg"),
        region=nk.Region(x=0, y=0, w=0.05, h=0.05, mask="ellipse"),
    )
    fixation_node = nk.Node(
        stimulus=fixation_cross,
        sensor=nk.sensors.ClickSensor(
            region=fixation_cross.region,
        ),
    )

    # Stimulus node
    video_size = 0.4
    stimulus_node = nk.Node(
        stimulus=nk.cards.VideoCard(
            region=nk.Region(
                x=0,
                y=0,
                w=video_size,
                h=video_size,
            ),
            video=stimulus,
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=400),
        hide_pointer=True,
    )

    # ISI node
    isi_node = nk.Node(
        stimulus=None,
        sensor=nk.sensors.WaitSensor(duration_msec=100),
        hide_pointer=True,
    )

    # Choice node
    choices = {
        "left": nk.cards.VideoCard(
            region=nk.Region(
                x=-0.3,
                y=0,
                w=video_size,
                h=video_size,
            ),
            video=left,
            loop=True,
        ),
        "right": nk.cards.VideoCard(
            region=nk.Region(
                x=0.3,
                y=0,
                w=video_size,
                h=video_size,
            ),
            video=right,
            loop=True,
        ),
    }

    prompt = nk.cards.TextCard(
        text="Which object did you see previously?",
        region=nk.Region(
            x=0,
            y=0.35,
            w=0.35,
            h=0.1,
        ),
        background_color="#c8c8c8",
    )

    choice_node = nk.Node(
        stimulus=prompt,
        sensor=nk.sensors.SelectSensor(choices=choices),
    )

    # Make feedback nodes
    correct_string = "**Correct!**\nPress the spacebar to continue."
    incorrect_string = "Sorry, **wrong choice.**\nPress the spacebar to continue."

    correct_node = nk.Node(
        stimulus=nk.cards.TextCard(
            text=correct_string,
            region=nk.Region(
                x=0,
                y=0,
                w=0.5,
                h=0.15,
            ),
            justification_horizontal="center",
            background_color="#c8c8c8",
        ),
        sensor=nk.sensors.KeySensor(
            keys=[" "],
        ),
    )
    incorrect_node = nk.Node(
        stimulus=nk.cards.TextCard(
            text=incorrect_string,
            region=nk.Region(
                x=0,
                y=0,
                w=0.5,
                h=0.15,
            ),
            justification_horizontal="center",
            background_color="#c8c8c8",
        ),
        sensor=nk.sensors.KeySensor(
            keys=[" "],
        ),
    )

    graph = nk.Graph(
        start="fixation",
        nodes={
            "fixation": fixation_node,
            "stimulus": stimulus_node,
            "isi": isi_node,
            "choice": choice_node,
            "correct": correct_node,
            "incorrect": incorrect_node,
        },
        transitions={
            "fixation": nk.transitions.Go(to="stimulus"),
            "stimulus": nk.transitions.Go(to="isi"),
            "isi": nk.transitions.Go(to="choice"),
            "choice": nk.transitions.IfThenElse(
                if_=nk.expressions.Eq(
                    lhs=nk.expressions.GetDictValue(
                        d=nk.expressions.LastAction(),
                        key=nk.expressions.Lit(value="selection"),
                    ),
                    rhs=nk.expressions.Lit(value=correct_choice),
                ),
                then=nk.transitions.Go(to="correct"),
                else_=nk.transitions.Go(to="incorrect"),
            ),
            "correct": nk.transitions.End(),
            "incorrect": nk.transitions.End(),
        },
    )

    return graph


# %%
if __name__ == "__main__":
    easy_trial = make_trial(
        stimulus=nk.assets.Video.from_path("./stimuli/1/1.mp4"),
        left=nk.assets.Video.from_path("./stimuli/1/2.mp4"),
        right=nk.assets.Video.from_path("./stimuli/1/8.mp4"),
        correct_choice="left",
    )

    trial_2 = make_trial(
        stimulus=nk.assets.Video.from_path("./stimuli/2/2-stim.mp4"),
        left=nk.assets.Video.from_path("./stimuli/2/2-left.mp4"),
        right=nk.assets.Video.from_path("./stimuli/2/2-right.mp4"),
        correct_choice="left",
    )

    trial_3 = make_trial(
        stimulus=nk.assets.Video.from_path("./stimuli/3/3-stim.mp4"),
        left=nk.assets.Video.from_path("./stimuli/3/3-left.mp4"),
        right=nk.assets.Video.from_path("./stimuli/3/3-right.mp4"),
        correct_choice="right",
    )

    graph = nk.concat(
        [
            easy_trial,
            trial_2,
            trial_3,
        ]
    )

    nk.play(graph)
