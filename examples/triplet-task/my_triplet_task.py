import glob
from typing import Literal

import nodekit as nk


# %%
def make_fixation_node() -> nk.Node:
    """
    Returns a Node implementing a fixation screen, where the participant must click on a white dot
    in the center of the Board.
    """

    fixation_card = nk.cards.TextCard(
        x=0, y=0, w=0.0375, h=0.0375, text=r"\+", font_size=0.03
    )

    clicked_fixation_dot_sensor = nk.sensors.ClickSensor(
        mask="ellipse",
        x=fixation_card.x,
        y=fixation_card.y,
        w=fixation_card.w,
        h=fixation_card.h,
    )

    return nk.Node(
        cards={"fixation": fixation_card},
        sensors={"fixation-acquired": clicked_fixation_dot_sensor},
    )


def make_positive_feedback_node() -> nk.Node:
    positive_card = nk.cards.TextCard(
        text="Correct!",
        font_size=0.05,
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        background_color="#32a852",
        text_color="#ffffff",
        justification_horizontal="center",
        justification_vertical="center",
    )
    positive_timeout_sensor = nk.sensors.TimeoutSensor(
        timeout_msec=500,
    )
    positive_node = nk.Node(
        cards={"feedback_message": positive_card},
        sensors={"wait": positive_timeout_sensor},
    )
    return positive_node


def make_negative_feedback_node() -> nk.Node:
    negative_card = nk.cards.TextCard(
        text="Incorrect.",
        font_size=0.05,
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        background_color="#a83232",
        text_color="#ffffff",
        justification_horizontal="center",
        justification_vertical="center",
    )
    negative_timeout_sensor = nk.sensors.TimeoutSensor(
        timeout_msec=1000,
    )

    negative_node = nk.Node(
        cards={"feedback_message": negative_card},
        sensors={"wait": negative_timeout_sensor},
    )
    return negative_node


# %%
def make_triplet_trial(
    stimulus_image: nk.assets.Image,
    choice_left_image: nk.assets.Image,
    choice_right_image: nk.assets.Image,
    correct_choice: Literal["L", "R"],
) -> nk.Graph:
    """
    Returns a Graph implementing a single trial of an image triplet task.
    """

    # Make main Node:
    stimulus_card = nk.cards.ImageCard(
        x=0,
        y=0,
        w=0.5,
        h=0.5,
        image=stimulus_image,
        start_msec=0,
        end_msec=200,
    )
    choice_left_card = nk.cards.ImageCard(
        x=-0.25,
        y=-0.3,
        w=0.2,
        h=0.2,
        image=choice_left_image,
        start_msec=200,
    )
    choice_right_card = nk.cards.ImageCard(
        x=0.25,
        y=-0.3,
        w=0.2,
        h=0.2,
        image=choice_right_image,
        start_msec=200,
    )

    left_sensor = nk.sensors.ClickSensor(
        mask="rectangle",
        x=choice_left_card.x,
        y=choice_left_card.y,
        w=choice_left_card.w,
        h=choice_left_card.h,
        start_msec=200,
    )
    right_sensor = nk.sensors.ClickSensor(
        mask="rectangle",
        x=choice_right_card.x,
        y=choice_right_card.y,
        w=choice_right_card.w,
        h=choice_right_card.h,
        start_msec=200,
    )

    timeout_sensor = nk.sensors.TimeoutSensor(
        timeout_msec=2000,
    )
    main_node = nk.Node(
        cards={
            "stimulus": stimulus_card,
            "choice_left": choice_left_card,
            "choice_right": choice_right_card,
        },
        sensors={
            "L": left_sensor,
            "R": right_sensor,
            "TO": timeout_sensor,
        },
        effects=[
            nk.effects.HidePointerEffect(
                start_msec=0,  # Hide pointer during the stimulus presentation
                end_msec=200,
            )
        ],
    )

    fixation_node = make_fixation_node()
    positive_node = make_positive_feedback_node()
    negative_node = make_negative_feedback_node()

    trial_graph = nk.Graph(
        nodes={
            "fixation": fixation_node,
            "main": main_node,
            "positive": positive_node,
            "negative": negative_node,
        },
        start="fixation",
        transitions={
            "fixation": {sensor_id: "main" for sensor_id in fixation_node.sensors},
            "main": {
                "R": "positive" if correct_choice == "R" else "negative",
                "L": "positive" if correct_choice == "L" else "negative",
                "TO": "negative",
            },
        },
    )
    return trial_graph


# %%
if __name__ == "__main__":
    my_image_files = []
    for path in sorted(glob.glob("./example_images/*")):
        image_file = nk.assets.Image.from_path(path)
        my_image_files.append(image_file)

    # %%
    my_trial1 = make_triplet_trial(
        stimulus_image=my_image_files[1],
        choice_left_image=my_image_files[1],
        choice_right_image=my_image_files[3],
        correct_choice="L",
    )
    my_trial2 = make_triplet_trial(
        stimulus_image=my_image_files[4],
        choice_left_image=my_image_files[4],
        choice_right_image=my_image_files[5],
        correct_choice="L",
    )

    my_trial3 = make_triplet_trial(
        stimulus_image=my_image_files[6],
        choice_left_image=my_image_files[7],
        choice_right_image=my_image_files[6],
        correct_choice="R",
    )

    graph = nk.concat([my_trial1, my_trial2, my_trial3])

    # %% Play the Graph now:
    trace = nk.play(graph)

    # %%
    print(f"Observed {len(trace.events)} events:")
    for event in trace.events:
        print(event.event_type)
