"""
Reproduces the paradigm described in "Physion..." by Bear et al. Neurips 2021
https://cogtoolslab.github.io/pdf/BWMB_neurips_2021.pdf

* Show fixation cross between 500 and 1500 ms
  * Show first frame of video for 2000 msec. During this time, flash an overlay on/off at 2 Hz – i.e. 4 cycles
  * Then play video for 1500 msec
  * Then remove the video and activate yes/no buttons; randomized order.
    * I will also add a text prompt.
  * provide feedback at end of session
"""

import nodekit as nk
import random
from typing import Literal


def make_physion_trial(
    seed: int,
    selector_mask: nk.assets.Image,
    video: nk.assets.Video,
    prompt: str = "Will the red object touch the yellow object?",
    correct_answer: Literal["yes", "no", None] = None,  # If None, show no feedback
) -> nk.Graph:
    gen = random.Random(seed)

    fixation_node = nk.Node(
        cards={
            "fixation-cross": nk.cards.TextCard(
                x=0, y=0, w=0.1, h=0.1, text=r"\+", font_size=0.1
            )
        },
        sensors={
            "fixated": nk.sensors.WaitSensor(
                until_msec=int(gen.random() * 1000 + 500)
            )
        },
    )

    video_card = nk.cards.VideoCard(
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        z_index=1,
        video=video,
        start_msec=0,
        end_msec=3501,
        start=False,
    )

    # hack
    video_card_playing = nk.cards.VideoCard(
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        z_index=2,
        video=video,
        start_msec=2000,
        end_msec=3500,
        start=True,
    )

    background_color = "#d4d2d2"
    button_color = "#e3e3e3"
    prompt_card = nk.cards.TextCard(
        start_msec=3800,
        end_msec=None,
        text=prompt,
        x=0,
        y=0,
        w=1,
        h=0.2,
        background_color=background_color,
        font_size=0.04,
    )

    yes_card = nk.cards.TextCard(
        start_msec=prompt_card.start_msec,
        end_msec=None,
        text="**Yes**",
        x=-0.4,
        y=-0.42,
        w=0.2,
        h=0.1,
        font_size=0.05,
        background_color=button_color,
        selectable=True,
    )

    no_card = nk.cards.TextCard(
        start_msec=prompt_card.start_msec,
        end_msec=None,
        text="**No**",
        x=0.4,
        y=-0.42,
        w=0.2,
        h=0.1,
        font_size=yes_card.font_size,
        background_color=button_color,
        selectable=True,
    )

    # Schedule the mask flickers
    def make_mask_card(i):
        return nk.cards.ImageCard(
            x=video_card.x,
            y=video_card.y,
            w=video_card.w,
            h=video_card.h,
            z_index=10,
            image=selector_mask,
            start_msec=i * 1000,
            end_msec=i * 1000 + 500,
        )

    main_node = nk.Node(
        cards={
            "video": video_card,
            "video-playing": video_card_playing,
            "prompt": prompt_card,
            "yes-card": yes_card,
            "no_card": no_card,
        }
        | {f"selector-frame-{i}": make_mask_card(i) for i in range(2)},
        sensors={
            "yes": nk.sensors.ClickSensor(
                start_msec=yes_card.start_msec,
                end_msec=yes_card.end_msec,
                x=yes_card.x,
                y=yes_card.y,
                w=yes_card.w,
                h=yes_card.h,
            ),
            "no": nk.sensors.ClickSensor(
                start_msec=no_card.start_msec,
                end_msec=no_card.end_msec,
                x=no_card.x,
                y=no_card.y,
                w=no_card.w,
                h=no_card.h,
            ),
        },
        effects=[
            nk.effects.HidePointerEffect(
                start_msec=0,
                end_msec=3500,
            )
        ],
    )

    # Feedback nodes
    # Punish node
    punish_color = (200, 0, 0)

    def RGB_to_hex(RGB):
        return "#%02x%02x%02x" % RGB

    punish_node = nk.Node(
        cards={
            "feedback": nk.cards.TextCard(
                text="Incorrect.",
                text_color=RGB_to_hex(punish_color),
                x=0,
                y=0,
                w=0.5,
                h=0.5,
                font_size=0.08,
            )
        },
        sensors={"wait": nk.sensors.WaitSensor(until_msec=1000)},
    )

    reward_color = (50, 50, 200)
    reward_node = nk.Node(
        cards={
            "feedback": nk.cards.TextCard(
                text="Correct!",
                text_color=RGB_to_hex(reward_color),
                x=0,
                y=0,
                w=0.5,
                h=0.5,
                font_size=0.08,
            )
        },
        sensors={"wait": nk.sensors.WaitSensor(until_msec=300)},
    )

    transitions = {
        "fixation": {"fixated": "main"},
    }

    if correct_answer:
        transitions["main"] = {
            "yes": "reward" if correct_answer == "yes" else "punish",
            "no": "reward" if correct_answer == "no" else "punish",
        }

    return nk.Graph(
        nodes={
            "fixation": fixation_node,
            "main": main_node,
            "reward": reward_node,
            "punish": punish_node,
        },
        start="fixation",
        transitions=transitions,
    )


# %%
if __name__ == "__main__":
    trial1 = make_physion_trial(
        seed=0,
        selector_mask=nk.assets.Image.from_path(
            "./stimuli/dominoes/pilot_dominoes_2mid_J020R15_d3chairs_o1plants_tdwroom_2_0024_map.png"
        ),
        video=nk.assets.Video.from_path(
            "./stimuli/dominoes/pilot_dominoes_2mid_J020R15_d3chairs_o1plants_tdwroom_2-redyellow_0024_img.mp4"
        ),
        correct_answer="no",
    )

    trial2 = make_physion_trial(
        seed=1,
        selector_mask=nk.assets.Image.from_path("./stimuli/drape/test14_0018_map.png"),
        video=nk.assets.Video.from_path(
            "./stimuli/drape/test14-redyellow_0018_img.mp4"
        ),
        correct_answer="yes",
    )

    trial3 = make_physion_trial(
        seed=2,
        selector_mask=nk.assets.Image.from_path(
            "./stimuli/support/pilot_towers_nb2_fr015_SJ010_mono0_dis0_occ0_tdwroom_0008_map.png"
        ),
        video=nk.assets.Video.from_path(
            "./stimuli/support/pilot_towers_nb2_fr015_SJ010_mono0_dis0_occ0_tdwroom-redyellow_0008_img.mp4"
        ),
        correct_answer="yes",
    )

    # %%

    # %%
    graph = nk.concat(
        [
            trial1,
            trial2,
            trial3,
        ]
    )

    nk.save_graph(graph, "physion-demo.nkg")
    trace = nk.play(graph)
