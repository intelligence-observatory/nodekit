import pydantic


# %% Board
class Board(pydantic.BaseModel):
    board_width_px: int = pydantic.Field(default=768, gt=0)
    board_height_px: int = pydantic.Field(default=768, gt=0)
