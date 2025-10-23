# Matrices sourced from the MaRs-IB set of Chierchia et al.
# https://osf.io/3wbr6/overview
# Item set 1; tf.zip
import os.path

from pydantic import BaseModel, Field
import re
from typing import Literal, Optional

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

import PIL.Image
from pathlib import Path
import glob
paths = glob.glob('./items/tf1/*.jpeg')
for path in paths:
    image = PIL.Image.open(path).convert('RGB')
    # Filename structure:
    # tf1_{item_id:int}


    item = MarsItem.parse_filename(os.path.basename(path))

    savepath = Path('items-png') / f'tf{item.form}' / f'{item.item}' / os.path.basename(path).replace('.jpeg', '.png')
    if not savepath.parent.exists():
        savepath.parent.mkdir(parents=True)
    image.save(savepath)
    image.close()