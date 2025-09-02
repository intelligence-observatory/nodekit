import pydantic

from nodekit._internal.models.node_engine.base import DslModel


# %% Board
class Board(DslModel):
    board_width_px: int = pydantic.Field(default=768, gt=0)
    board_height_px: int = pydantic.Field(default=768, gt=0)
