# Matrices sourced from the MaRs-IB set of Chierchia et al.
# https://osf.io/3wbr6/overview
# Item set 1; tf.zip
import os.path
import random
import re
from typing import Literal, Optional
from typing import Tuple
from pydantic import BaseModel, Field
import nodekit as nk


# %%
class MarsItem(BaseModel):
    form: int = Field(..., description="Test/form family (tfN)")
    item: int = Field(..., description="Item ID within form")
    tile_type: Literal["M", "T"] = Field(..., description="'M' for missing tile or 'T' for test option")
    tile_index: Optional[int] = Field(None, description="Tile index (1–4) if applicable")
    shape_set: int = Field(..., description="Shape set index (ss1–ss3)")
    variant: Optional[Literal["pd", "md"]] = Field(None, description="Presentation variant")
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
        choices:Tuple[nk.assets.Image, nk.assets.Image, nk.assets.Image, nk.assets.Image],
) -> nk.Node:
    # Start with a fixation cross that disappears on its own
    fixation_duration=1000

    grid_card = nk.cards.ImageCard(
        image=grid_image,
        x=0,
        y=0.15,
        w=0.5,
        h=0.5,
        start_msec=fixation_duration,
    )
    fixation_card = nk.cards.TextCard(text=r'\+', font_size=0.05, x=grid_card.x,y=grid_card.y,w=0.07, h=0.07, start_msec=0, end_msec=fixation_duration)


    # Choice cards
    choice_size = 0.16
    choice_y = -0.35

    choice_cards = []
    text_overlays = []
    for i in range(len(choices)):
        choice_x_cur = -0.375 + 0.25 * i
        choice_card = nk.cards.ImageCard(
            image=choices[i],
            x=choice_x_cur,
            y=choice_y,
            w=choice_size,
            h=choice_size,
            z_index=1,
            start_msec=fixation_duration,
        )
        choice_cards.append(choice_card)

        text_overlays.append(
            nk.cards.TextCard(
                text = ' ',
                selectable=True,
                x=choice_card.x,
                y=choice_card.y,
                w=choice_card.w*1.1,
                h=choice_card.h*1.1,
                z_index=0,
                start_msec=choice_card.start_msec,
                end_msec=choice_card.end_msec,
            )
        )

        # Temporary hack: add some text cards for the hover effect

    return nk.Node(
        cards={
            'fixation': fixation_card,
            'grid': grid_card,
            'choice0': choice_cards[0],
            'choice1': choice_cards[1],
            'choice2': choice_cards[2],
            'choice3': choice_cards[3],
            'overlay0': text_overlays[0],
            'overlay1': text_overlays[1],
            'overlay2': text_overlays[2],
            'overlay3': text_overlays[3],
        },
        sensors = {
            f'chose{i}': nk.sensors.ClickSensor(
                x=choice_cards[i].x,
                y=choice_cards[i].y,
                w=choice_cards[i].w,
                h=choice_cards[i].h,
                start_msec=choice_cards[i].start_msec,
            ) for i in range(len(choice_cards))
        },
        board_color="#ffffff",
    )



# %%

# %%
if __name__ == '__main__':
    import glob

    paths = glob.glob('./items-png/tf1/**/*.png', recursive=True)
    for path in paths:
        item = MarsItem.parse_filename(os.path.basename(path))

    import random
    random.seed(0)

    trials = []
    for i in range(20):
        item = i+1
        stim_path=glob.glob(f'./items-png/tf1/{item}/tf1_{item}_M_ss*.png')[0]
        correct_choice= glob.glob(f'./items-png/tf1/{item}/tf1_{item}_T1_ss*_md.png')[0]
        distractor1 =   glob.glob(f'./items-png/tf1/{item}/tf1_{item}_T2_ss*_md.png')[0]
        distractor2 =   glob.glob(f'./items-png/tf1/{item}/tf1_{item}_T3_ss*_md.png')[0]
        distractor3 =   glob.glob(f'./items-png/tf1/{item}/tf1_{item}_T4_ss*_md.png')[0]

        choices = [
            nk.assets.Image.from_path(correct_choice),
            nk.assets.Image.from_path(distractor1),
            nk.assets.Image.from_path(distractor2),
            nk.assets.Image.from_path(distractor3),
        ]
        random.shuffle(choices)
        trial = make_mars_trial(
            grid_image=nk.assets.Image.from_path(stim_path),
            choices=tuple(choices)
        )
        trials.append(trial)

    graph = nk.concat(trials)
    nk.play(graph)