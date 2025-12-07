# Matrices sourced from the MaRs-IB set of Chierchia et al.
# https://osf.io/3wbr6/overview
# Item set 1; tf.zip
import os.path
import re
from typing import Literal, Optional, Tuple

from pydantic import BaseModel, Field

import nodekit as nk


# %%
class MarsItem(BaseModel):
    form: int = Field(..., description="Test/form family (tfN)")
    item: int = Field(..., description="Item ID within form")
    tile_type: Literal["M", "T"] = Field(
        ..., description="'M' for missing tile or 'T' for test option"
    )
    tile_index: Optional[int] = Field(
        None, description="Tile index (1–4) if applicable"
    )
    shape_set: int = Field(..., description="Shape set index (ss1–ss3)")
    variant: Optional[Literal["pd", "md"]] = Field(
        None, description="Presentation variant"
    )
    ext: str = Field(..., description="File extension (e.g. jpeg)")

    @classmethod
    def parse_filename(cls, filename: str) -> "MarsItem":
        """
        Parse filenames of the form:
        tf1_1_M_ss3.jpeg
        tf1_1_T1_ss3_md.jpeg
        """
        pattern = re.compile(
            r"^tf(?P<form>\d+)_"
            r"(?P<item>\d+)_"
            r"(?P<tile>(M|T\d))_"
            r"ss(?P<shape_set>\d)"
            r"(?:_(?P<variant>md|pd))?"
            r"\.(?P<ext>\w+)$"
        )

        match = pattern.match(filename)
        if not match:
            raise ValueError(f"Invalid filename format: {filename}")

        gd = match.groupdict()
        tile = gd["tile"]
        tile_type = "M" if tile == "M" else "T"
        tile_index = None if tile == "M" else int(tile[1])

        return cls(
            form=int(gd["form"]),
            item=int(gd["item"]),
            tile_type=tile_type,
            tile_index=tile_index,
            shape_set=int(gd["shape_set"]),
            variant=gd["variant"],
            ext=gd["ext"],
        )


# %%
def make_mars_trial(
    grid_image: nk.assets.Image,
    choices: Tuple[nk.assets.Image, nk.assets.Image, nk.assets.Image, nk.assets.Image],
) -> nk.Graph:
    # Start with a fixation cross that disappears on its own
    fixation_duration = 1000

    fixation_node = nk.Node(
        stimulus=nk.cards.TextCard(
            text=r"\+",
            font_size=0.05,
            region=nk.Region(
                x=0,
                y=0.15,
                w=0.07,
                h=0.07,
            ),
        ),
        sensor=nk.sensors.WaitSensor(duration_msec=fixation_duration),
        board_color="#ffffff",
    )

    # Choice cards
    choice_size = 0.16
    choice_y = -0.35

    choice_cards = []
    for i in range(len(choices)):
        choice_x_cur = -0.375 + 0.25 * i
        choice_card = nk.cards.ImageCard(
            image=choices[i],
            region=nk.Region(
                x=choice_x_cur,
                y=choice_y,
                w=choice_size,
                h=choice_size,
                z_index=1,
            ),
        )
        choice_cards.append(choice_card)

    matrix_node = nk.Node(
        stimulus=nk.cards.ImageCard(
            image=grid_image,
            region=nk.Region(
                x=0,
                y=0.15,
                w=0.5,
                h=0.5,
            ),
        ),
        sensor=nk.sensors.SelectSensor(
            choices={f"chose{i}": choice_cards[i] for i in range(len(choice_cards))}
        ),
        board_color="#ffffff",
    )

    graph = nk.Graph(
        nodes={
            "fixation": fixation_node,
            "matrix": matrix_node,
        },
        transitions={
            "fixation": nk.transitions.Go(to="matrix"),
            "matrix": nk.transitions.End(),
        },
        start="fixation",
    )

    return graph


# %%

# %%
if __name__ == "__main__":
    import glob

    paths = glob.glob("./items-png/tf1/**/*.png", recursive=True)
    for path in paths:
        item = MarsItem.parse_filename(os.path.basename(path))

    import random

    random.seed(0)

    trials = []
    for i in range(10):
        item = i + 1
        stim_path = glob.glob(f"./items-png/tf1/{item}/tf1_{item}_M_ss*.png")[0]
        correct_choice = glob.glob(f"./items-png/tf1/{item}/tf1_{item}_T1_ss*_md.png")[
            0
        ]
        distractor1 = glob.glob(f"./items-png/tf1/{item}/tf1_{item}_T2_ss*_md.png")[0]
        distractor2 = glob.glob(f"./items-png/tf1/{item}/tf1_{item}_T3_ss*_md.png")[0]
        distractor3 = glob.glob(f"./items-png/tf1/{item}/tf1_{item}_T4_ss*_md.png")[0]

        choices = [
            nk.assets.Image.from_path(correct_choice),
            nk.assets.Image.from_path(distractor1),
            nk.assets.Image.from_path(distractor2),
            nk.assets.Image.from_path(distractor3),
        ]
        random.shuffle(choices)
        trial = make_mars_trial(
            grid_image=nk.assets.Image.from_path(stim_path), choices=tuple(choices)
        )
        trials.append(trial)

    graph = nk.concat(trials)
    nk.play(graph)
