from enum import Enum
from pathlib import Path

import nodekit as nk
import random
import pydantic


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
        text=str(markdown_instructions),
        justification_horizontal="left",
        region=nk.Region(
            x=0,
            y=0,
            w=1,
            h=0.8,
        ),
    )
    press_spacebar_card = nk.cards.TextCard(
        region=nk.Region(
            x=0,
            y=-0.4,
            w=0.5,
            h=0.1,
        ),
        text="Press the **spacebar** to begin.",
        font_size=0.02,
        background_color="#e8e8e8",
        justification_horizontal="center",
        justification_vertical="center",
    )
    return nk.Node(
        stimulus=nk.cards.CompositeCard(
            children={
                "instructions": instructions_card,
                "press-spacebar": press_spacebar_card,
            }
        ),
        sensor=nk.sensors.KeySensor(
            keys=[" "],
        ),
        board_color="#FFFFFF",  # White background
    )


def make_stroop_trial(
    stimulus_color: StroopColor,
    stimulus_word: StroopColor,
) -> nk.Graph:
    """
    The correct response is always the color of the text, not the word itself.
    """

    # Make the main node
    main_node = nk.Node(
        stimulus=nk.cards.CompositeCard(
            children={
                "stroop-stimulus": nk.cards.TextCard(
                    region=nk.Region(
                        x=0,
                        y=0,
                        w=0.5,
                        h=0.2,
                    ),
                    text=stimulus_word.value.upper(),
                    font_size=0.1,
                    text_color=to_hex(stimulus_color),
                    justification_horizontal="center",
                    justification_vertical="center",
                ),
                "key-reminder":  nk.cards.TextCard(
                    region=nk.Region(
                        x=0,
                        y=-0.2,
                        w=1,
                        h=0.1,
                    ),
                    text="Is the ink color (r)ed, (g)reen, (b)lue, or (y)ellow?",
                )
            }
        ),
        sensor=nk.sensors.KeySensor(keys=['r', 'g', 'b', 'y',]),
        board_color="#FFFFFF",  # White background
    )

    # Make the reinforcer nodes
    correct_node = nk.Node(
        stimulus=nk.cards.TextCard(
            region=nk.Region(
                x=0,
                y=0,
                w=0.5,
                h=0.2,
            ),
            text="Correct!",
            font_size=0.1,
            justification_horizontal="center",
            justification_vertical="center",
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=500),
        board_color="#FFFFFF",  # White background
    )
    incorrect_node = nk.Node(
        stimulus=nk.cards.TextCard(
            region=nk.Region(
                x=0,
                y=0,
                w=0.5,
                h=0.2,
            ),
            text="Incorrect!",
            font_size=0.1,
            justification_horizontal="center",
            justification_vertical="center",
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=2000),
        board_color="#FFFFFF",  # White background
    )

    # Make the fixation node; need to press spacebar to continue
    fixation_node = nk.Node(
        stimulus=nk.cards.TextCard(
            region=nk.Region(
                x=0,
                y=0,
                w=0.2,
                h=0.2,
            ),
            text="\+",
            font_size=0.1,
            justification_horizontal="center",
            justification_vertical="center",
        ),
        sensor=nk.sensors.KeySensor(
            keys=[" "],
        ),
        board_color="#FFFFFF",  # White background
    )

    # Connect the nodes
    return nk.Graph(
        nodes={
            "fixation": fixation_node,
            "main": main_node,
            "correct": correct_node,
            "incorrect": incorrect_node,
        },
        transitions={
            "fixation": nk.transitions.Go(to="main"),
            "main": nk.transitions.Branch(
                cases=[
                    nk.transitions.Case(  # Correct response
                        when=nk.expressions.Eq(
                            lhs=nk.expressions.Lit(value=stimulus_color.value[0]),
                            rhs=nk.expressions.GetDictValue(
                                d=nk.expressions.LastAction(),
                                key=nk.expressions.Lit(value="key"),
                            )
                        ),
                        then=nk.transitions.Go(to="correct"),
                    ),
                ],
                otherwise=nk.transitions.Go(to="incorrect"),
            ),
        },
        start="fixation",
    )


# %%
class StroopTrialResult(pydantic.BaseModel):
    text: StroopColor
    text_color: StroopColor
    report: StroopColor
    reaction_time_msec: int = pydantic.Field(ge=0)


# %%
# %%
if __name__ == "__main__":
    # Make a simple Stroop task with a few trials
    random.seed(42)
    trials = []
    # trials.append(make_stroop_instructions())
    trials.extend(
        [
            make_stroop_trial(
                stimulus_color=random.choice(list(StroopColor)),
                stimulus_word=random.choice(list(StroopColor)),
            )
            for _ in range(50)
        ]
    )

    stroop_task = nk.concat(
        trials,
    )

    nk.save_graph(stroop_task, "my-stroop.nkg")

    trace = nk.play(stroop_task)

    # Project a tidy DataFrame from the Trace
