from enum import Enum
from pathlib import Path

import nodekit as nk
import random
import pandas as pd
import pydantic
import matplotlib.pyplot as plt
# %%
class StroopColor(str, Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"
    YELLOW = "yellow"


def to_hex(color: StroopColor) -> str:
    if color == StroopColor.RED:
        return "#FF0000"
    elif color == StroopColor.GREEN:
        return "#00FF00"
    elif color == StroopColor.BLUE:
        return "#0000FF"
    elif color == StroopColor.YELLOW:
        return "#FFFF00"
    else:
        raise ValueError(f"Unknown color: {color}")


# %%
def make_stroop_instructions() -> nk.Node:
    markdown_instructions = Path("my_stroop_instructions.md").read_text()

    instructions_card = nk.cards.TextCard(
        x=0,
        y=0,
        w=1,
        h=0.8,
        text=str(markdown_instructions),
        justification_horizontal="left",
    )
    press_spacebar_card = nk.cards.TextCard(
        x=0,
        y=-0.4,
        w=0.5,
        h=0.1,
        text="Press the **spacebar** to begin.",
        font_size=0.02,
        background_color="#e8e8e8",
        justification_horizontal="center",
        justification_vertical="center",
        start_msec=4000,
    )
    next_sensor = nk.sensors.KeySensor(
        key=" ",
        start_msec=press_spacebar_card.start_msec,
    )
    return nk.Node(
        cards={
            "instructions": instructions_card,
            "press-spacebar": press_spacebar_card,
        },
        sensors={
            "done-reading-instructions": next_sensor,
        },
        board_color="#FFFFFF",  # White background
    )


def make_stroop_trial(
    stimulus_color: StroopColor,
    stimulus_word: StroopColor,
    max_response_time_msec: int = 5000,
) -> nk.Graph:
    """
    The correct response is always the color of the text, not the word itself.
    """

    # Make the main node
    stimulus_card = nk.cards.TextCard(
        x=0,
        y=0,
        w=0.5,
        h=0.2,
        text=stimulus_word.value.upper(),
        font_size=0.1,
        text_color=to_hex(stimulus_color),
        justification_horizontal="center",
        justification_vertical="center",
        start_msec=0,
    )

    sensors = {
        "red": nk.sensors.KeySensor(
            key="r",
        ),
        "green": nk.sensors.KeySensor(
            key="g",
        ),
        "blue": nk.sensors.KeySensor(
            key="b",
        ),
        "yellow": nk.sensors.KeySensor(
            key="y",
        ),
        "timeout": nk.sensors.TimeoutSensor(
            timeout_msec=max_response_time_msec,
        ),
    }

    main_node = nk.Node(
        cards={"stroop-stimulus": stimulus_card},
        sensors=sensors,
        board_color="#FFFFFF",  # White background
    )

    # Make the reinforcer nodes
    correct_node = nk.Node(
        cards={
            "feedback-message": nk.cards.TextCard(
                x=0,
                y=0,
                w=0.5,
                h=0.2,
                text="Correct!",
                font_size=0.1,
                justification_horizontal="center",
                justification_vertical="center",
            )
        },
        sensors={
            "wait": nk.sensors.TimeoutSensor(
                timeout_msec=500,
            )
        },
        board_color="#FFFFFF",  # White background
    )
    incorrect_node = nk.Node(
        cards={
            "feedback-message": nk.cards.TextCard(
                x=0,
                y=0,
                w=0.5,
                h=0.2,
                text="Incorrect.",
                font_size=0.1,
                justification_horizontal="center",
                justification_vertical="center",
            )
        },
        sensors={
            "wait": nk.sensors.TimeoutSensor(
                timeout_msec=2000,
            )
        },
        board_color="#FFFFFF",  # White background
    )

    too_slow_node = nk.Node(
        cards={
            "feedback-message": nk.cards.TextCard(
                x=0,
                y=0,
                w=0.5,
                h=0.2,
                text="Too slow!",
                font_size=0.1,
                justification_horizontal="center",
                justification_vertical="center",
            )
        },
        sensors={
            "wait": nk.sensors.TimeoutSensor(
                timeout_msec=2000,
            )
        },
        board_color="#FFFFFF",  # White background
    )

    # Make the fixation node; need to press spacebar to continue
    fixation_card = nk.cards.TextCard(
        x=0,
        y=0,
        w=0.2,
        h=0.2,
        text="\+",
        font_size=0.1,
        justification_horizontal="center",
        justification_vertical="center",
    )
    fixation_sensor = nk.sensors.KeySensor(
        key=" ",
    )
    fixation_node = nk.Node(
        cards={
            "fixation-cross": fixation_card,
        },
        sensors={
            "fixated": fixation_sensor,
        },
        board_color="#FFFFFF",  # White background
    )

    # Connect the nodes
    return nk.Graph(
        nodes={
            "fixation": fixation_node,
            "main": main_node,
            "correct": correct_node,
            "incorrect": incorrect_node,
            "too_slow": too_slow_node,
        },
        transitions={
            "fixation": {
                "fixated": "main",
            },
            "main": {
                "red": "correct" if stimulus_color == StroopColor.RED else "incorrect",
                "green": "correct"
                if stimulus_color == StroopColor.GREEN
                else "incorrect",
                "blue": "correct"
                if stimulus_color == StroopColor.BLUE
                else "incorrect",
                "yellow": "correct"
                if stimulus_color == StroopColor.YELLOW
                else "incorrect",
                "timeout": "too_slow",
            },
        },
        start="fixation",
    )


# %%
class StroopTrialResult(pydantic.BaseModel):
    text: StroopColor
    text_color: StroopColor
    report: StroopColor
    reaction_time_msec: int = pydantic.Field(ge = 0)


# %%
if __name__ == "__main__":
    # Make a simple Stroop task with a few trials
    random.seed(42)
    trials = [
        make_stroop_trial(
            stimulus_color=random.choice(list(StroopColor)),
            stimulus_word=random.choice(list(StroopColor)),
        )
        for _ in range(5)
    ]
    stroop_task = nk.concat(
        [make_stroop_instructions()] + trials,
    )

    trace = nk.play(stroop_task)

    # Project a tidy DataFrame from the Trace

